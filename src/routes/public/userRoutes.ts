// Import necessary modules
import express from "express";

// Import controllers
import * as userControllers from "@controllers/public/user/index";

// Import middlewares
import checkForAccessToken from "@middlewares/accessTokenCheck";
import handleError from "@middlewares/errorHandler";
import { validateBody, validateParams } from "@middlewares/inputValidator";

// Import validation schemas
import * as userSchemas from "@validations/user";

// Initialize a new router
const router = express.Router();

// Define a POST route for creating a new user
// The request body is validated against the newUserSchema
// The 'userData' entity in the request body is specifically validated
router.post(
    "/new",
    validateBody({ schema: userSchemas.newUser, entity: "userData" }),
    userControllers.newUser,
);

// Apply 'checkForAccessToken' middleware to all subsequent routes
router.use(checkForAccessToken);

// Define a DELETE route for deleting a user
// The route parameters are validated against the deleteUserSchema
router.delete(
    "/:userId",
    validateParams({ schema: userSchemas.delUser }),
    userControllers.delUser,
);

// Define a PUT route for updating a user
// The route parameters are validated against the updateUserParamsSchema
// The 'latestUser' entity in the request body is specifically validated against the updateUserBodySchema
router.put(
    "/:userId",
    validateParams({ schema: userSchemas.updateUserParams }),
    validateBody({
        schema: userSchemas.updateUserBody,
        entity: "latestUser",
    }),
    userControllers.updateUser,
);

// Use the handleError middleware for error handling
// This middleware function will be invoked for any errors that occur in the route handlers
router.use(handleError);

// Export the router
export default router;
