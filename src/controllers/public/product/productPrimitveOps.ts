// Importing types
import type { RequestHandler } from "express";

// Importing necessary modules
import product from "@models/product";
import augmentAndForwardError from "@utils/errorAugmenter";
import ResponsePayload from "@utils/resGenerator";

const collectionName = "Product";
// Function to creates a new product
export const newProduct: RequestHandler = async (req, res, next) => {
    const funcName = "newProduct";

    // Create a new response payload
    const resPayload = new ResponsePayload();

    // Extract the product from the request body
    const { productData } = req.body;

    try {
        // Attempt to create the new product
        const newProduct = await product.create({ ...productData });

        let resMessage = "";
        const resLogMessage = `-> response for ${funcName} controller`;

        if (newProduct) {
            // Set the success response payload
            resMessage = `Request to create ${collectionName}-: ${req.body.productData.name} under business-: ${req.body.productData.businessId} is successfull.`;

            resPayload.setSuccess(resMessage, newProduct);

            // Log the response payload
            res.log.info(resPayload, resLogMessage);

            // Send the response with a 201 status code
            return res.status(201).json(resPayload);
        }
        resMessage = `Request to create ${collectionName}-: ${req.body.productData.name} under business-: ${req.body.productData.businessId} is unsuccessfull.`;

        resPayload.setConflict(resMessage);

        res.log.info(resPayload, resLogMessage);

        return res.status(409).json(resPayload);
    } catch (err) {
        // Handle the caught error by passing it to the augmentAndForwardError function which will pass it to the error handling middleware
        augmentAndForwardError({ next: next, err: err, funcName: funcName });
    }
};

// Function to delete a product by its ID
export const delProduct: RequestHandler = async (req, res, next) => {
    const funcName = "delProduct";

    // Create a new response payload
    const resPayload = new ResponsePayload();

    const { productId } = req.params;

    let resMessage = "";
    try {
        // Attempt to find and delete the product by its Id
        const deletedProduct = await product.findByIdAndDelete(productId);

        const resLogMessage = `-> response for ${funcName} controller`;

        if (deletedProduct?._id.toString() === productId) {
            // If the product was successfully deleted
            // Create a success message
            resMessage = `Request to delete ${collectionName}-: ${productId} is successfull.`;

            // Set the success response payload
            resPayload.setSuccess(resMessage);

            // Log the response payload
            res.log.info(resPayload, resLogMessage);

            return res.status(200).json(resPayload);
        }
        // If the product could not be deleted, create an error
        resMessage = `Request to delete ${collectionName}-: ${productId} is unsuccessfull.`;

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
