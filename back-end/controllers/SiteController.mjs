import dotenv from 'dotenv';
import ApiError from '../error/ApiError.mjs';
import { Site, History } from '../models/models.mjs';
import fileService from "../services/fileService.mjs";
dotenv.config();

class SiteController {
    async deleteSite(req, res, next) {
        try {
            const {id} = req.query;
            const site = await Site.findOne({_id: id});
            if (!site) {
                return next(ApiError.badRequest("Site not found", 400));
            }
            await Site.deleteOne({_id: id});
            res.status(200).json({
                message: "Site deleted",
            });
        } catch (error) {
            next(error);
        }
    }
    async addSite(req, res, next) {
        try {
            const {name, url} = req.body;
            const fileName = fileService.saveFile(req.files.logo);
            const site = await Site.create({name, url, logo: fileName});
            res.status(200).json({
                message: "Site added",
                siteId: site._id,
            });
        } catch (error) {
            next(error);
        }
    }
    async updateSite(req, res, next) {
        try {
            const {id, name, url, logo} = req.body;
            const site = await Site.findOne({_id: id});
            if (!site) {
                return next(ApiError.badRequest("Site not found", 400));
            }
            await Site.updateOne({_id: id}, {$set: {name, url, logo}});
            res.status(200).json({
                message: "Site updated",
            });
        } catch (error) {
            next(error);
        }
    }
    async getAllSites(req, res, next) {
        try {
            const sites = await Site.find();
            res.status(200).json({
                message: "Sites found",
                sites,
            });
        } catch (error) {
            next(error);
        }
    }
    async getSiteById(req, res, next) {
        try {
            const {id} = req.query;
            const site = await Site.findOne({_id: id});
            if (!site) {
                return next(ApiError.badRequest("Site not found", 400));
            }
            res.status(200).json({
                message: "Site found",
                site,
            });
        } catch (error) {
            next(error);
        }
    }
    async setHistory(req, res, next) {
        try {
            const {siteId, balance, transactions, purchases, updated = Date.now()} = req.body;
            const site = await Site.findOne({_id: siteId});
            if (!site) {
                return next(ApiError.badRequest("Site not found", 400));
            }
            const history = await History.create({siteId, balance, transactions, purchases, updated});
            res.status(200).json({
                message: "History added",
                history,
            });
        } catch (error) {
            next(error);
        }
    }
    async getHistory(req, res, next) {
        try {
            const {siteId} = req.query;
            const site = await History.findOne({siteId});
            if (!site) {
                return next(ApiError.badRequest("Site not found", 400));
            }
            const history = await History.find({siteId}).sort({updated: -1});
            res.status(200).json({
                message: "History found",
                history,
            });
        } catch (error) {
            next(error);
        }
    }
    async options(req, res, next) {
        try {
            const {id} = req.query;
            const site = await Site.findOne({_id: id});
            if (!site) {
                return next(ApiError.badRequest("Site not found", 400));
            }
            const options = await History.find({siteId: id}).distinct('option');
            res.status(200).json({
                message: "Options found",
                options,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new SiteController();