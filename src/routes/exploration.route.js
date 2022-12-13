import express from 'express';
import httpStatus from 'http-status';
import { guardAuthJWT } from '../middlewares/authorization.jwt.js';
import axios from 'axios';

import creatureRepo from '../repositories/creature.repo.js'
import explorerRepo from '../repositories/explorer.repo.js'
import explorationRepo from '../repositories/exploration.repo.js';
import mongo from 'mongoose';

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
        router.patch('/fight',guardAuthJWT, this.creatureFought)
    }

    async creatureFought(req,res,next){
        try {
            const explorationInfos = req.body
            let exploration = await explorationRepo.patchFoughtCreature(explorationInfos)

            res.status(httpStatus.OK).json(exploration)
        } catch (err) {
            return next(err)
        }
    }

    // J'trouve ca sketch a lire donc j'ai commenter chaque etape.
    async postScannedExploraiton(req, res, next) {
        try {
            // Check si on a un qr code dans le body.
            const portalKey = req.body.qrKey
            if (!portalKey) return res.status(httpStatus.BAD_REQUEST).json({ "message": "Pas de code qr!" })

            // On pogne une exploration du serveur selon le code.
            const explorationResponse = await axios.get(`https://api.andromia.science/portals/${portalKey}`)

            if (explorationResponse.status != 200) {
                return res.status(500).json({ "message": "Code d'erreur ambigu", 'response-code-adromia-api': explorationResponse.status })
            }

            // On stock l'exploration et ses informations dans des variables.
            let exploration = explorationResponse.data;

            const vaultExploration = exploration.vault;
            let creatureExploration = exploration.creature;
            if (creatureExploration) {
                console.log("Creature presente dans l'exploration!");
                creatureExploration = await creatureRepo.createOne(exploration.creature);

                exploration.creature = creatureExploration._id;
                exploration.creatureHasBeenFought = false
            }

            // On cree l'exploration
            exploration = await explorationRepo.createOne(exploration)

            // On ajoute l'exploration au profil de l'utilisateur.
            const explorateur = await explorerRepo.retrieveByEmail(req.auth.email)
            explorateur.explorations.push(exploration._id)

            // On donne la destionation de l'exploration comme location à l'explorateur. OL
            explorateur.location = exploration.destination; 

            if (vaultExploration) {
                await explorerRepo.addFoundVaultToExplorersVault(explorateur, vaultExploration)
            }

            explorateur.save()

            res.status(httpStatus.OK).json(exploration)
        } catch (err) {
            console.log(err)
            return next(err)
        }
    }
}

new ExplorationRoutes()

export default router