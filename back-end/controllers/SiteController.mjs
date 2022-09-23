import ServerMessage from '../services/ServerMessageService.mjs';
import SiteService from '../services/SiteService.mjs';

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
  // Permission 'nobody'
  static async getSiteById(req, res, next) {
    try {
      const { siteId } = req.params;
      switch (false) {
        case await SiteService.isSiteExist(siteId):
          return next(ServerMessage.badRequest('Site not found'));
        default:
          const site = await SiteService.getSiteById(siteId);
          return next(ServerMessage.success('Site found', site));
      }
    } catch (error) {
      return next(ServerMessage.serverError(error));
    }
  }
  // Permission 'admin'
  static async createSite(req, res, next) {
    try {
      const { name, url } = req.body;
      const { logo } = req.files || {};
      switch (true) {
        case await SiteService.isEmpty(logo):
          return next(ServerMessage.badRequest('Logo not found'));
        case !await SiteService.isSiteNameValid(name):
          return next(ServerMessage.badRequest('Site already exist'));
        default:
          await SiteService.createSite(name, url, logo);
          return next(ServerMessage.success('Site created'));
      }
    } catch (error) {
      return next(ServerMessage.serverError(error));
    }
  }
  // Permission 'admin'
  static async deleteSite(req, res, next) {
    try {
      const { siteId } = req.params;
      switch (false) {
        case await SiteService.isSiteExist(siteId):
          return next(ServerMessage.badRequest('Site not found'));
        default:
          await SiteService.deleteSite(siteId);
          return next(ServerMessage.success('Site deleted'));
      }
    } catch (error) {
      return next(ServerMessage.serverError(error));
    }
  }
  // Permission 'admin'
  static async updateSite(req, res, next) {
    try {
      const { siteId } = req.params;
      const { name, url } = req.body;
      const { logo } = req.files || {};
      switch (false) {
        case await SiteService.isSiteExist(siteId):
          return next(ServerMessage.badRequest('Site not found'));
        default:
          await SiteService.updateSite(siteId, { name, url, logo });
          return next(ServerMessage.success('Site updated'));
      }
    } catch (error) {
      return next(ServerMessage.serverError(error));
    }
  }
  // Permission 'user'
  static async createHistory(req, res, next) {
    try {
      const { siteId } = req.params;
      const { balance, transactions, purchases } = req.body;
      switch (false) {
        case await SiteService.isSiteExist(siteId):
          return next(ServerMessage.badRequest('Site not found'));
        default:
          const history = await SiteService.createHistory(siteId, {
            balance, transactions, purchases,
          });
          return next(ServerMessage.success('History created', history));
      }
    } catch (error) {
      return next(ServerMessage.serverError(error));
    }
  }
  // Permission 'user'
  static async getHistories(req, res, next) {
    try {
      const histories = await SiteService.getHistories();
      return next(ServerMessage.success('Histories found', histories));
    } catch (error) {
      return next(ServerMessage.serverError(error));
    }
  }
  // Permission 'user'
  static async getHistoriesById(req, res, next) {
    try {
      const { siteId, historyId } = req.params;
      switch (false) {
        case await SiteService.isSiteExist(siteId):
          return next(ServerMessage.badRequest('Site not found'));
        case await SiteService.isHistoryExist(historyId):
          return next(ServerMessage.badRequest('History not found'));
        default:
          const history = await SiteService.getHistoriesById(siteId, historyId);
          return next(ServerMessage.success('History found', history));
      }
    } catch (error) {
      return next(ServerMessage.serverError(error));
    }
  }
  // Permission 'user'
  static async updateHistory(req, res, next) {
    try {
      const { siteId, historyId } = req.params;
      const { balance, transactions, purchases } = req.body;
      switch (false) {
        case await SiteService.isSiteExist(siteId):
          return next(ServerMessage.badRequest('Site not found'));
        case await SiteService.isHistoryExist(historyId):
          return next(ServerMessage.badRequest('History not found'));
        default:
          await SiteService.updateHistory(siteId, historyId, { balance, transactions, purchases });
          return next(ServerMessage.success('History updated'));
      }
    } catch (error) {
      return next(ServerMessage.serverError(error));
    }
  }
}

export default SiteController;
