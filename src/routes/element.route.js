import express from 'express';
import httpStatus from 'http-status';
import { ELEMENTS } from '../data/constants.js';
import { guardAuthJWT } from '../middlewares/authorization.jwt.js';

const router = express.Router()

class ElementRoutes {
    constructor() {
        router.get('/', guardAuthJWT, this.getAll)
    }

    async getAll(req, res, next) {
        try {
            let elementsMapped = ELEMENTS.map(el => {
                return {element:el,image:`https://assets.andromia.science/elements/${el}.png`}
            })
            res.status(httpStatus.OK).json(elementsMapped)
        } catch (err) {
            return next(err)
        }
    }
}

new ElementRoutes()

export default router