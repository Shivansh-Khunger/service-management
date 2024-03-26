// Import types
import type { JWT } from "@helpers/createTokens";
import type { RequestHandler } from "express";

// Import necessary modules
import { insertJWT } from "@helpers/createCookie";
import createToken from "@helpers/createTokens";
import hashPassword from "@helpers/hashPassword";
import { ifUserExistsByEmail } from "@helpers/models/userExists";
import Business from "@models/business";
import Product from "@models/product";
import User from "@models/user";
import augmentAndForwardError from "@utils/errorAugmenter";
import generateReferal from "@utils/referalGenerator";
import ResponsePayload from "@utils/resGenerator";

// TODO -> think & implement auth soln.

// Function to creates a new user
export const newUser: RequestHandler = async (req, res, next) => {
    const funcName = "newUser";

    // Create a new response payload
    const resPayload = new ResponsePayload();

    // Extract the user data from the request body
    const { userData } = req.body;

    try {
        // Check if a user with the same email or phone number already exists
        const ifUser = await ifUserExistsByEmail(
            userData.email,
            userData.phoneNumber,
        );

        let resMessage: string;
        const resLogMessage = `-> response payload for ${funcName} controller`;

        if (!ifUser) {
            // Get the referral code from the user data
            let referalCode = userData.referalCode;

            // If a referral code was provided, increment the bounty of the user who provided the referral code
            if (referalCode !== "") {
                const userWithReferalCode = User.updateOne(
                    {
                        referalCode: referalCode,
                    },
                    { $inc: { bounty: 1 } },
                );
            }

            // Generate a referral code for the new user
            referalCode = generateReferal(userData.name);

            // Hash the user's password
            const hashedPassword = await hashPassword(userData.password);

            // Attempt to create a new user with the provided data
            const newUser = await User.create({
                ...userData,
                password: hashedPassword,
                referalCode: referalCode,
            });

            // If the user was created successfully, send a success response
            if (newUser) {
                // Create the payload for the access token
                const userAccessTokenPayload: JWT = {
                    sub: newUser._id.toString(), // The subject of the token is the user's ID
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
                    field: "accessToken", // The name of the cookie
                    fieldValue: userAccessToken, // The value of the cookie
                    maxAge: userAccessCookieMaxAge, // The max age of the cookie
                });

                // Create a payload for the new refresh token
                const userRefreshTokenPayload: JWT = {
                    sub: newUser._id.toString(),
                };

                // Create a new refresh token
                const userRefreshToken = createToken(
                    userRefreshTokenPayload,
                    true,
                );

                // Define the max age for the refresh token cookie (1 week)
                const userRefreshCookieMaxAge = 1000 * 60 * 60 * 24 * 7;

                // Insert the new refresh token into a cookie
                insertJWT({
                    res: res,
                    field: "refreshToken",
                    fieldValue: userRefreshToken,
                    maxAge: userRefreshCookieMaxAge,
                });

                resMessage = `Request to create a user with name-: ${userData.name} and email -:${userData.email} is successfull.`;
                resPayload.setSuccess(resMessage, newUser);

                res.log.info(resPayload, resLogMessage);

                return res.status(201).json(resPayload);
            }
            // If the user was not created successfully, send a conflict response
            resMessage = `Request to create a user with name-: ${userData.name} and email -:${userData.email} is not successfull.`;

            resPayload.setConflict(resMessage);

            res.log.info(resPayload, resLogMessage);

            return res.status(409).json(resPayload);
        }
        // If a user with the same email or phone number already exists, send a conflict response
        resMessage = `Request to create a user with the email-: ${userData.email} and phone number-:${userData.phoneNumber} was not successful because a user with these details already exists.`;

        resPayload.setConflict(resMessage);

        res.log.info(resPayload, resLogMessage);

        return res.status(409).json(resPayload);
    } catch (err) {
        // Handle the caught error by passing it to the augmentAndForwardError function which will pass it to the error handling middleware
        augmentAndForwardError({ next: next, err: err, funcName: funcName });
    }
};

export const delUser: RequestHandler = async (req, res, next) => {
    const funcName = "deleteUser";

    const resPayload = new ResponsePayload();

    const { userId } = req.userCredentials;

    try {
        Business.deleteMany({
            userId: userId,
        });

        Product.deleteMany({
            userId: userId,
        });

        const deletedUser = await User.findByIdAndDelete(userId);

        let resMessage: string;

        if (deletedUser?._id.toString() === userId) {
            resMessage = `the request to delete the user-: ${userId} is successfull.`;

            resPayload.setSuccess(resMessage);

            res.log.info(
                resPayload,
                `-> response payload for ${funcName} controller`,
            );
            res.status(200).json(resPayload);
        } else {
            resMessage = `the request to delete the user-: ${userId} is not successfull.`;

            resPayload.setConflict(resMessage);

            res.log.info(
                resPayload,
                `-> response payload for ${funcName} controller`,
            );
            res.status(401).json(resPayload);
        }
    } catch (err) {
        augmentAndForwardError({ next: next, err: err, funcName: funcName });
    }
};
