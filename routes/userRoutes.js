// Import necessary modules
import express from "express";

// Import controllers
import * as userControllers from "../controllers/user/index.js";

// Import middlewares
import { validateParams, validateBody } from "../middlewares/inputValidator.js";
import handleError from "../middlewares/errorHandler.js";

// Import schemas for validation
import {
	newUserSchema,
	deleteUserSchema,
} from "../schemas/user/primitveOps.js";

import {
	updateUserParamsSchema,
	updateUserBodySchema,
} from "../schemas/user/managementOps.js";

// Initialize a new router
const router = express.Router();

// Define a POST route for creating a new user
// The request body is validated against the newUserSchema
// The 'userData' entity in the request body is specifically validated
router.post(
	"/new",
	validateBody({ schema: newUserSchema, entity: `userData` }),
	userControllers.newUser,
);

// Define a DELETE route for deleting a user
// The route parameters are validated against the deleteUserSchema
router.delete(
	"/:userId",
	validateParams({ schema: deleteUserSchema }),
	userControllers.deleteUser,
);

// Define a PUT route for updating a user
// The route parameters are validated against the updateUserParamsSchema
// The 'latestUser' entity in the request body is specifically validated against the updateUserBodySchema
router.put(
	"/:userId",
	validateParams({ schema: updateUserParamsSchema }),
	validateBody({ schema: updateUserBodySchema, entity: `latestUser` }),
	userControllers.updateUser,
);

// Use the handleError middleware for error handling
// This middleware function will be invoked for any errors that occur in the route handlers
router.use(handleError);

// Export the router
export default router;
