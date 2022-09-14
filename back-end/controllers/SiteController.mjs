import dotenv from 'dotenv';
import ServerError from '../utils/ServerMessage.mjs';
import { Site, History } from '../models/models.mjs';
import fileService from "../services/fileService.mjs";
import ServerMessage from "../utils/ServerMessage.mjs";
dotenv.config();

class SiteController {
    async deleteSite(req, res, next) {
        try {
            const {siteId} = req.params;
            const site = await Site.findOne({_id: siteId});
            if (!site) {
                return next(ServerError.badRequest("Site not found"));
            }
            await fileService.deleteFile("./uploads", site.logo);
            await Site.deleteOne({_id: siteId});
            return next(ServerMessage.success("Site deleted"));
        } catch (error) {
            return next(ServerMessage.serverError(error));
        }
    }
    async createSite(req, res, next) {
        try {
            const {name, url} = req.body;
            const fileName = fileService.saveFile("./uploads", req.files.logo);
            const site = await Site.create({name, url, logo: fileName});
            return next(ServerMessage.success("Site added", undefined, site));
        } catch (error) {
            return next(ServerMessage.serverError(error));
        }
    }
    async updateSite(req, res, next) {
        try {
            const {siteId} = req.params;
            const site = await Site.findOne({_id: siteId});
            if (!site) {
                return next(ServerError.badRequest("Site not found"));
            }
            const {...options} = req.body;
            if (req.files.logo) {
                await fileService.deleteFile("./uploads", site.logo);
                options.logo = fileService.saveFile("./uploads", req.files.logo);
            }
            const updatedSite = await Site.findOneAndUpdate({_id: siteId}, options, {new: true});
            return next(ServerMessage.success("Site updated", undefined, updatedSite));
        } catch (error) {
            return next(ServerMessage.serverError(error));
        }
    }
    async getSites(req, res, next) {
        try {
            const sites = await Site.find();
            return next(ServerMessage.success("Sites found", sites, sites));
        } catch (error) {
            return next(ServerMessage.serverError(error));
        }
    }
    async getSiteById(req, res, next) {
        try {
            const {siteId} = req.params;
            const site = await Site.findOne({_id: siteId});
            if (!site) {
                return next(ServerError.notFound("Site not found"));
            }
            return next(ServerMessage.success("Site found", site, site));
        } catch (error) {
            return next(ServerMessage.serverError(error));
        }
    }
    async createHistory(req, res, next) {
        try {
            const {siteId} = req.params;
            const site = await Site.findOne({_id: siteId});
            if (!site) {
                return next(ServerError.badRequest("Site not found"));
            }
            const {balance, transactions, purchases, updated = Date.now()} = req.body;
            const history = await History.create({siteId, balance, transactions, purchases, updated});
            return next(ServerMessage.success("History added", undefined, history));
        } catch (error) {
            return next(ServerMessage.serverError(error));
        }
    }
    async updateHistory(req, res, next) {
        try {
            const {siteId, historyId} = req.params;
            const site = await Site.findOne({_id: siteId});
            if (!site) {
                return next(ServerError.badRequest("Site not found"));
            }
            const {balance, transactions, purchases, updated = Date.now()} = req.body;
            const updateHistory = await History.findOneAndUpdate({_id: historyId}, {balance, transactions, purchases, updated}, {new: true});
            return next(ServerMessage.success("History updated", undefined, updateHistory));
        } catch (error) {
            return next(ServerMessage.serverError(error));
        }
    }
    async getHistories(req, res, next) {
        try {
            const {siteId} = req.params;
            const site = await History.findOne({siteId});
            if (!site) {
                return next(ServerError.badRequest("Site not found"));
            }
            const history = await History.find({siteId}).sort({updated: -1});
            return next(ServerMessage.success("History found", history, history));
        } catch (error) {
            return next(ServerMessage.serverError(error));
        }
    }
    async getHistoriesById(req, res, next) {
        try {
            const {siteId, historyId} = req.params;
            const site = await Site.findOne({_id: siteId});
            if (!site) {
                return next(ServerError.badRequest("Site not found"));
            }
            const history = await History.findOne({_id: historyId});
            return next(ServerMessage.success("History found", history, history));
        } catch (error) {
            return next(ServerMessage.serverError(error));
        }
    }
}

export default new SiteController();