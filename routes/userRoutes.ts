// Import necessary modules
import express from "express";

// Import controllers
import * as userControllers from "../controllers/public/user/index";

// Import middlewares
import { validateParams, validateBody } from "../middlewares/inputValidator";
import handleError from "../middlewares/errorHandler";

// Import schemas for validation
import {
	newUserSchema,
	delUserSchema,
} from "../validation/user/primitveOps";

import {
	updateUserParamsSchema,
	updateUserBodySchema,
} from "../validation/user/managementOps";

// Initialize a new router
const router = express.Router();

// Define a POST route for creating a new user
// The request body is validated against the newUserSchema
// The 'userData' entity in the request body is specifically validated
router.post(
	"/new",
	validateBody({ schema: newUserSchema, entity: "userData" }),
	userControllers.newUser,
);

// Define a DELETE route for deleting a user
// The route parameters are validated against the deleteUserSchema
router.delete(
	"/:userId",
	validateParams({ schema: delUserSchema }),
	userControllers.delUser,
);

// Define a PUT route for updating a user
// The route parameters are validated against the updateUserParamsSchema
// The 'latestUser' entity in the request body is specifically validated against the updateUserBodySchema
router.put(
	"/:userId",
	validateParams({ schema: updateUserParamsSchema }),
	validateBody({ schema: updateUserBodySchema, entity: "latestUser" }),
	userControllers.updateUser,
);

// Use the handleError middleware for error handling
// This middleware function will be invoked for any errors that occur in the route handlers
router.use(handleError);

// Export the router
export default router;
