// Importing required modules
import mongoose from "mongoose";
import Deals from "../models/deal";

// Function to delete expired deals
async function dealetedExpiredDeals() {
    // Connect to MongoDB using the URI in the environment variables
    await mongoose
        .connect(process.env.MONGO_URI as string)
        .then(() => {
            // Log a message when the database connection is successful
            console.log('db connected! :)');

            // Delete all deals where the end date is less than or equal to the current date/time
            Deals.deleteMany({
                endDate: { $lte: Date.now() },
            });

            // Close the database connection
            mongoose.connection.close();
        })
        .catch((err) => {
            // Log an error message if the database connection fails
            console.log(
                err,
                "-> an error has occured while connecting to the db!",
            );

            // Exit the process with a failure status code
            process.exit(1);
        });
}

// Immediately invoked function expression (IIFE) to run the deleteExpiredDeals function
(async () => {
    // Run the function to delete expired deals
    await dealetedExpiredDeals();

    // Log a message indicating that the query has been sent to the database
    console.log("query to delete expired Deals has been sent to db!");

    // Log a message indicating that the process is exiting
    console.log("exiting... ^___^");

    // Exit the process with a success status code
    process.exit(0);
})();