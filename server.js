import chalk from 'chalk';
import './env.js';
import app from "./app.js";

console.log(chalk.blue("Serveur initialisé"));

const PORT = process.env.PORT;

app.listen(PORT, err => {
    console.log(chalk.blue(`Serveur initialisé avec succès sur le port : ${PORT}`));
});