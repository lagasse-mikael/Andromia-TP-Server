// Autres imports.
import dayjs from "dayjs";
import express from "express";
import database from "./src/libs/database.js";
import axios from "axios";

// Repos
import explorerRoutes from './src/routes/explorer.route.js'
import creatureRoutes from './src/routes/creature.route.js'
import elementRoutes from './src/routes/element.route.js'
import explorationRoutes from './src/routes/exploration.route.js'
import combatRoutes from './src/routes/combat.route.js'

// Middlewares
// import methodMiddleware from './src/middlewares/method.js';
import errorMiddleware from './src/middlewares/errors.js';
import cors from 'cors';
import explorerRepo from "./src/repositories/explorer.repo.js";
import { guardRefreshToken } from "./src/middlewares/authorization.jwt.js";
import explorerModel from "./src/models/explorer.model.js";
import chalk from 'chalk';
import random from "random";

database();

const app = express();

app.use(cors());
app.use(express.json());

// Tokens
app.post("/refresh", guardRefreshToken, (req, res) => {
    const refresh_token = req.body.refresh_token
    if (!refresh_token)
        return res.status(400).json({ "errorMessage": "Refresh token?" })

    const associatedUser = explorerRepo.retrieveByID(refresh_token.userID)
    if (!associatedUser)
        return res.status(404).json({ "errorMessage": "Il provient d'où ton refresh token? (Possiblement invalide)" })

    const tokens = explorerRepo.generateTokens(associatedUser.email, associatedUser._id)

    return res.status(200).json(tokens)
});

// Inox increase.
app.put("/increaseBalances", async (req, res) => {
    try {
        const explorers = await explorerModel.updateMany({
            $inc: { "vault.inox": 2 }
        })

        return res.status(200).json(explorers)
    } catch (err) {
        console.log(err);
        return res.status(500).json({ "message": err })
    }

});

// Elements increase.
app.put("/increaseElements", async (req, res) => {
    try {
        const randomNumber = random.int(1,3)
        const explorers = await explorerModel.updateMany({
            $inc: { "vault.elements.$[].quantity": randomNumber }
        })

        return res.status(200).json(explorers)
    } catch (err) {
        console.log(err);
        return res.status(500).json({ "message": err })
    }

});

// Routes
app.use("/explorers", explorerRoutes)
app.use("/creatures", creatureRoutes)
app.use("/elements", elementRoutes)
app.use("/explorations", explorationRoutes)
app.use("/combats", combatRoutes)

// Middlewares
app.use(errorMiddleware);

// Fonctions recurrentes.
const intervalInox = setInterval(async () => {
    const response = await axios.put(`${process.env.BASE_URL}increaseBalances`)

    if (response.status == 200) {
        console.log(chalk.yellow(`🫰.Tout le monde a recu des inox! (+ 2)`));
    } else {
        console.log(response);
    }
}, 300000)

const intervalElements = setInterval(async () => {
    const response = await axios.put(`${process.env.BASE_URL}increaseElements`)

    if (response.status == 200) {
        console.log(chalk.cyan(`🔬.Tout le monde a recu des elements! (+ 1..3)`));
    } else {
        console.log(response);
    }
}, 1 * 60 * 60 * 1000)

export default app;