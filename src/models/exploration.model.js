import mongoose from 'mongoose';

const explorationSchema = mongoose.Schema({
    explorationDate: { type: Date, unique: false, required: true },
    destination: { type: String, unique: false, required: true },
    affinity: { type: String, unique: false, required: true },
    vault: { type: Object, unique: false, required: false },
    creature: { type: mongoose.Types.ObjectId, unique: false, required: false, ref:'Creature' },
    creatureHasBeenFought: { type: Boolean, unique: false, required: false },
    combat: { type: Object, unique: false, required: false }
},
    {
        collection: 'explorations',
        strict: 'throw',
        versionKey: false
    }
);

export default mongoose.model('Exploration', explorationSchema);