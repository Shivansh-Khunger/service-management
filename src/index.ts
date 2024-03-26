// Import necessary external module
import fs from "node:fs";
import https from "node:https";
import cookieParser from "cookie-parser";
import express from "express";
import connectToDb from "./config/db";

// Import internal modules
import { httpLogger, logger } from "./logger";

// Import route modules
import categoryRoutes from "@routes/private/categoryRoutes";
import subCategoryRoutes from "@routes/private/subCategoryRoutes";
import businessRoutes from "@routes/public/businessRoutes";
import dealRoutes from "@routes/public/dealRoutes";
import productRoutes from "@routes/public/productRoutes";
import serviceRoutes from "@routes/public/serviceRoutes";
import userRoutes from "@routes/public/userRoutes";

// Define the port on which the server will run
const PORT = process.env.PORT || 3001;

// Initialize the express application
const app = express();

// Add middleware to parse JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET_KEY));
app.use(httpLogger);

(async () => {
    // Connect to the database
    await connectToDb();

    // Start the server and log the URL at which it's running
    // The URL depends on whether the environment is development or production
    if (process.env.NODE_ENV === "development") {
        const options = {
            key: fs.readFileSync("./ssl/cert.key"),
            cert: fs.readFileSync("./ssl/cert.crt"),
        };
        https.createServer(options, app).listen(PORT, () => {
            logger.info(`-> now listening at https://localhost:${PORT}/`);
        });
    }

    if (process.env.NODE_ENV === "production") {
        app.listen(PORT, () => {
            logger.info("-> server started");
        });
    }
})();

// Define a route for the base URL that sends a welcome message
app.get("/", (req, res) => {
    res.status(200).send("Welcome to API of IJUJU.");
});

// Define the version number for the API
const versionNumber = "v1";

// Add the user, business, and product routes to the application
// The routes are prefixed with the version number

// Public Routes
app.use(`/${versionNumber}/s`, serviceRoutes);
app.use(`/${versionNumber}/u`, userRoutes);
app.use(`/${versionNumber}/b`, businessRoutes);
app.use(`/${versionNumber}/p`, productRoutes);
app.use(`/${versionNumber}/d`, dealRoutes);

// Private Routes
app.use(`/${versionNumber}/c`, categoryRoutes);
app.use(`/${versionNumber}/sc`, subCategoryRoutes);
