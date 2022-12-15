import express, { response } from 'express';
import HttpError from 'http-errors';
import httpStatus from 'http-status';
import { guardAuthJWT } from '../middlewares/authorization.jwt.js';
import explorerRepo from '../repositories/explorer.repo.js';
import combatRepo from '../repositories/combat.repo.js';
import jwt from 'jsonwebtoken';

const router = express.Router()

class combatRoutes {
    constructor() {
        router.post('/combat', guardAuthJWT, this.generateFight)
    }

    async generateFight(req, res, next) {
        try {
            const combatInfos = req.body

            if (!combatInfos.foundCreature || !combatInfos.explorerCreature || !combatInfos.explorerUsername)
                return res.status(400).json({ "errorMessage": 'Missing "enemy" or "buddy" field.' })

            let combatResult = await combatRepo.generateFight(combatInfos)
            combatResult = combatResult.toObject();

            res.status(httpStatus.CREATED).json(combatResult)

        } catch (err) {
            return next(err)
        }
    }

}

new combatRoutes()

export default router