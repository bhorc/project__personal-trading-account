import { Item } from '../models/Models.mjs';
import ContainsService from './ContainsService.mjs';

class ItemService extends ContainsService {
  static async getItems(histories) {
    const assetIdArray = histories.map(({ assetId }) => assetId);
    const items = await Item.find({ assetId: { $in: assetIdArray } }).select('-_id -type');
    return items;
  }
  static async createItems(newItems) {
    if (this.isEmpty(newItems)) return;
    await Item.insertMany(newItems);
  }
  static async updateItems(itemsArray, updateItems) {
    if (this.isEmpty(itemsArray)) return;
    if (this.isEmpty(updateItems)) return;

    const filteredUpdateItems = updateItems.map((updateItem) => {
      const itemHistory = itemsArray.find(({ assetId }) => assetId === updateItem.assetId) || {};
      return { ...itemHistory, ...updateItem };
    });
    await Item.bulkWrite(filteredUpdateItems.map((filteredUpdateItem) => ({
      updateOne: {
        filter: { assetId: filteredUpdateItem.assetId },
        update: { $set: filteredUpdateItem },
      }
    })));
  }
  static async upgradeItems(items) {
    if (this.isEmpty(items)) return;
    const incomingAssetIds = items.map(({ assetId }) => assetId);
    const itemsArray = await Item.find({ assetId: { $in: incomingAssetIds } }) || [];
    if (this.isEmpty(itemsArray)) {
      return await this.createItems(items);
    }
    const itemsAssetIds = itemsArray.map(({ assetId }) => assetId);
    const newItems = items.filter(({ assetId }) => !itemsAssetIds.includes(assetId));
    const updateItems = items.filter(({ assetId }) => itemsAssetIds.includes(assetId));
    await this.createItems(newItems);
    await this.updateItems(itemsArray, updateItems);
  }
}

export default ItemService;
