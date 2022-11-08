const SERVER_URL = "http://localhost:3001";
const TIME_UNITS = {
	get SECOND() { return 1000 },
	get MINUTE() { return 60 * this.SECOND },
	get HOUR() { return 60 * this.MINUTE },
	get DAY() { return 24 * this.HOUR },
	get MONTH() { return 30 * this.DAY },
}

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
	static cookies;
	static steamId;
	constructor({ domain, origin, description, parseOptions: { url, query, loop, response } }) {
		this.data = [];
		this.domain = domain;
		this.origin = origin;
		this.description = description;
		this.url = url;
		this.query = query || {};
		this.response = response || {};
		this.loop = loop || false;
		this.init();
	}
	async #getCookie(domain = this.domain) {
		this.cookies = await new Promise((resolve, reject) => {
			chrome.cookies.getAll({ domain }, (cookies) => {
				if (chrome.runtime.lastError) {
					reject(chrome.runtime.lastError);
				} else {
					const cookie = cookies.reduce((acc, cookie) => acc + cookie.name + '=' + cookie.value + '; ', '');
					resolve(cookie);
				}
			});
		});
		this.steamId = this.cookies.match(new RegExp(/(765\d{14})/g))[0];
	}
	async #parseData() {
		await this.#getCookie();
		if (!this.url || !this.origin || !this.cookies) return;
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
		await fetch(this.url + '?' + new URLSearchParams(this.query), {
			method: 'GET',
			headers: {
				Cookie: this.cookies,
			}
		})
			.then(res => res.json())
			.then(res => {
				this.data = res;
			})
			.catch((exc) => {
				throw new Error(exc);
			});
	}
	async updateHistory() {
		await this.#parseData();
		if (this.data instanceof Array && this.data.length === 0) return;
		if (this.data instanceof Object && Object.keys(this.data).length === 0) return;

		const { domain, steamId, data } = this;
		await fetch(SERVER_URL + '/api/site/createHistory', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ domain, steamId, data }),
		});
	}
	async init() {
		await this.updateHistory();
		if (this.loop) {
			const timer = setInterval(() => {
				this.response.forEach((key, value) => {
					switch (true) {
						case typeof value === 'number' && this.data[key].length >= value:
						case typeof value === 'string' && this.data[key] === value:
							return;
						default:
							clearInterval(timer);
					}
				});
				this.loop.forEach((key, value) => {
					switch (typeof value) {
						case 'number':
							this.query[key] += value;
							break;
						case 'string':
							this.query[key] = value;
							break;
						default:
							return;
					}
				});
				this.updateHistory();
			}, 30 * TIME_UNITS.MINUTE);
		}
	}
}

const Extension = new ParserManager("config.json");
console.log(Extension);
