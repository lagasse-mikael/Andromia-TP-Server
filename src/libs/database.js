import mongoose from 'mongoose';
import chalk from 'chalk';
import '../../env.js';
import Explorer from '../models/explorer.model.js'
import Exploration from '../models/exploration.model.js'
import Creature from '../models/creature.model.js'

export default async () => {
    const url = process.env.DATABASE;
    console.log(chalk.blueBright(`📡 Establish new connection with url: ${url}`));

    try {
        await mongoose.connect(url);
        console.log(chalk.greenBright(`✅ Connected to: ${url}`));
    } catch (err) {
        console.log(chalk.red(`❌ - Cannot connect to: ${url}\n ${err} ... \n Exiting`));
        process.exit(1);
    }

}