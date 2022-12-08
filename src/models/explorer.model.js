import mongoose from 'mongoose';


const explorerSchema = mongoose.Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    location: { type: String, unique: false, required: false },
    password: { type: String, unique: false, required: true, select: false },
    creatures: { type: [mongoose.Types.ObjectId], unique: false, required: false, ref: 'Creature' },
    combatCreature: {type: mongoose.Types.ObjectId, required: false, ref: 'Creature'},
    vault: { 
        inox:{type:Number,required:false,default:0},
        elements:{type:Array,required:false},
    },
    explorations: { type: [mongoose.Types.ObjectId], unique: false, required: false, ref: 'Exploration' }
},
    {
        collection: 'explorers',
        strict: 'throw',
        versionKey: false
    }
);

export default mongoose.model('Explorer', explorerSchema);