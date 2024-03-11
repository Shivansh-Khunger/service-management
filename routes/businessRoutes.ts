// Import necessary modules
import express from "express";

// Import business controllers
import * as businessControllers from "../controllers/public/business/index";

// Import validation middlewares
import { validateParams, validateBody } from "../middlewares/inputValidator";

// Import error handling middleware
import handleError from "../middlewares/errorHandler";

// Import schemas for validation
import {
	newBusinessSchema,
	delBusinessSchema,
} from "../validation/business/primitiveOps";

import {
	updatedBusinessParamsSchema,
	updatedBusinessBodySchema,
} from "../validation/business/managementOps";

// Initialize a new router
const router = express.Router();

// Define a POST route for creating a new business
// The request body is validated against the newBusinessSchema
// The 'businessData' entity in the request body is specifically validated
router.post(
	"/new",
	validateBody({ schema: newBusinessSchema, entity: "businessData" }),
	businessControllers.newBusiness
);

// Define a DELETE route for deleting a business
// The route parameters are validated against the delBusinessSchema
router.delete(
	"/:businessId",
	validateParams({ schema: delBusinessSchema }),
	businessControllers.delBusiness
);

// Define a PUT route for updating a business
// The route parameters are validated against the updatedBusinessParamsSchema
// The request body is validated against the updatedBusinessBodySchema
router.put(
	"/:businessId",
	validateParams({ schema: updatedBusinessParamsSchema }),
	validateBody({ schema: updatedBusinessBodySchema, entity: "latestBusiness" }),
	businessControllers.updateBusiness
);

// Use the handleError middleware for error handling
// This middleware function will be invoked for any errors that occur in the route handlers
router.use(handleError);

// Export the router
export default router;
