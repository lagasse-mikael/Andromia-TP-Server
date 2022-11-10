import mongoose from 'mongoose';


const explorerSchema = mongoose.Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, unique: false, required: true, select: false },
    inox: { type: Number, unique: false, required: false, default: 10 },
    creatures: { type: [mongoose.Types.ObjectId], unique: false, required: false, ref: 'Creature' },
    elements: { type: [mongoose.Types.ObjectId], unique: false, required: false },
    explorations: { type: [mongoose.Types.ObjectId], unique: false, required: false, ref: 'Exploration' }
},
    {
        collection: 'explorers',
        strict: 'throw',
        versionKey: false
    }
);

export default mongoose.model('Explorer', explorerSchema);