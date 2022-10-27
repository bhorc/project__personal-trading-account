import { Site, History } from '../models/Models.mjs';
import FileService from './FileService.mjs';
import ContainsService from './ContainsService.mjs';

class NotificationService extends ContainsService {
  // Services for group verification
  static async isSiteDomainExist(domain) {
    const site = await Site.findOne({ domain });
    console.log(site);
    return !await this.isEmpty(site);
  }
  // Services for group middleware
  static getItemInfo(transactions) {
    const history = {};
    transactions.forEach((transaction) => {
      Object.keys(transaction).forEach((key) => {
        if (history[key] === undefined || history[key] === null) {
          history[key] = transaction[key];
        }
      });
    });
    return history;
  }
  // Services for group manipulation
  static async getSites() {
    const sites = await Site.find();
    return sites;
  }
  static async getSiteById(siteId) {
    const site = await Site.findById(siteId);
    return site;
  }
  static async createSite(domain, name, url, logo) {
    await Site.create({
      domain,
      name,
      url,
      logo: FileService.saveFile('./uploads', logo),
    });
  }
  static async deleteSite(domain) {
    const site = await Site.findOne({ domain });
    const { _id: siteId, logo } = site;
    FileService.deleteFile('./uploads', logo);
    await History.deleteMany({ siteId });
    await Site.deleteOne({ domain });
  }
  static async updateSite(oldDomain, options) {
    const site = await Site.findOne({ domain: oldDomain });
    const { _id: siteId, logo: oldLogo } = site;
    const {
      domain, name, url, logo: newLogo,
    } = options;
    if (newLogo) {
      FileService.deleteFile('./uploads', oldLogo);
    }
    const updatedSite = await Site.updateOne({ _id: siteId }, {
      $set: {
        ...(name && { name }),
        ...(domain && { domain }),
        ...(url && { url }),
        ...(newLogo && { logo: FileService.saveFile('./uploads', newLogo) }),
      },
    }, { new: true });
    return updatedSite;
  }
  static async createHistory(domain, options) {
    const { balance, transactions, purchases } = options;
    const { siteId } = await Site.findOne({ domain });
    const history = await History.create({
      siteId,
      balance,
      transactions,
      purchases,
    });
    return history;
  }
  static async getHistoriesById(siteId, historyId) {
    const history = await History.findById(historyId);
    return history;
  }
  static async updateHistory(siteId, historyId, options) {
    const { balance, transactions, purchases } = options;
    await History.updateOne({ _id: historyId, siteId }, {
      $set: {
        ...(balance && { balance }),
        ...(transactions && { transactions }),
        ...(purchases && { purchases }),
      },
    }, { new: true });
  }
  static async isHistoryExist(historyId) {
    return History.exists({ _id: historyId });
  }
  static async updateHistories(items) {
    const assetIdArray = items.map(({ assetId }) => assetId);
    const historyArray = await History.find({ assetId: { $in: assetIdArray } });
    const updatedHistories = items.map((item) => {
      const { assetId, transaction, steamId } = item;
      const { transactions = [] } = historyArray.find(({ assetId: id }) => assetId === id) || {};
      if (!transactions.includes(transaction)) {
        transactions.push(transaction);
      }
      return {
        ...this.getItemInfo(transactions),
        steamId,
        assetId,
        transactions,
      };
    });
    await History.bulkWrite(
      updatedHistories.map((history) => ({
        updateOne: {
          filter: { assetId: history.assetId },
          update: { $set: history },
          upsert: true,
          strict: true,
        },
      })),
    ).catch((error) => console.log(error));
  }
  static async getHistories(domains, steamId, options) {
    const {
      // method = ['All'],
      // status = ['All'],
      dateFrom = 0,
      dateTo = Date.now(),
      sortBy = 'createdAt',
      page = 0,
      limit = 15,
      sort = 'desc',
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
      // ...(method[0] !== 'All' && { method: { $in: method } }),
      // ...(status[0] !== 'All' && { status: { $in: status } }),
    };
    const count = await History.countDocuments(filter);
    const history = await History.find(filter)
      .sort({ [sortBy]: sort })
      .skip(page * limit)
      .limit(limit)
      .select('-_id -type');
    return [history, count];
  }
}

export default NotificationService;
