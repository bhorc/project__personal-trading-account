localStorage.extensionID = chrome.runtime.id;

class ParserManager {
    constructor(config) {
        this.parsers = [];
        this.config = config;
        this.init();
    }
    async readJsonFile(fileName) {
        return await fetch(`chrome-extension://${localStorage.extensionID}/${fileName}`).then(res => res.json());
    }
    async init() {
        const Properties = await this.readJsonFile(this.config);
        for (const property of Properties) {
            const parser = new Parser(property);
            this.parsers.push(parser);
        }
    }
}
class Parser {
    constructor({domain, origin, cookies, parseInfo}) {
        this.domain = domain;
        this.origin = origin;
        this.cookies = cookies;
        this.parseInfo = parseInfo;
        this.parser = this.chooseParser(domain);
        this.inventory = [];
        this.history = [];
        this.init();
    }
    chooseParser(domain){
        switch (domain) {
            case 'cs.money': return new CsMoneyParser();
            case 'old.cs.money': return new OldCsMoneyParser();
            case 'steamcommunity.com': return new SteamParser();
            case 'buff.163.com': return new BuffParser();
        }
    }
    async getCookie(domain = this.domain) {
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
    async init(){
        if (!this.parser) return;
        this.cookies = await this.getCookie();
        this.inventory = this.inventory.concat(await this.parser.parseInventory(this.parseInfo.inventory, this.origin, this.cookies));
        this.history = this.history.concat(await this.parser.parseHistory(this.parseInfo.history, this.origin, this.cookies));
    }
}

const Extension = new ParserManager("config.json");
console.log(Extension);