import mongoose from "mongoose";

const connectDB = async (collectioName) => {

    try {

        let connection= await mongoose.connect(`mongodb://localhost:27017/${collectioName}`)
        console.log("connected to database", collectioName);
        
    } catch (error) {
        
        console.log("error connecting to database", error);
        process.exit(1);
    }
    


}
export default connectDB;