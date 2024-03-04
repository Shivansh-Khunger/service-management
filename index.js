// Import necessary external module
import express from "express";

// Import internal modules
import { logger, httpLogger } from "./logger.js";
import connectToDb from "./config/db.js";

// Import route modules
import userRoutes from "./routes/userRoutes.js";
import businessRoutes from "./routes/businessRoutes.js";
import productRoutes from "./routes/productRoutes.js";

// Define the port on which the server will run
const PORT = process.env.PORT || 3001;

// Initialize the express application
const app = express();

// Add middleware to parse JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(httpLogger);

// Connect to the database
await connectToDb();

// Start the server and log the URL at which it's running
// The URL depends on whether the environment is development or production
if (process.env.NODE_ENV === "development") {
	app.listen(PORT, () => {
		logger.info(`-> now listening at http://localhost:${PORT}/`);
	});
}

if (process.env.NODE_ENV === "production") {
	app.listen(PORT, () => {
		logger.info(`-> now listening at https://localhost:${PORT}/`);
	});
}

// Define a route for the base URL that sends a welcome message
app.get("/", (req, res) => {
	res.send("Welcome to service-management of IJUJU.");
});

// Define the version number for the API
const versionNumber = `v1`;

// Add the user, business, and product routes to the application
// The routes are prefixed with the version number
app.use(`/${versionNumber}/u`, userRoutes);
app.use(`/${versionNumber}/b`, businessRoutes);
app.use(`/${versionNumber}/p`, productRoutes);
