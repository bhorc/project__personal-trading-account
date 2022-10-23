class OldCsMoneyParser {
	constructor() {
		this.response = {};
		this.items = [];
		this.transactions = [];
		this.base = {};
	}
	getName(nameId){
		return this.base[nameId]['m'];
	}
	async loadBase(){
		return new Promise(async (resolve, reject) => {
			const resp = await fetch(`chrome-extension://${chrome.runtime.id}/js/skinsBase/old.cs.money.json`)
				.then(res => res.json());
			resolve(resp);
		});
	}
	async parseInventory(url, origin, cookies){
		return await this.parse(url, origin, cookies);
	}
	async parseHistory(url, origin, cookies){
		this.base = await this.loadBase();
		this.response = await this.parse(url, origin, cookies);
		this.response.forEach(item => {
			const {
				method,
				status,
				stickers,
				current_assetid: assetid,
				current_steamid64: steamid,
				custom_price: salePrice,
				fee: feeFunds,
				d: inspectDetails,
				floatvalue: float,
				hold_expiration: holdTime,
				listing_price: buyPrice,
				listing_time: buyTime,
				name_id: nameId,
				patternindex: pattern,
				update_time: updateTime,
			} = item;
			const inspectLink = `steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S${steamid}A${assetid}D${inspectDetails}`;
			const feePercent = feeFunds ? +(feeFunds / salePrice * 100).toFixed(2) : null;
			const fullName = this.getName(nameId);
			const soldPrice = status === 'sold' ? salePrice : null;
			const soldTime = status === 'sold' ? updateTime : null;

			const {exterior, gun_type: gunType, icon_url: iconUrl, rarity, type: itemType, weapon_type: weaponType} = this.skinsBase[fullName] || {};

			this.items.push({
				assetid,
				fullName,
				exterior,
				rarity,
				itemType,
				weaponType,
				gunType,
				float,
				pattern,
				stickers,
				iconUrl,
				inspectLink,
				updateTime,
			});

			this.transactions.push({
				assetid,
				status,
				method,
				buyPrice,
				buyTime,
				salePrice,
				saleTime: updateTime,
				soldPrice,
				soldTime,
				holdTime,
				feeFunds,
				feePercent,
				timestamp: new Date().getTime(),
			});
		});

		return {
			items: this.items,
			transactions: this.transactions,
		}
	}
}
