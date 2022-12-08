import mongoose from 'mongoose';

const combatResultSchema = mongoose.Schema({
    explorerId: { type: [mongoose.Types.ObjectId],required: true },
    explorerCreatureId: { type:[mongoose.Types.ObjectId], required:true},
    foundCreatureId:{type:[mongoose.Types.ObjectId],required:true},
    combatDate:{type:Date,required:true},
    winner:{type:[mongoose.Types.ObjectId],required:true}
},
    {
        collection: 'combatResults',
        strict: 'throw',
        versionKey: false
    }
);

export default mongoose.model('CombatResult', combatResultSchema);