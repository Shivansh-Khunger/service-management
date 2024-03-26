// Import necessary modules
import express from "express";

// Import product controllers
import * as productControllers from "@controllers/public/product/index";

// Import middlewares
import checkForAccessToken from "@middlewares/accessTokenCheck";
import { validateBody, validateParams } from "@middlewares/inputValidator";
import checkForProduct from "@middlewares/productCheck";

// Import error handling middleware
import handleError from "@middlewares/errorHandler";

// Import schemas for validation
import * as productSchemas from "@validations/product";

// Initialize a new router
const router = express.Router();

// Apply 'checkForAccessToken' middleware to all subsequent routes
router.use(checkForAccessToken);

// Define a POST route for creating a new product
// The request body is validated against the newProductSchema
router.post(
    "/new",
    validateBody({
        schema: productSchemas.newProduct,
        entity: "productData",
    }),
    productControllers.newProduct,
);

// Define a DELETE route for deleting a product
// The route parameters are validated against the deleteProductSchema
router.delete(
    "/:productId",
    validateParams({ schema: productSchemas.delProduct }),
    checkForProduct({
        checkIn: "params",
        bodyEntity: undefined,
        entity: "productId",
        passIfExists: true,
        key: "_id",
    }),
    productControllers.delProduct,
);

// Define a PUT route for updating a product
// The route parameters are validated against the updateProductPramasSchema
// The 'latestProduct' entity in the request body is specifically validated against the updateProductBodySchema
router.put(
    "/:productId",
    validateParams({ schema: productSchemas.updateProductPramas }),
    validateBody({
        schema: productSchemas.updateProductBody,
        entity: "latestProduct",
    }),
    checkForProduct({
        checkIn: "params",
        bodyEntity: undefined,
        entity: "productId",
        passIfExists: true,
        key: "_id",
    }),
    productControllers.updateProduct,
);

// Use the handleError middleware for error handling
// This middleware function will be invoked for any errors that occur in the route handlers
router.use(handleError);

// Export the router
export default router;
