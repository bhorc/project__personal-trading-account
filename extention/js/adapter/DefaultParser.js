class DefaultParser {
    constructor() {
        this.response = {};
    }
    async parse(url, origin, cookies){
        if (!url || !origin || !cookies) return [];
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Referer': origin,
                'Cookie': cookies
            }
        }).then(res => res.json()).catch(function(exc) {
            console.log(exc);
        });

        return response;
    }
}
