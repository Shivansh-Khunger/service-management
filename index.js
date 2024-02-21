// internal import
import { logger, httpLogger } from "./logger.js";
import connectToDb from "./config/db.js";

// external import
import express from "express";

// define PORT
const PORT = process.env.PORT || 3001;

// initialise app
const app = express();

// add parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// connnect to db
await connectToDb();

// listen
app.listen(PORT, () => {
  logger.info(`-> now listening at http://localhost:${PORT}/`);
});

// listen base route
app.get("/", (req, res) => {
  res.send("Welcome to service-1 of IJUJU.");
});
