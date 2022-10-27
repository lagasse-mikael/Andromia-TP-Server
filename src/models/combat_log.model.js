import mongoose from 'mongoose';

const combatLogSchema = mongoose.Schema({
    explorateur: { type: mongoose.Types.ObjectId, unique: false, required: true },
    explorateurCreature: { type: mongoose.Types.ObjectId, unique: false, required: true },
    foundCreature: { type: mongoose.Types.ObjectId, unique: false, required: true },
    combatDate: { type: Date, unique: false, required: false },
    winner: { type: mongoose.Types.ObjectId, unique: false, required: false }
},
    {
        collection: 'combat_logs',
        strict: 'throw',
        versionKey: false
    }
);

export default mongoose.model('CombatLog', combatLogSchema);