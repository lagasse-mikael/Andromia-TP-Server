import objectToDotNotation from '../libs/objectToDotNotation.js';
import Explorer from '../models/explorer.model.js';
import jwt from 'jsonwebtoken';
import mongo from 'mongoose';

class ExplorerRepository {
    async retrieveByID(explorerID) {
        const explorer = await Explorer.findById(explorerID).populate('creatures').populate({
            path: 'explorations',
            populate: {
                path: 'creature'
            }
        })

        return explorer
    }

    async retrieveExplorerCreatures(explorerEmail) {
        let creatures = await Explorer.findOne({ email: explorerEmail }).populate('creatures').select('creatures')

        creatures = creatures.toObject();
        delete creatures._id;

        return creatures
    }

    async retrieveExplorerVault(explorerEmail) {
        let vault = await Explorer.findOne({ email: explorerEmail }).select('vault')

        vault = vault.toObject();
        delete vault._id;

        return vault.vault
    }

    async retrieveExplorerExplorations(explorerEmail) {
        let explorations = await Explorer.findOne({ email: explorerEmail }).populate('explorations').populate({
            path: 'explorations',
            populate: {
                path: 'creature'
            }
        }).select('explorations')

        explorations = explorations.toObject();
        delete explorations._id;
        console.log(explorations.explorations)
        return explorations.explorations
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
        const explorer = await Explorer.findOne({ username: explorerInfos.username, password: explorerInfos.password }).populate('creatures').populate({
            path: 'explorations',
            populate: {
                path: 'creature'
            }
        })

        return explorer
    }

    async assignCreatureToExplorer(creature,exporer) {
        const creatureObjectId = creature._id;

        explorer.creatures.push(mongo.ObjectId(creatureObjectId))
        explorer.save();

        return explorer
    }

    generateTokens(email, userID) {
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