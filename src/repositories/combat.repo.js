import Creature from '../models/creature.model.js';
import jwt from 'jsonwebtoken';

class CombatRepository {
    async generateFight() {
        const creature = await Creature.findById(creatureID)

        return creature
    }

    

}

export default new CombatRepository()