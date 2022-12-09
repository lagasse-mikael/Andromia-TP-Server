import mongoose from 'mongoose';

const combatResultSchema = mongoose.Schema({
    explorerUsername: { type:String,required: true },
    explorerCreatureId: { type: mongoose.Types.ObjectId, required:true,ref: 'Creature'},
    foundCreatureId:{type: mongoose.Types.ObjectId,required:true, ref: 'Creature'},
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