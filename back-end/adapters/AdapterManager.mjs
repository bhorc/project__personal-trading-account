import mapObject from 'map-obj';
import skinsBase from '../data/csgobackpack.skinsBase.json' assert { type: 'json' };

class defaultAdapter {
  static renameMap = {};
  static short_exterior = {
    'Factory New': 'FN',
    'Minimal Wear': 'MW',
    'Field-Tested': 'FT',
    'Well-Worn': 'WW',
    'Battle-Scarred': 'BS',
  }
  static renameObj(data, filter) {
    return mapObject(data, (key, value) => [filter[key] || key, value], { deep: true });
  }
  static renameObjects(data, filter) {
    return data.map((item) => this.renameObj(item, filter));
  }
  static mergeByKey(key, array1, array2) {
    return array1.map((item1) => {
      const item2 = array2.find((item) => item[key] === item1[key]);
      return item2 ? { ...item1, ...item2 } : item1;
    });
  }
  static normalizeTime(time) {
    if (typeof time === 'number' && (time + '').length < 13) {
      return time * 1000;
    }
    return time;
  }
  static improveItems(location, steamId, items) {
    return items.map((item) => {
      const {
        method = null,
        fullName = null,
        buyPrice = null,
        buyTime = null,
        currentSteamId = null,
        assetId = null,
        inspectDetails = null,
        feeFunds = null,
        salePrice = null,
        saleTime = null,
        status = null,
        updateTime = null,
      } = item;

      // csgobackpack skinsBase
      const {
        stattrak = false,
        souvenir = false,
        tournament = null,
        exterior = null,
        rarity = null,
        type: itemType = null,
        gun_type: gunType = null,
        weapon_type: weaponType = null,
        icon_url: iconUrl = null,
      } = skinsBase['items_list'][fullName] || {};

      const inspectLink = `steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S${currentSteamId}A${assetId}D${inspectDetails}`;
      const feePercent = feeFunds ? +((feeFunds / salePrice) * 100).toFixed(2) : null;
      const shortExterior = this.short_exterior[exterior] || null;
      const soldPrice = salePrice || null;
      const soldTime = status === 'sold' ? updateTime : null;

      return {
        ...item,
        steamId,
        transaction: {
          location,
          status: status.toLowerCase(),
          method: method.toLowerCase(),
          buyPrice,
          salePrice,
          soldPrice,
          feeFunds,
          feePercent,
          buyTime: this.normalizeTime(buyTime),
          saleTime: this.normalizeTime(saleTime),
          soldTime: this.normalizeTime(soldTime),
          createdAt: Date.now(),
        },
        inspectLink,
        exterior,
        shortExterior,
        rarity,
        itemType,
        gunType,
        weaponType,
        tournament,
        iconUrl,
        stattrak: Boolean(stattrak),
        souvenir: Boolean(souvenir),
      };
    });
  }
  static adapt(domain, steamId, data) {
    if (!data.length) return [];
    return this.improveItems(domain, steamId, this.renameObjects(data, this.renameMap));
  }
}

export default defaultAdapter;
