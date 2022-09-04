import dotenv from 'dotenv';
import ServerError from '../union/ServerMessage.mjs';
import { Site, History } from '../models/models.mjs';
import fileService from "../services/fileService.mjs";
import ServerMessage from "../union/ServerMessage.mjs";
dotenv.config();

class SiteController {
    async deleteSite(req, res, next) {
        try {
            const {id} = req.query;
            const site = await Site.findOne({_id: id});
            if (!site) {
                return next(ServerError.badRequest("Site not found"));
            }
            await fileService.deleteFile(site.logo);
            await Site.deleteOne({_id: id});
            return next(ServerMessage.success("Site deleted"));
        } catch (error) {
            return next(ServerMessage.serverError(error));
        }
    }
    async addSite(req, res, next) {
        try {
            const {name, url} = req.body;
            const fileName = fileService.saveFile(req.files.logo);
            const site = await Site.create({name, url, logo: fileName});
            return next(ServerMessage.success("Site added", site));
        } catch (error) {
            return next(ServerMessage.serverError(error));
        }
    }
    async updateSite(req, res, next) {
        try {
            const {id} = req.body;
            const site = await Site.findOne({_id: id});
            if (!site) {
                return next(ServerError.badRequest("Site not found"));
            }
            const {...options} = req.body;
            if (req.files.logo) {
                await fileService.deleteFile(site.logo);
                options.logo = fileService.saveFile(req.files.logo);
            }
            await Site.updateOne({_id: id}, options);
            return next(ServerMessage.success("Site updated"));
        } catch (error) {
            return next(ServerMessage.serverError(error));
        }
    }
    async getAllSites(req, res, next) {
        try {
            const sites = await Site.find();
            return next(ServerMessage.success("Sites found", sites));
        } catch (error) {
            return next(ServerMessage.serverError(error));
        }
    }
    async getSiteById(req, res, next) {
        try {
            const {id} = req.query;
            const site = await Site.findOne({_id: id});
            if (!site) {
                return next(ServerError.badRequest("Site not found"));
            }
            return next(ServerMessage.success("Site found", site));
        } catch (error) {
            return next(ServerMessage.serverError(error));
        }
    }
    async setHistory(req, res, next) {
        try {
            const {siteId, balance, transactions, purchases, updated = Date.now()} = req.body;
            const site = await Site.findOne({_id: siteId});
            if (!site) {
                return next(ServerError.badRequest("Site not found"));
            }
            const history = await History.create({siteId, balance, transactions, purchases, updated});
            return next(ServerMessage.success("History added", history));
        } catch (error) {
            return next(ServerMessage.serverError(error));
        }
    }
    async getHistory(req, res, next) {
        try {
            const {siteId} = req.query;
            const site = await History.findOne({siteId});
            if (!site) {
                return next(ServerError.badRequest("Site not found"));
            }
            const history = await History.find({siteId}).sort({updated: -1});
            return next(ServerMessage.success("History found", history));
        } catch (error) {
            return next(ServerMessage.serverError(error));
        }
    }
    async options(req, res, next) {
        try {
            const {id} = req.query;
            const site = await Site.findOne({_id: id});
            if (!site) {
                return next(ServerError.badRequest("Site not found"));
            }
            const options = await History.find({siteId: id}).distinct('option');
            return next(ServerMessage.success("Options found", options));
        } catch (error) {
            return next(ServerMessage.serverError(error));
        }
    }
}

export default new SiteController();