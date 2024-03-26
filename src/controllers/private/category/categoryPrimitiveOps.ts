// Importing types
import type { RequestHandler } from "express";

// Import the necessary modules
import Category from "@models/category";
import SubCategory from "@models/subCategory";
import augmentAndForwardError from "@utils/errorAugmenter";
import ResponsePayload from "@utils/resGenerator";

const collectionName = "Category";
// Function to create a new category
export const newCategory: RequestHandler = async (req, res, next) => {
    // Define the function name for error handling
    const funcName = "newCategory";

    // Create a new response payload
    const resPayload = new ResponsePayload();

    // Extract the category data from the request body
    const { categoryData } = req.body;

    try {
        // Define the response messages
        let resMessage = "";
        const resLogMessage = `-> response payload for ${funcName} controller`;

        // Create a new category
        const newCategory = await Category.create({ ...categoryData });

        if (newCategory) {
            // If the category was created successfully, set the success message
            resMessage = `Request to create ${collectionName}-: ${categoryData.name} is successfull.`;

            // Set the response payload to success
            resPayload.setSuccess(resMessage, newCategory);

            // Log the response payload
            res.log.info(resPayload, resLogMessage);

            // Send the response payload
            return res.status(201).json(resPayload);
        }
        // If the category was not created successfully, set the conflict message
        resMessage = `Request to create ${collectionName}-: ${categoryData.name} is unsuccessfull.`;

        // Set the response payload to conflict
        resPayload.setConflict(resMessage);

        // Log the response payload
        res.log.info(resPayload, resLogMessage);

        // Send the response payload
        return res.status(409).json(resPayload);
    } catch (err) {
        // Handle the caught error by passing it to the augmentAndForwardError function which will pass it to the error handling middleware
        augmentAndForwardError({ next: next, err: err, funcName: funcName });
    }
};

// Function to delete a category
export const delCategory: RequestHandler = async (req, res, next) => {
    // Define the function name for error handling
    const funcName = "deleteCategory";

    // Create a new response payload
    const resPayload = new ResponsePayload();

    // Extract the category ID from the request parameters
    const { categoryName } = req.params;

    try {
        // Define the response messages
        let resMessage = "";
        const resLogMessage = `-> response payload for ${funcName} controller`;

        // Delete the category
        const deletedCategory = await Category.findOneAndDelete({
            name: categoryName,
        });

        // Delete all subcategories associated with the category
        SubCategory
            .deleteMany({
                categoryId: deletedCategory?._id,
            })
            .catch((err) => {
                throw err;
            });

        if (deletedCategory?.name === categoryName) {
            // If the category was deleted successfully, set the success message
            resMessage = `Request to delete ${collectionName}-: ${categoryName} is successfull.`;

            // Set the response payload to success
            resPayload.setSuccess(resMessage);

            // Log the response payload
            res.log.info(resPayload, resLogMessage);

            // Send the response payload
            return res.status(200).json(resPayload);
        }
        // If the category was not deleted successfully, set the conflict message
        resMessage = `Request to delete ${collectionName}-: ${categoryName} is unsuccessfull.`;

        // Set the response payload to conflict
        resPayload.setConflict(resMessage);

        // Log the response payload
        res.log.info(resPayload, resLogMessage);

        // Send the response payload
        return res.status(409).json(resPayload);
    } catch (err) {
        augmentAndForwardError({ next: next, err: err, funcName: funcName });
    }
};
