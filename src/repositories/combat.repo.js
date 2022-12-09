import Creature from '../models/creature.model.js';
import jwt from 'jsonwebtoken';
import combatResultModel from '../models/combatResult.model.js';
import mongoose from 'mongoose';

class CombatRepository {
    async generateFight(combatInfos) {
        combatInfos.explorateurCreature.stats.power = combatInfos.explorateurCreature.stats.power - combatInfos.foundCreature.stats.shield;
        combatInfos.foundCreature.stats.power = combatInfos.foundCreature.stats.power - combatInfos.explorateurCreature.stats.shield;
        combatInfos.explorateurCreature.startsFirst = false;
        combatInfos.foundCreature.startsFirst = false;
        if (combatInfos.explorateurCreature.stats.speed > combatInfos.foundCreature.stats.speed)
            combatInfos.explorateurCreature.startsFirst = true;
        else if (combatInfos.foundCreature.stats.speed > combatInfos.explorateurCreature.stats.speed)
            combatInfos.foundCreature.startsFirst = true;
        else
            this.random(0, 100) > 50 ? combatInfos.explorateurCreature.startsFirst = true : combatInfos.foundCreature.startsFirst = true;
        this.fight(combatInfos.explorateurCreature, combatInfos.foundCreature);
        
        const combatResult = await combatResultModel.create({
            explorerUsername:combatInfos.explorateurUsername,
            explorerCreatureId: mongoose.Types.ObjectId(combatInfos.explorateurCreature._id),
            foundCreatureId:mongoose.Types.ObjectId(combatInfos.foundCreature._id),
            combatDate:Date.now(),
            userWon:combatInfos.foundCreature.win
        });
        return combatResult;
    }

    fight(gentil, mechant) {
        let premier;
        let deuxieme;
        if (gentil.startsFirst) {
            premier = gentil;
            deuxieme = mechant;
        } else {
            premier = mechant;
            deuxieme = gentil;
        }
        while (premier.stats.life > 0 || deuxieme.stats.life > 0) {
            deuxieme.stats.life -= premier.stats.power;
            if (deuxieme.stats.life <= 0) {
                premier.win = true;
                break;
            }
            premier.stats.life -= deuxieme.stats.power;
            if (premier.stats.life <= 0) {
                premier.win = false;
                break;
            }
        }
    }

    random(min, max) {
        return Math.floor((Math.random()) * (max - min + 1)) + min;
    }



}

export default new CombatRepository()