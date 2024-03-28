// Importing types
import type { RequestHandler } from 'express';

// Importing necessary modules
import Business from '@models/business';
import Product from '@models/product';
import augmentAndForwardError from '@utils/errorAugmenter';
import ResponsePayload from '@utils/resGenerator';
import axios from 'axios';

export const collectionName = 'Business';
// Function to create a new business
export const newBusiness: RequestHandler = async (req, res, next) => {
    const funcName = 'newBusiness';

    // Create a new instance of ResponsePayloadim
    const resPayload = new ResponsePayload();

    // Extract business object from request body
    const { businessData } = req.body;
    const { userName, userEmail } = req.userCredentials;

    try {
        // Create a new business with the data from the request body
        const newBusiness = await Business.create({
            ...businessData,
        });

        let resMessage = '';
        const resLogMessage = `-> response for ${funcName} function`;

        if (newBusiness) {
            axios.post(`${process.env.SERVICE_EMAIL_URL}b/new`, {
                recipientEmail: userEmail,
                recipientName: userName,
                businessName: newBusiness.name,
            });

            // Create a success message
            resMessage = `Request to create ${collectionName}-: ${businessData.name} is successfull.`;

            // Set the success response payload
            resPayload.setSuccess(resMessage, newBusiness);

            // Log the response payload
            res.log.info(resPayload, resLogMessage);

            // Return the response payload with status 201
            return res.status(201).json(resPayload);
        }
        resMessage = `Request to create ${collectionName}-: ${businessData.name} is unsuccessfull.`;

        resPayload.setConflict(resMessage);

        res.log.info(resPayload, resLogMessage);

        return res.status(409).json(resPayload);
    } catch (err) {
        // Handle the caught error by passing it to the augmentAndForwardError function which will pass it to the error handling middleware
        augmentAndForwardError({ next: next, err: err, funcName: funcName });
    }
};

// Function to delete a business
export const delBusiness: RequestHandler = async (req, res, next) => {
    const funcName = 'delBusiness';

    // Create a new instance of ResponsePayload
    const resPayload = new ResponsePayload();

    // Extract business id from request params
    const { businessId } = req.params;
    const { userName, userEmail } = req.userCredentials;

    try {
        // Delete the business with the id from the request parameters
        const deletedBusiness = await Business.findByIdAndDelete(businessId, {
            name: true,
        });

        Product.deleteMany({ businessId: businessId });

        const resLogMessage = `-> response for ${funcName} controller`;

        if (deletedBusiness?._id.toString() === businessId) {
            axios.post(`${process.env.SERVICE_EMAIL_URL}b/new`, {
                recipientEmail: userEmail,
                recipientName: userName,
                businessName: deletedBusiness.name,
            });

            // If the business was successfully deleted
            // Set the success message
            const resMessage = `Request to delete ${collectionName}-: ${businessId} is successfull.`;

            // Set the success response payload
            resPayload.setSuccess(resMessage);

            // Log the response payload
            res.log.info(resPayload, resLogMessage);

            // Return the response payload with status 200
            return res.status(200).json(resPayload);
        }
        // If the business could not be deleted, create a new error
        const resMessage = `Request to delete ${collectionName}-: ${businessId} is unsuccessfull.`;

        // Set the conflict response payload
        resPayload.setConflict(resMessage);

        // Log the response payload
        res.log.info(resPayload, resLogMessage);

        // Return the response payload with status 409
        return res.status(409).json(resPayload);
    } catch (err) {
        augmentAndForwardError({ next: next, err: err, funcName: funcName });
    }
};
