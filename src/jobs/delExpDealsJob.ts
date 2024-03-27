import mongoose from "mongoose";
import Deals from "../models/deal";

async function dealetedExpiredDeals() {
    await mongoose
        .connect(process.env.MONGO_URI as string)
        .then(() => {
            console.log("db connected !");

            Deals.deleteMany({
                endDate: { $lte: Date.now() },
            });

            mongoose.connection.close();
        })
        .catch((err) => {
            console.log(
                err,
                "-> an error has occured while connecting to the db!",
            );

            process.exit(1);
        });
}

(async () => {
    await dealetedExpiredDeals();

    console.log("query to delete expired Deals has been sent to db!");
    console.log("exiting ...");
    process.exit(0);
})();
