import mongoose from 'mongoose'
import Bike from '../models/Bike';

const connectDB = async () => {
    try {
        console.log(process.env.MONGO_URI)
        await mongoose.connect(process.env.MONGO_URI);
        await Bike.updateMany({}, {
        $unset: { price: "" },
        $set: { price: 100000 }
        }); 
        console.log("Mongo connected successfully");
    } catch(err) {
        console.error('Mongo connected failed:', err.message);
    }
}

export default connectDB;


