import mongoose from 'mongoose';

const combatResultSchema = mongoose.Schema({
    explorerId: { type: [mongoose.Types.ObjectId], unique: true, required: true },
    explorerCreatureId: { type:[mongoose.Types.ObjectId], unique: true, required:true},
    foundCreatureId:{type:[mongoose.Types.ObjectId],unique:true,required:true},
    combatDate:{type:Date, unique:false,required:true},
    winner:{type:[mongoose.Types.ObjectId], unique:true,required:true}
},
    {
        collection: 'combatResults',
        strict: 'throw',
        versionKey: false
    }
);

export default mongoose.model('CombatResult', combatResultSchema);