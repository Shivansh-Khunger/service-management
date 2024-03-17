// Import necessary modules
import express from "express";

// Import business controllers
import * as businessControllers from "../../controllers/public/business/index";

// Import middlewares
import checkForBusiness from "../../middlewares/businessCheck";
import { validateBody, validateParams } from "../../middlewares/inputValidator";

// Import error handling middleware
import handleError from "../../middlewares/errorHandler";

// Import schemas for validation
import * as businessSchemas from "../../validation/business/";

// Initialize a new router
const router = express.Router();

// Define a POST route for creating a new business
// The request body is validated against the newBusinessSchema
// The 'businessData' entity in the request body is specifically validated
router.post(
	"/new",
	validateBody({
		schema: businessSchemas.newBusiness,
		entity: "businessData",
	}),
	businessControllers.newBusiness,
);

// Define a DELETE route for deleting a business
// The route parameters are validated against the delBusinessSchema
router.delete(
	"/:businessId",
	validateParams({ schema: businessSchemas.delBusiness }),
	checkForBusiness({
		checkIn: "params",
		bodyEntity: undefined,
		entity: "businessId",
		passIfExists: true,
		key: "_id",
	}),
	businessControllers.delBusiness,
);

// Define a PUT route for updating a business
// The route parameters are validated against the updatedBusinessParamsSchema
// The request body is validated against the updatedBusinessBodySchema
router.put(
	"/:businessId",
	validateParams({ schema: businessSchemas.updatedBusinessParams }),
	validateBody({
		schema: businessSchemas.updatedBusinessBody,
		entity: "latestBusiness",
	}),
	checkForBusiness({
		checkIn: "params",
		bodyEntity: undefined,
		entity: "businessId",
		passIfExists: true,
		key: "_id",
	}),
	businessControllers.updateBusiness,
);

// Use the handleError middleware for error handling
// This middleware function will be invoked for any errors that occur in the route handlers
router.use(handleError);

// Export the router
export default router;
