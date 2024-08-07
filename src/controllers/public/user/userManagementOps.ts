// Importing types
import type { RequestHandler } from "express";

// Importing necessary modules
import User from "@models/user";
import augmentAndForwardError from "@utils/errorAugmenter";
import ResponsePayload from "@utils/resGenerator";

const collectionName = "User";
export const updateUser: RequestHandler = async (req, res, next) => {
    const funcName = "updateUser";

    // Create a new response payload
    const resPayload = new ResponsePayload();

    // Extract the user Id from request params
    const { userId } = req.userCredentials;

    // Extract the updated user data from the request body
    const { latestUser } = req.body;

    try {
        // Attempt to find the user by its ID and update it
        const updatedUser = await User.findByIdAndUpdate(userId, latestUser, {
            new: true,
        });

        let resMessage = "";

        // If the user was successfully updated
        if (updatedUser) {
            // Create a success message
            resMessage = `Request to update ${collectionName}-: ${userId} is successfull.`;

            // Set the success response payload
            resPayload.setSuccess(resMessage, updatedUser);

            // Log the response payload
            res.log.info(resPayload, `-> response for ${funcName} controller`);

            // Send the response with a 200 status code
            return res.status(200).json(resPayload);
        }
        // If the user could not be updated, create a conflict message
        resMessage = `Request to update ${collectionName}-: ${userId} is unsuccessfull.`;

        resPayload.setConflict(resMessage);

        res.log.info(resPayload, `-> response for ${funcName} controller`);

        return res.status(409).json(resPayload);
    } catch (err) {
        // Handle the caught error by passing it to the augmentAndForwardError function which will pass it to the error handling middleware
        augmentAndForwardError({ next: next, err: err, funcName: funcName });
    }
};
