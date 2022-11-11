import skinsBase from '../data/csgobackpack.skinsBase.json' assert { type: 'json' };
import ContainsService from '../services/ContainsService.mjs';

class defaultAdapter extends ContainsService {
  static renameMap = {};
  static short_exterior = {
    'Factory New': 'FN',
    'Minimal Wear': 'MW',
    'Field-Tested': 'FT',
    'Well-Worn': 'WW',
    'Battle-Scarred': 'BS',
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
        status = 'inventory',
        method = 'deposit',
        fullName,
        buyPrice,
        depositPrice,
        buyTime,
        currentSteamId,
        assetId,
        inspectDetails,
        feeFunds,
        salePrice,
        saleTime,
        updateTime,
        overprice = null,
        collectionName = null,
        overpay = null,
      } = item;
      delete item.type;

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
      const shortExterior = this.short_exterior[exterior] || null;
      let soldPrice, soldTime, feePercent;
      if (status === 'sold') {
        soldPrice = salePrice;
        soldTime = updateTime;
      }
      if (feeFunds) {
        feePercent = +((feeFunds / salePrice) * 100).toFixed(2);
      }
      const newItem = {
        ...item,
        steamId,
        assetId: assetId.toString(),
        transaction: {
          location,
          status: status?.toLowerCase(),
          method: method?.toLowerCase(),
          buyPrice,
          depositPrice,
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
        overprice,
        collectionName,
        overpay,
        stattrak: Boolean(stattrak),
        souvenir: Boolean(souvenir),
      };
      return newItem;
    });
  }
  static async adapt(domain, steamId, data) {
    if (this.isEmpty(data)) return [];
    return this.improveItems(domain, steamId, this.renameObjects(data, this.renameMap));
  }
}

export default defaultAdapter;
