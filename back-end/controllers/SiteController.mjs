import ServerMessage from '../services/ServerMessageService.mjs';
import SiteService from '../services/SiteService.mjs';
import ContainsService from '../services/ContainsService.mjs';
import ItemService from '../services/ItemService.mjs';

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
        case await SiteService.isEmpty(logo):
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
      switch (true) {
        case await SiteService.isSiteDomainExist(domain):
          return next(ServerMessage.badRequest('Site not found'));
        case await ContainsService.isEmpty(data):
          return next(ServerMessage.badRequest('Data is empty'));
        default:
          const { default: Adapter } = await import(`../adapters/${domain}.mjs`);
          const items = Adapter.adapt(domain, steamId, data);
          await ItemService.updateItems(items);
          await SiteService.updateHistories(items);
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
        case await SiteService.isEmpty(domain):
          return next(ServerMessage.badRequest('Domain is empty'));
        default:
          const domains = domain instanceof Array ? domain.join(',').split(',') : [domain];
          const [histories, count] = await SiteService.getHistories(domains, steamId, options);
          const items = await ItemService.getItems(histories);
          res.append('X-Total-Count', count);
          res.append('Access-Control-Expose-Headers', 'X-Total-Count');
          return next(ServerMessage.success('Histories found', { histories, items }));
      }
    } catch (error) {
      return next(ServerMessage.serverError(error));
    }
  }
}

export default SiteController;
