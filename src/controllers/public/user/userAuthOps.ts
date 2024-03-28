// Import types
import type { JWT } from "@helpers/createTokens";
import type { RequestHandler } from "express";
import type { PipelineStage } from "mongoose";

// Import necessary modules
import { insertJWT } from "@helpers/createCookie";
import createToken from "@helpers/createTokens";
import User from "@models/user";
import augmentAndForwardError from "@utils/errorAugmenter";
import ResponsePayload from "@utils/resGenerator";
import bcrypt from "bcrypt";

// Define the collection name
const collectionName = "User";

// Define the loginUser function, which is an Express.js middleware function
export const loginUser: RequestHandler = async (req, res, next) => {
    // Define the function name
    const funcName = "loginUser";

    // Create a new instance of the ResponsePayload class
    const resPayload = new ResponsePayload();

    // Extract userCredentials from the request body
    const { userCredentials } = req.body;

    // Try to execute the following code
    try {
        // Define a MongoDB aggregation pipeline
        const pipeline: PipelineStage[] = [
            {
                // Match documents where the email field is equal to the provided email
                $match: {
                    $or: [
                        {
                            email: userCredentials.email,
                        },
                        {
                            phoneNumber: userCredentials.phoneNumber,
                        },
                    ],
                },
            },
            {
                // Perform a left outer join with the businesses collection
                $lookup: {
                    from: "businesses",
                    localField: "_id",
                    foreignField: "userId",
                    as: "businesses",
                },
            },
            {
                // Perform a left outer join with the products collection
                $lookup: {
                    from: "products",
                    localField: "business._id",
                    foreignField: "businessId",
                    as: "businesses.products",
                },
            },
        ];

        // Try to find a user that matches either the provided email or phone number
        const tempUser = await User.findOne(
            {
                $or: [
                    {
                        email: userCredentials?.email,
                    },
                    {
                        phoneNumber: userCredentials?.phoneNumber,
                    },
                ],
            },

            // Select the password field
            { password: true },
        );

        // Extract the provided password from userCredentials
        const recievedPassword = userCredentials.password;

        // Define a variable to hold the response message
        let resMessage: string;

        // Define a log message
        const resLogMessage = `-> response payload for ${funcName} controller`;

        // If a user was found
        if (tempUser) {
            const ifAuthorised = await bcrypt.compare(
                recievedPassword,
                tempUser.password,
            );
            // If the provided password matches the stored password
            if (ifAuthorised) {
                // Execute the aggregation pipeline
                const user = await User.aggregate(pipeline);

                // Create the payload for the access token
                const userAccessTokenPayload: JWT = {
                    sub: user[0]._id.toString(), // The subject of the token is the user's ID
                    userData: {
                        name: user[0].name,
                        email: user[0].email,
                    },
                };

                // Create the access token
                const userAccessToken = createToken(
                    userAccessTokenPayload,
                    false, // This is not a refresh token
                );

                // Define the max age for the access token cookie
                const userAccessCookieMaxAge = 1000 * 60 * 60; // One hour

                // Insert the access token into a cookie
                insertJWT({
                    res: res, // The response object
                    field: 'accessToken', // The name of the cookie
                    fieldValue: userAccessToken, // The value of the cookie
                    maxAge: userAccessCookieMaxAge, // The max age of the cookie
                });

                // Create a payload for the new refresh token
                const userRefreshTokenPayload: JWT = {
                    sub: user[0]._id.toString(), // The subject of the token is the user's ID
                    userData: {
                        name: user[0].name,
                        email: user[0].email,
                    },
                };

                // Create the refresh token
                const userRefreshToken = createToken(
                    userRefreshTokenPayload,
                    true, // This is a refresh token
                );

                // Define the max age for the refresh token cookie
                const userRefreshCookieMaxAge = 1000 * 60 * 60 * 24 * 7; // One week

                // Insert the refresh token into a cookie
                insertJWT({
                    res: res,
                    field: 'refreshToken',
                    fieldValue: userRefreshToken,
                    maxAge: userRefreshCookieMaxAge,
                });

                // Define a success message
                resMessage = `Request to log in ${collectionName}-: ${
                    userCredentials?.email
                        ? userCredentials?.email
                        : userCredentials?.phoneNumber
                } is successfull`;

                // Set the response payload as successful
                resPayload.setSuccess(resMessage, user);

                // Log the response payload
                res.log.info(resPayload, resLogMessage);

                // Send a 200 status code and the response payload back to the client
                return res.status(200).json(resPayload);
            }

            // Define an error message
            resMessage = `Request to log in user-: ${
                userCredentials?.email
                    ? userCredentials?.email
                    : userCredentials?.phoneNumber
            } is unsuccessfull due to wrong password`;

            // Set the response payload as an error
            resPayload.setError(resMessage);

            // Log the response payload
            res.log.info(resPayload, resLogMessage);

            // Send a 401 status code and the response payload back to the client
            return res.status(401).json(resPayload);
        }

        // Define an error message
        resMessage =
            "Request to log in user is unsuccessfull due to user being non-existent";

        resPayload.setError(resMessage);

        // Log the response payload
        res.log.info(resPayload, resLogMessage);

        // Send a 404 status code and the response payload back to the client
        return res.status(404).json(resPayload);
    } catch (err) {
        // If an error is caught, pass it to the augmentAndForwardError function
        augmentAndForwardError({ next: next, err: err, funcName: funcName });
    }
};
