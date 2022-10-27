import mongoose, { Schema } from 'mongoose';

const creatureSchema = mongoose.Schema({
    stats: { type: Object, unique: false, required: true },
    crypto: { type: Object, unique: false, required: true },
    books: { type: [Object], unique: false, required: true },
    kernel: { type: [Object], unique: false, required: true },
    name: { type: String, unique: true, required: true },
    uuid: { type: String, unique: true, required: true },
    affinity: { type: String, unique: false, required: true },
    essence: { type: Number, unique: false, required: true },
    asset: { type: String, unique: false, required: true },
    createdAt: { type: Date, unique: false, required: true },
    updatedAt: { type: Date, unique: false, required: true },
    expiresAt: { type: Date, unique: false, required: true }
},
    {
        collection: 'creatures',
        strict: 'throw',
        versionKey: false
    }
);

export default mongoose.model('Creature', creatureSchema);