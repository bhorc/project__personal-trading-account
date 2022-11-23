import ServerMessage from '../services/ServerMessageService.mjs';
import SiteService from '../services/SiteService.mjs';
import ContainsService from '../services/ContainsService.mjs';
import ItemService from '../services/ItemService.mjs';
import HistoryService from '../services/HistoryService.mjs';

class SiteController {
  // Permission 'nobody'
  static async getSites(req, res, next) {
    try {
      const sites = await SiteService.getSites();
      return next(ServerMessage.success('Sites found', sites));
    } catch (error) {
      return next(ServerMessage.serverError(error));
    }
  }
  // Permission 'admin'
  static async createSite(req, res, next) {
    try {
      const { domain, name, url } = req.body;
      const { logo } = req.files || {};
      switch (true) {
        case ContainsService.isEmpty(domain):
          return next(ServerMessage.badRequest('Domain is empty'));
        case ContainsService.isEmpty(logo):
          return next(ServerMessage.badRequest('Logo not found'));
        case await SiteService.isSiteDomainExist(domain):
          return next(ServerMessage.badRequest('Site already exist'));
        default:
          await SiteService.createSite(domain, name, url, logo);
          return next(ServerMessage.success('Site created'));
      }
    } catch (error) {
      return next(ServerMessage.serverError(error));
    }
  }
  // Permission 'admin'
  static async deleteSite(req, res, next) {
    try {
      const { domain } = req.body;
      switch (false) {
        case ContainsService.isEmpty(domain):
          return next(ServerMessage.badRequest('Domain is empty'));
        case await SiteService.isSiteDomainExist(domain):
          return next(ServerMessage.badRequest('Site not found'));
        default:
          await SiteService.deleteSite(domain);
          return next(ServerMessage.success('Site deleted'));
      }
    } catch (error) {
      return next(ServerMessage.serverError(error));
    }
  }
  // Permission 'admin'
  static async updateSite(req, res, next) {
    try {
      const { domain: oldDomain } = req.query;
      const { domain, name, url } = req.body;
      const { logo } = req.files || {};
      switch (false) {
        case ContainsService.isEmpty(oldDomain):
          return next(ServerMessage.badRequest('Domain is empty'));
        case await SiteService.isSiteDomainExist(oldDomain):
          return next(ServerMessage.badRequest('Site not found'));
        default:
          await SiteService.updateSite(oldDomain, {
            domain, name, url, logo,
          });
          return next(ServerMessage.success('Site updated'));
      }
    } catch (error) {
      return next(ServerMessage.serverError(error));
    }
  }
  // Permission 'user'
  static async createHistory(req, res, next) {
    try {
      const { domain, data } = req.body;
      const { steamId } = req.session.user;
      let Adapter, items;
      switch (true) {
        case ContainsService.isEmpty(domain):
          return next(ServerMessage.badRequest('Domain is empty'));
        case ContainsService.isEmpty(data):
          return next(ServerMessage.badRequest('Data is empty'));
        case await SiteService.isSiteDomainExist(domain):
          return next(ServerMessage.badRequest('Site not found'));
        case ContainsService.isEmpty({ default: Adapter } = await import(`../adapters/${domain}.mjs`)):
          return next(ServerMessage.conflict(`Adapter for ${domain} not found`));
        case ContainsService.isEmpty(items = await Adapter.adapt(domain, steamId, data)):
          return next(ServerMessage.badRequest('Adapted items is empty, nothing to update'));
        default:
          await ItemService.upgradeItems(items);
          await HistoryService.upgradeHistory(items);
          return res.json(ServerMessage.success('History created'));
      }
    } catch (error) {
      return next(ServerMessage.serverError(error));
    }
  }
  // Permission 'user'
  static async getHistories(req, res, next) {
    try {
      const { domain, ...options } = req.query;
      const { steamId } = req.session.user;
      switch (true) {
        case ContainsService.isEmpty(domain):
          return next(ServerMessage.badRequest('Domain is empty'));
        case await SiteService.isSiteDomainsExist(domain):
          return next(ServerMessage.notFound('Site not found'));
        default:
          const { histories, statistics, count: historiesCount } = await HistoryService.getHistories(domain, steamId, options);
          const { items, count: itemsCount } = await ItemService.getItems(histories);
          res.append('X-Total-Count', historiesCount);
          res.append('Access-Control-Expose-Headers', 'X-Total-Count');
          return next(ServerMessage.success('Histories found', { histories, statistics, items }));
      }
    } catch (error) {
      return next(ServerMessage.serverError(error));
    }
  }
}

export default SiteController;
