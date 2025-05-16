import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        console.log(process.env.MONGO_URI)
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongo connected successfully");
    } catch(err) {
        console.error('Mongo connected failed:', err.message);
    }
}

export default connectDB;


