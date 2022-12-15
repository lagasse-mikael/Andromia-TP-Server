import express from "express";
import httpStatus from "http-status";
import { guardAuthJWT } from "../middlewares/authorization.jwt.js";
import axios from "axios";

import creatureRepo from "../repositories/creature.repo.js";
import explorerRepo from "../repositories/explorer.repo.js";
import explorationRepo from "../repositories/exploration.repo.js";
import mongo from "mongoose";

const router = express.Router();

class ExplorationRoutes {
  constructor() {
    router.post("/", guardAuthJWT, this.postScannedExploraiton);
    router.post("/fight", guardAuthJWT, this.creatureFought);
  }

  async creatureFought(req, res, next) {
    try {
      let explorationInfos;
      console.log(req.body)
      if(req.body.exploration){
       explorationInfos = req.body.exploration;
      } else{
       explorationInfos = req.body;
      }

      let exploration = await explorationRepo.patchFoughtCreature(
        explorationInfos
      );

      res.status(httpStatus.OK).json(exploration);
    } catch (err) {
      return next(err);
    }
  }

  // J'trouve ca sketch a lire donc j'ai commenter chaque etape.
  async postScannedExploraiton(req, res, next) {
    try {
      // Check si on a un qr code dans le body.
      const portalKey = req.body.qrKey;
      if (!portalKey)
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ message: "Pas de code qr!" });

      // On pogne une exploration du serveur selon le code.
      const explorationResponse = await axios.get(
        `https://api.andromia.science/portals/${portalKey}`
      );

      if (explorationResponse.status != 200) {
        return res
          .status(500)
          .json({
            message: "Code d'erreur ambigu",
            "response-code-adromia-api": explorationResponse.status,
          });
      }

      // On stock l'exploration et ses informations dans des variables.
      let exploration = explorationResponse.data;

      const vaultExploration = exploration.vault;
      let creatureExploration = exploration.creature;
      if (creatureExploration) {
        creatureExploration = await creatureRepo.createOne(
          exploration.creature
        );

        exploration.creature = creatureExploration._id;
        exploration.creatureHasBeenFought = false;
      }

      // On cree l'exploration
      exploration = await explorationRepo.createOne(exploration);

      // On ajoute l'exploration au profil de l'utilisateur.
      const explorateur = await explorerRepo.retrieveByEmail(req.auth.email);
      explorateur.explorations.push(exploration._id);

      // On donne la destionation de l'exploration comme location à l'explorateur. OL
      explorateur.location = exploration.destination;

      if (vaultExploration) {
        await explorerRepo.addFoundVaultToExplorersVault(
          explorateur,
          vaultExploration
        );
      }

      explorateur.save();

      res.status(httpStatus.OK).json(exploration);
    } catch (err) {
      console.log(err);
      return next(err);
    }
  }
}

new ExplorationRoutes();

export default router;
