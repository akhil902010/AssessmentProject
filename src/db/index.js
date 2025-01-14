import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";


const connectionDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log(`MONGODB Connection is connected !!! Host ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("MONGODB Connection Failed: ", error);
    process.exit(1);
  }
};

export default connectionDB;