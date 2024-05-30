import mongoose from "mongoose";

export const connectDB = async () => {

    try {
        const { connection } = await mongoose.connect(process.env.MONGO_URI, {
            dbName: "TestSample1"
        });
        console.log(`MongoDB is connected with ${connection.host}`);

    } catch (error) {
        console.log(error);
        setTimeout(connectDB, 5000);
    }

};