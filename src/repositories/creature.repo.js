import Creature from '../models/creature.model.js';
import jwt from 'jsonwebtoken';

class CreatureRepository {
    async retrieveByID(creatureID) {
        const creature = await Creature.findById(creatureID)

        return creature
    }

    async retrieveAll() {
        const creatures = await Creature.find()

        return creatures
    }

    transformObject(creature) {
        creature = creature.toObject()
        creature.href = `${process.env.BASE_URL}creatures/${creature._id}`
        
        delete creature._id

        return creature
    }
}

export default new CreatureRepository()