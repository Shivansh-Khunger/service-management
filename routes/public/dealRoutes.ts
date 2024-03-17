// Import necessary modules
import express from "express";

// Import deal controllers
import * as dealControllers from "../../controllers/public/deals";

// Import validation middlewares
import { validateBody, validateParams } from "../../middlewares/inputValidator";

// Import error handling middleware
import handleError from "../../middlewares/errorHandler";

// Import schemas for validation
import * as dealSchemas from "../../validation/deal";

// Initialize a new router
const router = express.Router();

// Define a POST route for creating a new deal
// The request body is validated against the newDealSchema
// The 'dealData' entity in the request body is specifically validated
router.post(
	"/new",
	validateBody({
		schema: dealSchemas.newDeal,
		entity: "dealData",
	}),
	dealControllers.newDeal,
);

// Define a DELETE route for deleting a deal
// The route parameters are validated against the delDealSchema
router.delete(
	"/:dealId",
	validateParams({ schema: dealSchemas.delDeal }),
	dealControllers.delDeal,
);

router.get(
	"/:userId",
	validateParams({ schema: dealSchemas.getDealsParams }),
	validateBody({ schema: dealSchemas.getDealsParams, entity: "userData" }),
	dealControllers.getDeals,
);

// Use the handleError middleware for error handling
// This middleware function will be invoked for any errors that occur in the route handlers
router.use(handleError);
