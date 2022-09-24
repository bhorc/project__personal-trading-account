class DefaultParser {
	constructor() {
		this.response = {};
	}
	async parse(Url, Origin, Cookie){
		if (!Url || !Origin || !Cookie) return [];
		chrome.runtime.onInstalled.addListener(async () => {
			const rules = [{
				id: 1,
				action: {
					type: 'modifyHeaders',
					requestHeaders: [{
						header: 'Referer',
						operation: 'set',
						value: Origin,
					}],
				},
				condition: {
					domains: [chrome.runtime.id],
					urlFilter: Origin + '/*',
					resourceTypes: ['xmlhttprequest'],
				},
			}];
			await chrome.declarativeNetRequest.updateDynamicRules({
				removeRuleIds: rules.map(r => r.id),
				addRules: rules,
			});
		});
		return await fetch(Url, { headers: { Cookie } })
			.then(res => res.json())
			.catch(function(exc) {
				throw new Error(exc);
			});
	}
}
