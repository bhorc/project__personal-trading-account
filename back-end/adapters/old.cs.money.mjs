import defaultAdapter from './AdapterManager.mjs';
import NameBase from '../data/old.cs.money.skinsBase.json' assert { type: 'json' };

class Adapter extends defaultAdapter {
  static renameMap = {
    current_assetid: 'assetId',
    current_steamid64: 'currentSteamId',
    custom_price: 'salePrice',
    fee: 'feeFunds',
    d: 'inspectDetails',
    floatvalue: 'float',
    hold_expiration: 'holdTime',
    listing_price: 'buyPrice',
    listing_time: 'buyTime',
    name_id: 'nameId',
    patternindex: 'pattern',
    update_time: 'updateTime',
  };
  static setNames(items) {
    return items.map((item) => {
      const { name_id } = item;
      const { m: fullName } = NameBase[name_id];
      return { ...item, fullName };
    });
  }
  static adapt(domain, steamId, data) {
    if (!data.length) return [];
    data = this.setNames(data);
    return super.adapt(domain, steamId, data);
  }
}

export default Adapter;
