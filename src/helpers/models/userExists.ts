// Import types
import type CustomError from "@utils/customError";
import type mongoose from "mongoose";

// Import necessary modules
import user from "@models/user";

// Function to check if a user exists by email or phone number
export async function ifUserExistsByEmail(
    userEmail: string,
    userPhoneNumber: string,
) {
    const funcName = "ifUserExistsByEmail";
    try {
        // Query the user collection for a user with the provided email or phone number
        const userExists = await user.exists({
            $or: [
                {
                    email: userEmail,
                },
                {
                    phoneNumber: userPhoneNumber,
                },
            ],
        });

        // If a user was found, return true
        if (userExists) {
            return true;
        }

        // If no user was found, return false
        return false;
    } catch (err) {
        const customErr = err as CustomError;

        // Add the function name to the error object
        customErr.funcName = funcName;

        // Throw the error to be caught in the controller catch block
        throw customErr;
    }
}

// Function to check if a user exists by ID
export async function ifUserExistsById(userId: string | mongoose.ObjectId) {
    const funcName = "ifUserExistsById";
    try {
        // Query the user collection for a user with the provided ID
        const userExists = await user.exists({
            _id: userId,
        });

        // If a user was found, return true
        if (userExists) {
            return true;
        }

        // If no user was found, return false
        return false;
    } catch (err) {
        const customErr = err as CustomError;

        // Add the function name to the error object
        customErr.funcName = funcName;

        // Throw the error to be caught in the controller catch block
        throw customErr;
    }
}

// Function to get a user's IMEI by ID
export async function getUserImei(userImei: string) {
    const funcName = "getUserImei";
    try {
        // Query the user collection for a user with the provided ID
        const userExists = await user.findById(
            {
                userImei,
            },
            { _id: true, imeiNumber: true },
        );

        // If a user was found, return the user
        if (userExists) {
            return userExists;
        }

        // If no user was found, return null
        return null;
    } catch (err) {
        const customErr = err as CustomError;

        // Add the function name to the error object
        customErr.funcName = funcName;

        // Throw the error to be caught in the controller catch block
        throw customErr;
    }
}
