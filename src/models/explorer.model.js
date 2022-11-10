import mongoose from 'mongoose';


const explorerSchema = mongoose.Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, unique: false, required: true, select: false },
    creatures: { type: [mongoose.Types.ObjectId], unique: false, required: false, ref: 'Creature' },
    vault: { type: Object, unique: false, required: false },
    explorations: { type: [mongoose.Types.ObjectId], unique: false, required: false, ref: 'Exploration' }
},
    {
        collection: 'explorers',
        strict: 'throw',
        versionKey: false
    }
);

export default mongoose.model('Explorer', explorerSchema);