import express from 'express';
import httpStatus from 'http-status';
import { guardAuthJWT } from '../middlewares/authorization.jwt.js';
import axios from 'axios';

import creatureRepo from '../repositories/creature.repo.js'
import explorerRepo from '../repositories/explorer.repo.js'

const router = express.Router()

const api_response = {
    "explorationDate": "2022-11-15T20:58:57.958Z",
    "destination": "Yartar",
    "affinity": "logic",
    "vault": {
        "inox": 38,
        "elements": [
            {
                "element": "I",
                "quantity": 6
            },
            {
                "element": "Ex",
                "quantity": 2
            },
            {
                "element": "Sm",
                "quantity": 5
            },
            {
                "element": "Fr",
                "quantity": 6
            },
            {
                "element": "K",
                "quantity": 6
            },
            {
                "element": "Z",
                "quantity": 6
            },
            {
                "element": "Wu",
                "quantity": 2
            }
        ]
    },
    "creature": {
        "stats": {
            "life": 18,
            "speed": 5,
            "power": 6,
            "shield": 1
        },
        "crypto": {
            "hash": "305a89382a40ffb30e71a6e47c089bedc79c4cc3fcc1c177147fc5f6c9179270",
            "signature": "eyJhbGciOiJFUzI1NiIsImtpZCI6ImNOdWtWQ1MyVHNIRWs1bjBobGd4MHdiay1La1psQkFIWHpLZk56dzdva28ifQ.eyJ1dWlkIjoiOWY1YzFmMTgtNDZkYy00M2YzLWI2NzktMzI3OTUwMzFiZWQyIiwiaGFzaCI6IjMwNWE4OTM4MmE0MGZmYjMwZTcxYTZlNDdjMDg5YmVkYzc5YzRjYzNmY2MxYzE3NzE0N2ZjNWY2YzkxNzkyNzAifQ.CfiRftViHAfxTVFfiLjRoMvJKtivIU5ZolarlE6URp1alISi2PP4KB6STb7t-OsC6n_Iwa_1tKJ2UwBzpTnOkw"
        },
        "books": [
            "blue",
            "blue"
        ],
        "kernel": [
            "Sm",
            "Ex",
            "G",
            "K",
            "Ex"
        ],
        "archiveIndex": 20,
        "name": "Skeleton",
        "uuid": "9f5c1f18-46dc-43f3-b679-32795031bed2",
        "affinity": "logic",
        "essence": 100,
        "asset": "https://assets.andromia.science/creatures/20.png",
        "createdAt": "2022-11-15T20:58:57.963Z",
        "updatedAt": "2022-11-15T20:58:57.963Z",
        "href": "https://api.andromia.science/creatures/9f5c1f18-46dc-43f3-b679-32795031bed2",
        "expireAt": "2022-11-22T00:00:00.000Z"
    }
}

class ExplorationRoutes {
    constructor() {
        router.post('/', guardAuthJWT, this.postScannedExploraiton)
    }

    async postScannedExploraiton(req, res, next) {
        try {
            const portalKey = req.body.qrKey

            const explorationResponse = await axios.get(`https://api.andromia.science/portals/${portalKey}`)

            if (explorationResponse.status != 200) return explorationResponse

            const creatureExploration = explorationResponse.data.creature;
            const vaultExploration = explorationResponse.data.vault;

            creatureRepo.createOne(creatureExploration)

            res.status(httpStatus.OK).json({ "message": "OK!" })
        } catch (err) {
            return next(err)
        }
    }
}

new ExplorationRoutes()

export default router