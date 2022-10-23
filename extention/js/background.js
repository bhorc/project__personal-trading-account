const server_url = "http://localhost:3001";

class ParserManager {
	constructor(fileName) {
		this.fileName = fileName;
		this.parsers = [];
		this.init();
	}
	async init() {
		const sitesList = await fetch(`${self.location.origin}/${this.fileName}`).then(res => res.json());
		for (const site of sitesList) {
			this.parsers.push(new Parser(site));
		}
	}
}
class Parser {
	constructor({ domain, origin, parseUrl }) {
		this.steamId = null;
		this.data = [];
		this.domain = domain;
		this.origin = origin;
		this.parseUrl = parseUrl;
		this.init();
	}
	async #getCookie(domain = this.domain) {
		return await new Promise((resolve, reject) => {
			chrome.cookies.getAll({ domain }, (cookies) => {
				if (chrome.runtime.lastError) {
					reject(chrome.runtime.lastError);
				} else {
					const cookie = cookies.reduce((acc, cookie) => acc + cookie.name + '=' + cookie.value + '; ', '');
					resolve(cookie);
				}
			});
		});
	}
	async #parse(url){
		const Cookie = await this.#getCookie();
		if (!url || !this.origin || !Cookie) return [];
		this.steamId = Cookie.match(new RegExp(/(765\d{14})/g))[0];
		const declarativeNetRequestRules = [{
			id: 1,
			action: {
				type: 'modifyHeaders',
				requestHeaders: [{
					header: 'Referer',
					operation: 'set',
					value: this.origin,
				}],
			},
			condition: {
				domains: [chrome.runtime.id],
				urlFilter: this.origin + '/*',
				resourceTypes: ['xmlhttprequest'],
			},
		}];
		await chrome.declarativeNetRequest.updateDynamicRules({
			removeRuleIds: declarativeNetRequestRules.map(r => r.id),
			addRules: declarativeNetRequestRules,
		});
		return await fetch(url, { headers: { Cookie } })
			.then(res => res.json())
			.catch((exc) => {
				throw new Error(exc);
			});
	}
	async init(){
		this.data = await this.#parse(this.parseUrl);
		await fetch(server_url + '/api/site/createHistory', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				domain: this.domain,
				steamId: this.steamId,
				data: this.data,
			}),
		});
	}
}

const Extension = new ParserManager("config.json");
console.log(Extension);
