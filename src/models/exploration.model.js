import mongoose from 'mongoose';

const explorationSchema = mongoose.Schema({
    explorationDate: { type: Date, unique: false, required: true },
    destination: { type: String, unique: false, required: true },
    affinity: { type: String, unique: false, required: true },
    vault: { type: mongoose.Types.ObjectId, unique: false, required: true },
    creature: { type: mongoose.Types.ObjectId, unique: false, required: true },
},
    {
        collection: 'explorations',
        strict: 'throw',
        versionKey: false
    }
);

export default mongoose.model('Exploration', explorationSchema);