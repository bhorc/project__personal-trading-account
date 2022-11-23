import { Site, History } from '../models/Models.mjs';
import FileService from './FileService.mjs';
import ContainsService from './ContainsService.mjs';

class NotificationService extends ContainsService {
  // Services for group verification
  static async isSiteDomainExist(domain) {
    const site = await Site.findOne({ domain });
    return this.isEmpty(site);
  }
  static async isSiteDomainsExist(domains) {
    const sites = await Site.find({ domain: { $in: domains } });
    return this.isEmpty(sites);
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
  static async createSite(domain, name, url, logo) {
    await Site.create({
      domain,
      name,
      url,
      logo: FileService.saveFile('./uploads', logo),
    });
  }
  static async deleteSite(domain) {
    const site = await Site.findOne({ domain });
    const { _id: siteId, logo } = site;
    FileService.deleteFile('./uploads', logo);
    await History.deleteMany({ siteId });
    await Site.deleteOne({ domain });
  }
  static async updateSite(oldDomain, options) {
    const site = await Site.findOne({ domain: oldDomain });
    const { _id: siteId, logo: oldLogo } = site;
    const {
      domain, name, url, logo: newLogo,
    } = options;
    if (newLogo) {
      FileService.deleteFile('./uploads', oldLogo);
    }
    const updatedSite = await Site.updateOne({ _id: siteId }, {
      $set: {
        ...(name && { name }),
        ...(domain && { domain }),
        ...(url && { url }),
        ...(newLogo && { logo: FileService.saveFile('./uploads', newLogo) }),
      },
    }, { new: true });
    return updatedSite;
  }
}

export default NotificationService;
