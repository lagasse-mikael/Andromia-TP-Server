import mongoose from 'mongoose';
import { PIZZA_SIZES, PIZZA_TOPPINGS } from '../data/constants.js';

const orderSchema = mongoose.Schema({
    pizzeria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'pizzeria',
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    orderDate: { type: Date, required: true, default: Date.now },
    pizzas: [{
        toppings: [{ type: String, required: true, enum: PIZZA_TOPPINGS }],
        size: { type: String, required: true, enum: PIZZA_SIZES },
        price: { type: String, required: true, min: 0 },
    }]
},
    {
        collection: 'orders',
        strict: 'throw',
        versionKey: false
    })

    /*orderSchema.virtual('customers',{
        ref:'Customer',
        foreignField:'order',
        localField:'_id',
        justOne:false
    })  */

export default mongoose.model('Order', orderSchema);