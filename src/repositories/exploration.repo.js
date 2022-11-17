import Exploration from '../models/exploration.model.js';
import jwt from 'jsonwebtoken';

class ExplorationRepository {
    async retrieveByID(explorationID) {
        const exploration = await Exploration.findById(explorationID)

        return exploration
    }

    async retrieveAll() {
        const explorations = await Exploration.find()

        return explorations
    }

    async createOne(exploration) {
        const explorationMongo = await Exploration.create(exploration)

        return explorationMongo
    }

    transformObject(exploration) {
        exploration = creature.toObject()
        exploration.href = `${process.env.BASE_URL}explorations/${exploration._id}`
        
        delete exploration._id

        return exploration
    }
}

export default new ExplorationRepository()