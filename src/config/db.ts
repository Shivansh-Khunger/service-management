// Import the logger module
import { logger } from '@logger';

// Import the mongoose module, which is used to interact with MongoDB
import mongoose from 'mongoose';

// Define an asynchronous function to connect to the MongoDB database
async function connectToDb() {
    // Attempt to connect to the MongoDB database using the connection string stored in the environment variable MONGO_URI
    // If the connection is successful, log a message indicating that the database connection was successful
    await mongoose
        .connect(process.env.MONGO_URI as string)
        .then(() => {
            logger.info('db connected !');
        })
        .catch(err => {
            // If an error occurs while trying to connect to the database, log the error and a message indicating that the connection failed
            logger.error(
                err,
                '-> an error has occured while connecting to the db!',
            );

            logger.fatal('server is closing... :[');
            process.exit(1);
        });
}

// Export the connectToDb function as the default export of this module
export default connectToDb;
