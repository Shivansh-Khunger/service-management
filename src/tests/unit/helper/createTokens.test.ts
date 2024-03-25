// import necessary modules
import createToken from "@helpers/createTokens";
import type { JWT } from "@helpers/createTokens";
import jwt from "jsonwebtoken";

// Define the function name for logging purposes
const funcName = "createToken";

// Start a test suite for the helper function createToken
describe(`helper -> ${funcName} tests`, () => {
    // Declare a variable to hold the mock JWT payload
    let mockPayload: JWT;

    // Before each test, set the environment variables for the JWT secret keys
    beforeEach(() => {
        process.env.JWT_ACCESS_SECRET_KEY = "SECRET_ACCESS";
        process.env.JWT_REFRESH_SECRET_KEY = "SECRET_REFRESH";
    });

    // Test if the createToken function correctly creates an access token
    test("if Appropriately makes an access token", () => {
        // Define a mock payload for the test
        mockPayload = {
            sub: "userId",
        };

        // Call the createToken function with the mock payload and false for the refresh parameter
        const token = createToken(mockPayload, false);

        // Check if the token is not falsy
        expect(token).not.toBeFalsy();

        // Decode the token
        const decode = jwt.verify(token, process.env.JWT_ACCESS_SECRET_KEY);

        // Check if the decoded token contains the correct subject
        expect(decode.sub).toBe("userId");
    });

    // Test if the createToken function correctly creates a refresh token
    test("if Appropriately makes a refresh token", () => {
        // Define a mock payload for the test
        mockPayload = {
            sub: "userId",
        };

        // Call the createToken function with the mock payload and true for the refresh parameter
        const token = createToken(mockPayload, true);

        // Check if the token is not falsy
        expect(token).not.toBeFalsy();

        // Decode the token
        const decode = jwt.verify(token, process.env.JWT_REFRESH_SECRET_KEY);

        // Check if the decoded token contains the correct subject
        expect(decode.sub).toBe("userId");
    });
});
