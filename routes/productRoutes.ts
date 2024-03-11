// Import necessary modules
import express from "express";

// Import product controllers
import * as productControllers from "../controllers/public/product/index";

// Import validation middlewares
import { validateParams, validateBody } from "../middlewares/inputValidator";

// Import error handling middleware
import handleError from "../middlewares/errorHandler";

// Import schemas for validation
import {
	newProductSchema,
	delProductSchema,
} from "../validation/product/primitiveOps";

import {
	updateProductPramasSchema,
	updateProductBodySchema,
} from "../validation/product/managementOps";

// Initialize a new router
const router = express.Router();

// Define a POST route for creating a new product
// The request body is validated against the newProductSchema
router.post(
	"/new",
	validateBody({ schema: newProductSchema, entity: "productData" }),
	productControllers.newProduct
);

// Define a DELETE route for deleting a product
// The route parameters are validated against the deleteProductSchema
router.delete(
	"/:productId",
	validateParams({ schema: delProductSchema }),
	productControllers.delProduct
);

// Define a PUT route for updating a product
// The route parameters are validated against the updateProductPramasSchema
// The 'latestProduct' entity in the request body is specifically validated against the updateProductBodySchema
router.put(
	"/:productId",
	validateParams({ schema: updateProductPramasSchema }),
	validateBody({ schema: updateProductBodySchema, entity: "latestProduct" }),
	productControllers.updateProduct
);

// Use the handleError middleware for error handling
// This middleware function will be invoked for any errors that occur in the route handlers
router.use(handleError);

// Export the router
export default router;
