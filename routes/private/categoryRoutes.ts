// Import necessary modules
import express from "express";

// Import controllers
import * as catergoryControllers from "../../controllers/private/category/";

// Import middlewares
import checkForApiKey from "../../middlewares/apiKeyCheck";
import checkForCategory from "../../middlewares/categoryCheck";
import handleError from "../../middlewares/errorHandler";
import { validateBody, validateParams } from "../../middlewares/inputValidator";

// Import validation schemas
import * as categorySchemas from "../../validation/category/";

// Initialize a new router
const router = express.Router();

// Define a POST route for creating a new category
// The request body is validated against the newCategorySchema
// The 'categoryData' entity in the request body is specifically validated
// The 'key' query parameter is used for API key authentication
router.post(
	"/new?key",
	checkForApiKey,
	checkForCategory({ checkIn: "body", entity: "categoryName" }),
	validateBody({
		schema: categorySchemas.newCategory,
		entity: "categoryData",
	}),
	catergoryControllers.newCategory,
);

// Define a DELETE route for deleting a category
// The route parameters are validated against the delCategorySchema
// The 'key' query parameter is used for API key authentication
router.delete(
	"/:categoryName?key",
	checkForApiKey,
	checkForCategory({ checkIn: "params", entity: "categoryName" }),
	validateParams({ schema: categorySchemas.delCategory }),
	catergoryControllers.delCategory,
);

// Use the handleError middleware for error handling
// This middleware function will be invoked for any errors that occur in the route handlers
router.use(handleError);

// Export the router
export default router;
