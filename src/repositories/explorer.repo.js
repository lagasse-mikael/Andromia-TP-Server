import creatureRepository from './creature.repo.js'
import Explorer from '../models/explorer.model.js';
import jwt from 'jsonwebtoken';
import mongo from 'mongoose';
import axios from 'axios';
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
        const explorer = await Explorer.findOne({ email: explorerEmail }).populate('creatures').populate({
            path: 'explorations',
            populate: {
                path: 'creature'
            }
        }).populate('combatCreature')

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

    async setExplorerCombatCreature(explorerEmail, creatureUUID) {
        let user = await this.retrieveByEmail(explorerEmail)
        let creature = await creatureRepository.retrieveByUUID(creatureUUID)

        user.combatCreature = creature._id
        user.save()

        return user.populate('combatCreature');
    }

    async retrieveExplorerVault(explorerEmail) {
        let { vault } = await Explorer.findOne({ email: explorerEmail }).select('vault')

        vault = vault.toObject();
        delete vault._id;

        return vault
    }

    async retrieveExplorerExplorations(explorerEmail) {
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

        newExplorer.location = "Lac de Meth";
        const response = await axios.post("https://api.andromia.science/creatures/actions?type=generate");
        if (response.status === 201) {
            let newCreature = await creatureRepository.createOne(response.data)
            newExplorer.combatCreature = newCreature._id
            newExplorer.creatures.push(newCreature);
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
        explorer.creatures.push(creature._id)
        explorer.save();

        return explorer
    }

    async addFoundVaultToExplorersVault(explorer, vaultExploration) {
        let elementsExplorer = explorer.vault.elements
        for (const found_element of vaultExploration.elements.values()) {
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

    async fightMoney(explorer, kernel) {
        let newAmountElements = explorer.vault.elements.map(e => {
            for (let i = 0; i < kernel.length; i++) {
                if (e.element == kernel[i]) {
                    e.quantity -= 1;
                    return e
                }
            }
            return e
        });

        explorer = await Explorer.findOneAndUpdate({ _id: explorer._id }, {
            $set: { "vault.elements": newAmountElements },
        })

        return explorer;
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