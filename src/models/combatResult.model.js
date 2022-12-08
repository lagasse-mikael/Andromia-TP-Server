import mongoose from 'mongoose';

const combatResultSchema = mongoose.Schema({
    explorerUsername: { type: [mongoose.Types.ObjectId],required: true },
    explorerCreatureId: { type:[mongoose.Types.ObjectId], required:true},
    foundCreatureId:{type:[mongoose.Types.ObjectId],required:true},
    combatDate:{type:Date,required:true},
    userWon:{type:Boolean,required:true,default:false}
},
    {
        collection: 'combatResults',
        strict: 'throw',
        versionKey: false
    }
);

export default mongoose.model('CombatResult', combatResultSchema);