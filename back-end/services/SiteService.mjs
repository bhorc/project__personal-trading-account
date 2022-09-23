import { Site, History } from '../models/Models.mjs';
import FileService from './FileService.mjs';
import ContainsService from './ContainsService.mjs';

class NotificationService extends ContainsService {
  // Services for group verification
  static async isSiteExist(siteId) {
    return Site.exists({ _id: siteId });
  }
  static async isSiteNameValid(name) {
    const site = await Site.findOne({ name });
    return !site;
  }
  static async isHistoryExist(historyId) {
    return History.exists({ _id: historyId });
  }
  // Services for group manipulation
  static async getSites() {
    const sites = await Site.find();
    return sites;
  }
  static async getSiteById(siteId) {
    const site = await Site.findById(siteId);
    return site;
  }
  static async createSite(name, url, logo) {
    await Site.create({
      name,
      url,
      logo: FileService.saveFile('./uploads', logo),
      created: Date.now(),
      updated: Date.now(),
    });
  }
  static async deleteSite(siteId) {
    const { logo } = await Site.findById(siteId);
    FileService.deleteFile('./uploads', logo);
    await History.deleteMany({ siteId });
    await Site.deleteOne({ _id: siteId });
  }
  static async updateSite(siteId, options) {
    const { logo } = await Site.findById(siteId);
    const { name, url, logo: newLogo } = options;
    const newOptions = { updated: Date.now() };
    if (name) {
      newOptions.name = name;
    }
    if (url) {
      newOptions.url = url;
    }
    if (newLogo) {
      FileService.deleteFile('./uploads', logo);
      newOptions.logo = FileService.saveFile('./uploads', newLogo);
    }
    const updatedSite = await Site.updateOne({ _id: siteId }, {
      $set: newOptions,
    }, { new: true });
    return updatedSite;
  }
  static async createHistory(siteId, options) {
    const { balance, transactions, purchases } = options;
    const history = await History.create({
      siteId,
      balance,
      transactions,
      purchases,
      created: Date.now(),
      updated: Date.now(),
    });
    return history;
  }
  static async getHistories() {
    const histories = await History.find();
    return histories;
  }
  static async getHistoriesById(siteId, historyId) {
    const history = await History.findById(historyId);
    return history;
  }
  static async updateHistory(siteId, historyId, options) {
    const { balance, transactions, purchases } = options;
    await History.updateOne({ _id: historyId, siteId }, {
      $set: {
        ...(balance && { balance }),
        ...(transactions && { transactions }),
        ...(purchases && { purchases }),
        updated: Date.now(),
      },
    }, { new: true });
  }
}

export default NotificationService;
