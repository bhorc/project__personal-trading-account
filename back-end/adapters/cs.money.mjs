import defaultAdapter from './AdapterManager.mjs';

class Adapter extends defaultAdapter {
  static renameMap = {
    "price": "salePrice",
    "botPrice": "depositPrice",
    "steamId": "currentSteamId",
    "steamImg": "iconUrl",
    "inspect": "inspectDetails",
    "collection": "collectionName",
  };
  static async adapt(domain, steamId, data) {
    if (this.isEmpty(data.items)) return [];
    return super.adapt(domain, steamId, data.items);
  }
}

export default Adapter;
