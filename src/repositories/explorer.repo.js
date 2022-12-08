import creatureRepository from './creature.repo.js'
import Explorer from '../models/explorer.model.js';
import jwt from 'jsonwebtoken';
import mongo from 'mongoose';
import { ELEMENTS } from '../data/constants.js';

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

    async retrieveByEmail(explorerEmail) {
        const explorer = await Explorer.findOne({ email: explorerEmail })

        return explorer
    }

    async retrieveExplorerCreatures(explorerEmail) {
        let { creatures } = await Explorer.findOne({ email: explorerEmail }).populate('creatures').select('creatures')

        creatures = creatures.map(c => {
            c.toObject()
            delete c._id;
            return c
        })
        return creatures
    }

    async retrieveExplorerCombatCreature(explorerEmail) {
        let { combatCreature } = await Explorer.findOne({ email: explorerEmail }).populate('combatCreature')

        return combatCreature
    }

    async setExplorerCombatCreature(explorerEmail,creatureId) {
        let user = await this.retrieveByEmail(explorerEmail)
        let creature = await creatureRepository.retrieveByID(creatureId)

        user.combatCreature = creature

        user.save()

        return user
    }

    async retrieveExplorerVault(explorerEmail) {
        let { vault } = await Explorer.findOne({ email: explorerEmail }).select('vault')

        vault = vault.toObject();
        delete vault._id;

        return vault
    }

    async retrieveExplorerExplorations(explorerEmail) {
        console.log(explorerEmail);
        let { explorations } = await Explorer.findOne({ email: explorerEmail }).populate('explorations').populate({
            path: 'explorations',
            populate: {
                path: 'creature'
            }
        }).select('explorations')

        explorations = explorations.map(e => {
            e.toObject()
            delete e._id;
            return e
        })

        return explorations
    }

    async retrieveAll() {
        const explorers = await Explorer.find()

        return explorers
    }

    async create(explorerBody) {
        const newExplorer = await Explorer.create(explorerBody)

        for (const element of ELEMENTS) {
            newExplorer.vault.elements.push({
                "element": element,
                "quantity": 0
            })
        }

        newExplorer.save()

        return newExplorer
    }

    async connect(explorerInfos) {
        const explorer = await Explorer.findOne({ username: explorerInfos.username, password: explorerInfos.password }).populate('creatures').populate({
            path: 'explorations',
            populate: {
                path: 'creature'
            }
        }).populate('combatCreature')

        return explorer
    }

    assignCreatureToExplorer(creature, explorer) {
        const creatureObjectId = creature._id;

        explorer.creatures.push(mongo.ObjectId(creatureObjectId))
        explorer.save();

        return explorer
    }

    async addFoundVaultToExplorersVault(explorer, vaultExploration) {
        let elementsExplorer = explorer.vault.elements
        for (const found_element of vaultExploration.elements.values()) {
            console.log(found_element);
            elementsExplorer.map(element => {
                if (element.element == found_element.element) {
                    elementsExplorer.find(el => el.element == found_element.element).quantity += found_element.quantity
                }
            })
        }

        await Explorer.findOneAndUpdate({ _id: explorer._id }, {
            $set: { "vault.elements": elementsExplorer },
            $inc: { "vault.inox": vaultExploration.inox }
        })

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