import mongoose from 'mongoose';

const pizzeriaSchema = mongoose.Schema({
    planet: { type: String, unique: true, require: true },
    coord:
    {
        lon: { type: Number, min: -1000, max: 1000, required: true },
        lat: { type: Number, min: -1000, max: 1000, required: true },
    },
    chef:
    {
        name: { type: String, unique: false, require: true },
        ancestor: { type: String, unique: false, require: true },
        speciality: { type: String, unique: false, require: true },
    }
},
    {
        collection: 'pizzerias',
        strict: 'throw',
        versionKey: false
    }
)

pizzeriaSchema.virtual('orders',{
    ref:'Order',
    foreignField:'pizzeria',
    localField:'_id',
    justOne:false
})  

export default mongoose.model('Pizzeria', pizzeriaSchema);