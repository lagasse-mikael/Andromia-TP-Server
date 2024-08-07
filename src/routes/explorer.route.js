import express, { response } from 'express';
import HttpError from 'http-errors';
import httpStatus from 'http-status';
import { guardAuthJWT } from '../middlewares/authorization.jwt.js';
import explorerRepo from '../repositories/explorer.repo.js';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import creatureRepo from '../repositories/creature.repo.js';

const router = express.Router()

class ExplorerRoutes {
    constructor() {
        router.get('/', guardAuthJWT, this.getAll)
        router.get('/getOne/:explorerID', guardAuthJWT,this.getOne)
        
        router.get('/creatures', guardAuthJWT, this.getExplorerCreatures)
        router.get('/vault', guardAuthJWT, this.getExplorerVault)
        router.get('/explorations', guardAuthJWT, this.getExplorerExplorations)
        
        router.get('/combatCreature', guardAuthJWT, this.getExplorerCombatCreature)
        router.post('/combatCreature', guardAuthJWT, this.setExplorerCombatCreature)

        router.post('/fightMoney', guardAuthJWT,this.payUp)
        router.post('/capture', guardAuthJWT, this.assignCreatureToExplorer)
        
        router.post('/login', this.loginExplorer).bind(this)
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
            console.log(req.auth);
            const explorerCreatures = await explorerRepo.retrieveExplorerCreatures(req.auth.email)

            res.status(httpStatus.OK).json(explorerCreatures)
        } catch (err) {
            return next(err)
        }
    }

    async getExplorerCombatCreature(req,res,next) {
        try {
            const combatCreature = await explorerRepo.retrieveExplorerCombatCreature(req.auth.email)

            res.status(httpStatus.OK).json(combatCreature)
        } catch (err) {
            return next(err)
        }
    }

    async setExplorerCombatCreature(req,res,next) {
        try {
            const creatureUUID = req.body.uuid
            const currentUserEmail = req.auth.email

            const updatedExplorer = await explorerRepo.setExplorerCombatCreature(currentUserEmail,creatureUUID)

            res.status(httpStatus.OK).json(updatedExplorer)
        } catch (err) {
            return next(err)
        }
    }

    async getExplorerVault(req, res, next) {
        try {
            const explorerElements = await explorerRepo.retrieveExplorerVault(req.auth.email)
            res.status(httpStatus.OK).json(explorerElements)
        } catch (err) {
            return next(err)
        }
    }

    async getExplorerExplorations(req, res, next) {
        try {
            const explorerExplorations = await explorerRepo.retrieveExplorerExplorations(req.auth.email)

            res.status(httpStatus.OK).json(explorerExplorations)
        } catch (err) {
            return next(err)
        }
    }

    async payUp(req,res,next){
        try {
            let explorer = await explorerRepo.retrieveByEmail(req.auth.email)
            let kernel = req.body.kernel
    
            const result = await explorerRepo.fightMoney(explorer,kernel)
    
            res.status(httpStatus.OK).json(result)
        } catch (err) {
            return next(err)
        }
    }

    async assignCreatureToExplorer(req,res,next){
        try {            
            let explorer = await explorerRepo.retrieveByEmail(req.auth.email)
            let creature = await creatureRepo.retrieveByUUID(req.body.creatureUUID)
    
            const result = await explorerRepo.assignCreatureToExplorer(creature,explorer)
    
            res.status(httpStatus.OK).json(result);
        } catch (err) {
            return next(err)
        }

    }

    async loginExplorer(req, res, next) {
        try {
            //https://api.andromia.science/creatures/actions?type=generate -- creature par defaut
            const explorerInfos = req.body
            if (!explorerInfos.username || !explorerInfos.password)
                return res.status(400).json({ "errorMessage": 'Missing "usename" or "password" field.' })

            let possibleUser = await explorerRepo.connect(explorerInfos)

            if (!possibleUser)
                return res.status(404).json({ "errorMessage": 'User not found!' })

            possibleUser = possibleUser.toObject()
           
            const tokens = explorerRepo.generateTokens(possibleUser.email, possibleUser._id)

            possibleUser.tokens = {
                ...tokens
            }
            //console.log(possibleUser);
            res.status(httpStatus.OK).json(possibleUser)
        } catch (err) {
            return next(err)
        }
    }

    async createExplorer(req, res, next) {
        try {
            const explorerBody = req.body

            let newExplorerResponse = await explorerRepo.create(explorerBody)
       
            newExplorerResponse = newExplorerResponse.toObject();
            const tokens = explorerRepo.generateTokens(newExplorerResponse.email, newExplorerResponse._id)

            newExplorerResponse.tokens = {
                ...tokens
            }
            
            res.status(httpStatus.CREATED).json(newExplorerResponse)
        } catch (err) {
            return next(err)
        }
    }
}

new ExplorerRoutes()

export default router