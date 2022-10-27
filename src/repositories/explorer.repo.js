import objectToDotNotation from '../libs/objectToDotNotation.js';
import Explorer from '../models/explorer.model.js';
import daysjs from 'dayjs'

class ExplorerRepository {
    async retrieveByID(explorerID) {
        const explorer = await Explorer.findById(explorerID)

        return explorer
    }

    async retrieveExplorerCreatures(explorerID) {
        const creatures = await Explorer.findById(explorerID).select('creatures')

        return creatures
    }

    async retrieveExplorerElements(explorerID) {
        const elements = await Explorer.findById(explorerID).select('elements')

        return elements
    }

    async retrieveAll() {
        const explorers = await Explorer.find()

        return explorers
    }

    async create(explorerBody) {
        const newExplorer = await Explorer.create(explorerBody)

        return newExplorer
    }

    async connect(explorerInfos) {
        const explorer = await Explorer.findOne({ username: explorerInfos.username, password: explorerInfos.password })

        return explorer
    }
}

export default new ExplorerRepository()