import express, { response } from 'express';
import HttpError from 'http-errors';
import httpStatus from 'http-status';
import explorerRepo from '../repositories/explorer.repo.js';

const router = express.Router()

class ExplorerRoutes {
    constructor() {
        router.get('/', this.getAll)
        router.get('/:explorerID', this.getOne)
        router.get('/:explorerID/creatures', this.getExplorerCreatures)
        router.get('/:explorerID/elements', this.getExplorerElements)

        router.post('/login', this.loginExplorer)
        router.post('/', this.createExplorer)
    }

    async getAll(req, res, next) {
        try {
            let explorers = await explorerRepo.retrieveAll()

            explorers = explorers.map(explorer => explorerRepo.transformObject(explorer))

            res.status(httpStatus.OK).json(explorers)
        } catch (err) {
            return next(err)
        }
    }

    async getOne(req, res, next) {
        try {
            let explorer = await explorerRepo.retrieveByID(req.params.explorerID)
            explorer = explorerRepo.transformObject(explorer)

            res.status(httpStatus.OK).json(explorer)
        } catch (err) {
            return next(err)
        }
    }

    async getExplorerCreatures(req, res, next) {
        try {
            const explorerCreatures = await explorerRepo.retrieveExplorerCreatures(req.params.explorerID)

            res.status(httpStatus.OK).json(explorerCreatures)
        } catch (err) {
            return next(err)
        }
    }

    async getExplorerElements(req, res, next) {
        try {
            const explorerElements = await explorerRepo.retrieveExplorerElements(req.params.explorerID)

            res.status(httpStatus.OK).json(explorerElements)
        } catch (err) {
            return next(err)
        }
    }

    async loginExplorer(req, res, next) {
        try {
            const explorerInfos = req.body
            if(!explorerInfos.username || !explorerInfos.password) 
                return res.status(400).json({"errorMessage" : 'Missing "usename" or "password" field.'})

            const possibleUser = await explorerRepo.connect(explorerInfos)
            
            res.status(202).json(possibleUser)
        } catch (err) {
            return next(err)
        }
    }

    async createExplorer(req, res, next) {
        try {
            const explorerBody = req.body

            const newExplorerResponse = await explorerRepo.create(explorerBody)

            res.status(httpStatus.CREATED).json(newExplorerResponse)
        } catch (err) {
            return next(err)
        }
    }
}

new ExplorerRoutes()

export default router