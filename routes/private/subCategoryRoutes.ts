// Import necessary modules
import express from "express";

// Import controllers
import * as subCatControllers from "../../controllers/private/subCategory/";

// Import middlewares
import checkForApiKey from "../../middlewares/apiKeyCheck";
import handleError from "../../middlewares/errorHandler";
import { validateBody, validateParams } from "../../middlewares/inputValidator";
import checkForSubCategory from "../../middlewares/subCategoryCheck";

// Import validation schemas
import * as subCatSchemas from "../../validation/subCategory/";

// Initialize a new router
const router = express.Router();

// Define a POST route for creating a new subCategory
// The request body is validated against the newSubCategorySchema
// The 'subCategoryData' entity in the request body is specifically validated
// The 'key' query parameter is used for API key authentication
router.post(
	"/new?key",
	checkForApiKey, // Middleware to check the API key in the 'key' query parameter
	checkForSubCategory({ checkIn: "body", entity: "subCategoryName" }), // Middleware to check if the subCategory already exists
	validateBody({
		schema: subCatSchemas.newSubCategory,
		entity: "subCategoryData",
	}),
	subCatControllers.newSubCategory,
);

// Define a DELETE route for deleting a subCategory
// The route parameters are validated against the delSubCategorySchema
// The 'key' query parameter is used for API key authentication
router.delete(
	"/:subCategoryName?key",
	checkForApiKey, // Middleware to check the API key in the 'key' query parameter
	checkForSubCategory({ checkIn: "params", entity: "subCategoryName" }), // Middleware to check if the subCategory exists
	validateParams({ schema: subCatSchemas.delSubCategory }),
	subCatControllers.delSubCategory,
);

// Use the handleError middleware for error handling
// This middleware function will be invoked for any errors that occur in the route handlers
router.use(handleError);

// Export the router
export default router;
