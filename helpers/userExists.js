// Import the user model
import user from "../models/user";

// Function to check if a user exists by email or phone number
export async function ifUserExistsByEmail(userEmail, userPhoneNumber) {
    // Query the user collection for a user with the provided email or phone number
    const user = await user.findOne(
        {
            $or: [
                {
                    email: userEmail,
                },
                {
                    phoneNumber: userPhoneNumber,
                },
            ],
        },
        { _id: true },
    );

    // If a user was found, return true
    if (user) {
        return true;
    }

    // If no user was found, return false
    return false;
}

// Function to check if a user exists by ID
export async function ifUserExistsById(userId) {
    // Query the user collection for a user with the provided ID
    const user = await user.findById(
        {
            userId,
        },
        { _id: true },
    );

    // If a user was found, return true
    if (user) {
        return true;
    }

    // If no user was found, return false
    return false;
}

// Function to get a user's IMEI by ID
export async function getUserImei(userId) {
    // Query the user collection for a user with the provided ID
    const user = await user.findById(
        {
            userId,
        },
        { _id: true, imeiNumber: true },
    );

    // If a user was found, return the user
    if (user) {
        return user;
    }

    // If no user was found, return null
    return null;
}