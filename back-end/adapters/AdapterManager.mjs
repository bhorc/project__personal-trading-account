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
        method = undefined,
        fullName = undefined,
        buyPrice = undefined,
        buyTime = undefined,
        currentSteamId = undefined,
        assetId = undefined,
        inspectDetails = undefined,
        feeFunds = undefined,
        salePrice = undefined,
        saleTime = undefined,
        status = undefined,
        updateTime = undefined,
      } = item;

      // csgobackpack skinsBase
      const {
        stattrak = false,
        souvenir = false,
        tournament = undefined,
        exterior = undefined,
        rarity = undefined,
        type: itemType = undefined,
        gun_type: gunType = undefined,
        weapon_type: weaponType = undefined,
        icon_url: iconUrl = undefined,
      } = skinsBase['items_list'][fullName] || {};

      const inspectLink = `steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S${currentSteamId}A${assetId}D${inspectDetails}`;
      const feePercent = feeFunds ? +((feeFunds / salePrice) * 100).toFixed(2) : undefined;
      const shortExterior = this.short_exterior[exterior] || undefined;
      const soldPrice = salePrice || undefined;
      const soldTime = status === 'sold' ? updateTime : undefined;

      return {
        ...item,
        steamId,
        transaction: {
          location,
          status,
          method,
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
