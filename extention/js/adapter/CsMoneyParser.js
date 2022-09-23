class CsMoneyParser extends DefaultParser{
    constructor() {
        super();
    }
    async parseInventory(url, origin, cookies){
        return await this.parse(url, origin, cookies);
    }
    async parseHistory(url, origin, cookies){
        return await this.parse(url, origin, cookies);
    }
}