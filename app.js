// Autres imports.
import dayjs from "dayjs";
import express from "express";
import database from "./src/libs/database.js";

// Repos
import explorerRoutes from './src/routes/explorer.route.js'

// Middlewares
// import methodMiddleware from './src/middlewares/method.js';
import errorMiddleware from './src/middlewares/errors.js';
import cors from 'cors';
import explorerRepo from "./src/repositories/explorer.repo.js";
import { guardRefreshToken } from "./src/middlewares/authorization.jwt.js";

database();

const app = express();

app.use(cors());
app.use(express.json());
// app.use(methodMiddleware);

app.post("/refresh",guardRefreshToken, (req, res) => {
    const refresh_token = req.body.refresh_token
    if(!refresh_token)
        return res.status(400).json({"errorMessage" : "Refresh token?"})

    const associatedUser = explorerRepo.retrieveByID(refresh_token.userID)
    if(!associatedUser)
        return res.status(404).json({"errorMessage" : "Il provient d'où ton refresh token? (Possiblement invalide)"})

    const tokens = explorerRepo.generateTokens(associatedUser.email, associatedUser._id)
    
    return res.status(200).json(tokens)
});

app.use("/explorers", explorerRoutes)

app.use(errorMiddleware);
export default app;