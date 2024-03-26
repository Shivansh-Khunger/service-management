// Importing the jsonwebtoken library
import jwt from "jsonwebtoken";

// Defining the JWT type
export type JWT = {
    sub: string; // Subject of the token (usually the user ID)
    iat?: Date; // Issued at - Date when the token was created
    exp?: Date; // Expiry date of the token
};

// Defining the expiry times for the access and refresh tokens
const ACCESS_TOKEN_EXPIRY = "1h";
const REFRESH_TOKEN_EXPIRY = "7 Days";

// Function to create a JWT token
function createToken(payload: JWT, wantRefresh: boolean) {
    let token: string;
    // If the requested token is a refresh token
    if (wantRefresh) {
        // Sign the token with the refresh secret key and set its expiry time
        token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET_KEY, {
            expiresIn: REFRESH_TOKEN_EXPIRY,
        });
    } else {
        // If the requested token is an access token
        // Sign the token with the access secret key and set its expiry time
        token = jwt.sign(payload, process.env.JWT_ACCESS_SECRET_KEY, {
            expiresIn: ACCESS_TOKEN_EXPIRY,
        });
    }

    // Return the signed token
    return token;
}

// Export the createToken function as the default export
export default createToken;