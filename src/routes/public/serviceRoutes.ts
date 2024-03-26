// Import necessary modules
import express from "express";

// Import service controllers
import * as serviceControllers from "@services/index";

// Import validation middlewares
import checkForRefreshToken from "@middlewares/refreshTokenCheck";

// Import error handling middleware
import handleError from "@middlewares/errorHandler";

// Initialize a new router
const router = express.Router();

// Use the checkForRefreshToken middleware for all routes in this router
// This middleware checks if the refresh token provided in the request is valid
router.use(checkForRefreshToken);

// Define a POST route for "/refresh" that assigns a new refresh token
// The controller for this route is serviceControllers.assignNewRefreshToken
router.post("/refresh", serviceControllers.assignNewRefreshToken);

// Use the handleError middleware for all routes in this router
// This middleware handles any errors that occur during the processing of a request
router.use(handleError);

// Export the router to be used in other parts of the application
export default router;
