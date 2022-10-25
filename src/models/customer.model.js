import mongoose from 'mongoose';

const customerSchema = mongoose.Schema({
    name: { type: String, unique: false, required: true },
    email: { type: String, unique: true, required: true },
    planet: { type: String, unique: false, required: true },
    coord:
    {
        lon: { type: Number, min: -1000, max: 1000, required: true },
        lat: { type: Number, min: -1000, max: 1000, required: true },
    },
    phone: { type: String, required: true, maxLength: 16 },
    birthday: { type: Date, required: true },
    referalCode: { type: String },
},
    {
        collection: 'customers',
        strict: 'throw',
        versionKey: false
    }
);

export default mongoose.model('Customer', customerSchema);