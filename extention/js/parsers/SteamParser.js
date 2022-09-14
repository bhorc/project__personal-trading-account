class SteamParser extends DefaultParser {
    constructor(){
        super();
        this.response = {};
        this.html = '';
        this.descriptions = {};
        this.trades = [];
        this.items = [];
    }
    async parseInventory(url, cookies){
        this.response = await this.parse(url, cookies);
        this.items = this.response.assets.map(item => {
            let description = this.response.descriptions.find(desc => desc.classid === item.classid);
            return Object.assign(item, description);
        });
        return this.items;
    }
    async parseHistory(url, cookies){
        this.response = await this.parse(url, cookies);

        const convertTime = (time12h) => {
            const [time, modifier] = [time12h.slice(0, -2), time12h.slice(-2)];
            let [hours, minutes] = time.split(":");
            if (hours === "12") hours = "00";
            if (modifier === "pm") hours = parseInt(hours, 10) + 12;
            return `${hours}:${minutes}`;
        }
        const getTradeItemsData = (itemsGroup) => {
            if (!itemsGroup) return [];
            return [...itemsGroup.querySelectorAll('.history_item')].map(({id, dataset}) => {
                let description = Object.values(this.response.descriptions[730]).find(desc => desc.classid === dataset.classid);
                return Object.assign({ id, ...description }, dataset);
            });
        }

        const doc = document.createElement('div');
        doc.innerHTML = this.response.html;
        let rows = doc.querySelectorAll('.tradehistoryrow');
        for (let row of [...rows]){
            let event = row.querySelector('.tradehistory_event_description').firstChild.textContent.trim();
            let {href: profileURL, innerText: username} = row.querySelector('.tradehistory_event_description a') || {};
            let date = row.querySelector('.tradehistory_date').firstChild.textContent.trim();
            let time12h = row.querySelector('.tradehistory_timestamp').innerText.trim();
            let time = convertTime(time12h);
            let timestamp = Date.parse(`${date} ${time}`);
            let itemsGroups = [...row.querySelectorAll('.tradehistory_items')];
            let receivedGroup = itemsGroups.find(group => group.querySelector('.tradehistory_items_plusminus').innerText === '+');
            let deletedGroup = itemsGroups.find(group => group.querySelector('.tradehistory_items_plusminus').innerText === '-');
            let received = getTradeItemsData(receivedGroup);
            let deleted = getTradeItemsData(deletedGroup);
            this.trades.push({ event, timestamp, tradeInfo: { profileURL, username }, items: { received, deleted }});
        }
        return this.trades.sort((a,b) => b.timestamp - a.timestamp);
    }
}