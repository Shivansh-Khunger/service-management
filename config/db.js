import { logger } from "../logger.js";

import mongoose from "mongoose";

async function connectToDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI).then(() => {
      logger.info("db connected !");
    });
  } catch (err) {
    logger.error(err, `-> an error has occured while connecting to the db!`);
  }
}

export default connectToDb;
