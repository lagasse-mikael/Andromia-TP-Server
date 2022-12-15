import express, { response } from 'express';
import HttpError from 'http-errors';
import httpStatus from 'http-status';
import { guardAuthJWT } from '../middlewares/authorization.jwt.js';
import creatureRepo from '../repositories/creature.repo.js';

const router = express.Router()

class CreatureRoutes {
    constructor() {
        router.get('/', guardAuthJWT, this.getAll)
        router.get('/:creatureID', guardAuthJWT,this.getOne)
        router.get('/getOneByUUID/:creatureUUID', guardAuthJWT,this.getOneByUUID)
    }

    async getAll(req, res, next) {
        try {
            let creatures = await creatureRepo.retrieveAll()

            creatures = creatures.map(creature => creatureRepo.transformObject(creature))

            res.status(httpStatus.OK).json(creatures)
        } catch (err) {
            return next(err)
        }
    }

    async getOne(req, res, next) {
        try {
            let creature = await creatureRepo.retrieveByID(req.params.creatureID)

            creature = creatureRepo.transformObject(creature)

            res.status(httpStatus.OK).json(creature)
        } catch (err) {
            return next(err)
        }
    }

    async getOneByUUID(req, res, next) {
        try {
            let creature = await creatureRepo.retrieveByUUID(req.params.creatureUUID)

            creature = creatureRepo.transformObject(creature)

            res.status(httpStatus.OK).json(creature)
        } catch (err) {
            return next(err)
        }
    }
}

new CreatureRoutes()

export default router