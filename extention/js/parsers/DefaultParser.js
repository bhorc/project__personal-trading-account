class DefaultParser {
    constructor() {
        this.response = {};
    }
    async parse(url, cookies){
        if (!url || !cookies) return [];
        return await fetch(url, { method: 'GET', cookies }).then(res => res.json());
    }
}