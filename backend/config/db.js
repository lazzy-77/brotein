import mongoose from 'mongoose';
import config from 'config';
import logger from '../logger/logger.js';

const db = config.get('mongoURI');
const NAMESPACE = "db.js"

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    logger.info(NAMESPACE, "Connected to Mongo Successfully")
  } catch (err) {
    logging.error(NAMESPACE, "Authorization Request Failed.", error);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;
