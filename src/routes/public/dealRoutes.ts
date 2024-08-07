// Import necessary modules
import express from 'express';

// Import deal controllers
import * as dealControllers from '@controllers/public/deals';

// Import middlewares
import checkForAccessToken from '@middlewares/accessTokenCheck';
import checkForBusiness from '@middlewares/businessCheck';
import checkForDeal from '@middlewares/dealCheck';
import { validateBody, validateParams } from '@middlewares/inputValidator';
import checkForProduct from '@middlewares/productCheck';
import * as limiters from '../../config/rateLimiter';

// Import error handling middleware
import handleError from '@middlewares/errorHandler';

// Import schemas for validation
import * as dealSchemas from '@validations/deal';

// Initialize a new router
const router = express.Router();

router.get(
    '/',
    limiters.getDealLimiter,
    checkForAccessToken,
    validateBody({ schema: dealSchemas.getDealsBody, entity: 'userData' }),
    dealControllers.getDeals,
);

router.use(limiters.stdLimiter);

// Apply 'checkForAccessToken' middleware to all subsequent routes
router.use(checkForAccessToken);

// Define a POST route for creating a new deal
// The request body is validated against the newDealSchema
// The 'dealData' entity in the request body is specifically validated
router.post(
    '/new',
    validateBody({
        schema: dealSchemas.newDeal,
        entity: 'dealData',
    }),
    checkForBusiness({
        checkIn: 'body',
        bodyEntity: 'dealData',
        entity: 'businessId',
        passIfExists: true,
        key: '_id',
    }),
    checkForProduct({
        checkIn: 'body',
        bodyEntity: 'dealData',
        entity: 'productId',
        passIfExists: true,
        key: '_id',
    }),
    dealControllers.newDeal,
);

// Define a DELETE route for deleting a deal
// The route parameters are validated against the delDealSchema
router.delete(
    '/:dealId',
    validateParams({ schema: dealSchemas.delDeal }),
    checkForDeal({
        checkIn: 'params',
        bodyEntity: null,
        entity: 'dealId',
        passIfExists: true,
        key: '_id',
    }),
    dealControllers.delDeal,
);

// Use the handleError middleware for error handling
// This middleware function will be invoked for any errors that occur in the route handlers
router.use(handleError);

export default router;
