import mongoose from "mongoose";

const connectdb = async () => {
    mongoose.connection.on('connected', () => console.log("Database is connected"))
    await mongoose.connect(`${process.env.Mongodb_URL}/Testing`)
}

export default connectdb;