import { Item } from '../models/Models.mjs';
import ContainsService from './ContainsService.mjs';

class ItemService extends ContainsService {
  static async isItemExist(itemId) {
    return Item.exists({ _id: itemId });
  }
  static async getItems(histories) {
    const assetIdArray = histories.map(({ assetId }) => assetId);
    const items = await Item.find({ assetId: { $in: assetIdArray } }).select('-_id -type');
    return items;
  }
  static async createItem(item) {
    await Item.create(item);
  }
  static async createItems(items) {
    await Item.insertMany(items);
  }
  static async updateItems(items) {
    const assetIdArray = items.map(({ assetId }) => assetId);
    const itemArray = await Item.find({ assetId: { $in: assetIdArray } });
    const updatedItems = items.map((item) => {
      const { assetId } = item;
      const itemToUpdate = itemArray.find(({ assetId: id }) => assetId === id);
      return { ...itemToUpdate, ...item };
    });
    await Item.bulkWrite(
      updatedItems.map((item) => ({
        updateOne: {
          filter: { assetId: item.assetId },
          update: { $set: item },
          upsert: true,
          strict: true,
        },
      })),
    ).catch((error) => console.log(error));
  }
}

export default ItemService;
