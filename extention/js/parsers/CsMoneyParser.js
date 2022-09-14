class CsMoneyParser extends DefaultParser{
    constructor() {
        super();
    }
    async parseInventory(url, cookies){
        return await this.parse(url, cookies);
    }
    async parseHistory(url, cookies){
        return await this.parse(url, cookies);
    }
}