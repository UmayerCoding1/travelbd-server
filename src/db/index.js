import mongoose from 'mongoose';
import {DB_NAME} from '../constants.js'
console.log('s',process.env.MONGODB_URL);

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log('Mongodb connect is successfully');
    } catch (error) {
        console.log(error.message);
        process.exit(1);
        
    }
}

export default connectDB;