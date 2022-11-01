import objectToDotNotation from '../libs/objectToDotNotation.js';
import Explorer from '../models/explorer.model.js';
import jwt from 'jsonwebtoken';

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

    generateTokens(email,userID) {
        const access_token = jwt.sign({ email }, process.env.JWT_TOKEN_SECRET, { expiresIn: process.env.JWT_TOKEN_LIFE, issuer: process.env.BASE_URL })
        const refresh_token = jwt.sign({ userID }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_LIFE, issuer: process.env.BASE_URL })
    
        return { access_token, refresh_token }
    }

    transformObject(explorer) {
        explorer = explorer.toObject()
        delete explorer.email;
        explorer.href = `${process.env.BASE_URL}explorers/${explorer._id}`

        delete explorer._id;
        
        return explorer
    }
}

export default new ExplorerRepository()