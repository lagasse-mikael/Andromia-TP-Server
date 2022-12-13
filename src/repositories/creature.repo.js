import Creature from '../models/creature.model.js';
import jwt from 'jsonwebtoken';

class CreatureRepository {
    async retrieveByID(creatureID) {
        const creature = await Creature.findById(creatureID)

        return creature
    }

    async retrieveByUUID(uuid) {
        const creature = await Creature.findOne({uuid:uuid})
        
        return creature
    }

    async retrieveAll() {
        const creatures = await Creature.find()

        return creatures
    }

    async createOne(creature) {
        // On considere que l'on cree une creature apres chaque exploration
        // donc le href et tout autre variable cree par Mongo sera la NECESSAIREMENT, sinon c'est pas trop grave.
        delete creature.href

        const creatureMongo = await Creature.create(creature)

        return creatureMongo
    }

    transformObject(creature) {
        creature = creature.toObject()
        creature.href = `${process.env.BASE_URL}creatures/${creature._id}`
        
        delete creature._id

        return creature
    }
}

export default new CreatureRepository()