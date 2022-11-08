import { History } from '../models/Models.mjs'
import ContainsService from './ContainsService.mjs';

class NotificationService extends ContainsService {
  static blockListKeys = ['_id', 'type', 'createdAt', 'updatedAt', '__v'];
  static transactionsKeys = Object.keys(History.schema.obj.transactions[0]).filter(key => !this.blockListKeys.includes(key));

  static async getHistories(domains, steamId, options) {
    const {
      method = ['All'],
      status = ['All'],
      page = 0,
      limit = 15,
      dateFrom = Date.now() - this.month,
      dateTo = Date.now(),
      sortBy = 'createdAt',
    } = options;
    const filter = {
      transactions: {
        $elemMatch: {
          location: {
            $in: domains,
          },
        },
      },
      steamId,
      [sortBy]: {
        $gte: new Date(dateFrom),
        $lte: new Date(dateTo),
      },
      ...(method[0] !== 'All' && { method: { $in: method.join(',').split(',') } }),
      ...(status[0] !== 'All' && { status: { $in: status.join(',').split(',') } }),
    };
    const count = await History.countDocuments(filter);
    const history = await History.find(filter)
      .skip(page * limit)
      .limit(limit)
      .select('-_id -type');
    return [history, count];
  }
  static async createHistories(newHistories) {
    if (this.isEmpty(newHistories)) return;
    newHistories.forEach((history) => history.transactions = [history.transaction]);
    await History.insertMany(newHistories);
  }
  static async updateHistories(historyArray, updateItems) {
    if (this.isEmpty(historyArray)) return;
    if (this.isEmpty(updateItems)) return;

    const filteredUpdateItems = updateItems.filter(({ assetId: itemAssetId, transaction: itemTransaction }) => {
      const { transactions = [] } = historyArray.find(({ assetId }) => assetId === itemAssetId) || {};
      return !transactions.some((transaction) => {
        return this.transactionsKeys.every(key => transaction[key] === itemTransaction[key]);
      });
    });
    await History.bulkWrite(filteredUpdateItems.map(({ assetId, transaction }) => ({
      updateOne: {
        filter: { assetId },
        update: { $push: { transactions: transaction } },
      },
    })));
  }
  static async upgradeHistory(items) {
    if (this.isEmpty(items)) return;
    const incomingAssetIds = items.map(({ assetId }) => assetId);
    const historyArray = await History.find({ assetId: { $in: incomingAssetIds } }) || [];
    if (this.isEmpty(historyArray)) {
      return await this.createHistories(items);
    }
    const historyAssetIds = historyArray.map(({ assetId }) => assetId);
    const newItems = items.filter(({ assetId }) => !historyAssetIds.includes(assetId));
    const updateItems = items.filter(({ assetId }) => historyAssetIds.includes(assetId));
    await this.createHistories(newItems);
    await this.updateHistories(historyArray, updateItems);
  }
}

export default NotificationService;
