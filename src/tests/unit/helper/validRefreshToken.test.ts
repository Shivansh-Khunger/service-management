// Import function to be tested
import isRefreshTokenValid from "@helpers/validRefreshToken";

// Import necessary modules
import CustomError from "@utils/customError";
import jwt from "jsonwebtoken";

// Mock the 'jsonwebtoken' module
jest.mock("jsonwebtoken", () => ({
    verify: jest.fn(),
}));

// Define the function name for logging purposes
const funcName = "isRefreshTokenValid";

// Start a test suite for the helper function isRefreshTokenValid
describe(`helper -> ${funcName} tests`, () => {
    // Define a mock token for the tests
    const mockToken = "mockToken";

    // Create a mock for the 'verify' function of 'jsonwebtoken'
    const mockVerify = jwt.verify as jest.Mock;

    // After each test, clear all mocks
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test if the function returns the decoded token when the token is valid
    test("if Returns decoded token when token is valid", () => {
        // Define a mock return value for the 'verify' function
        const mockReturnValue = {
            sub: "userId",
        };
        mockVerify.mockReturnValue(mockReturnValue);

        // Call the function with the mock token
        const mockDecoded = isRefreshTokenValid(mockToken);

        // Check if the function returned the correct value and did not throw an error
        expect(mockDecoded).toBe(mockReturnValue);
        expect(isRefreshTokenValid).not.toThrow();
    });

    // Define a variable to hold the expected error
    let expectedError: CustomError;

    // Test if the function throws the appropriate error when the token is expired
    test("if Throws appropriate error when token is expired", () => {
        // Make the 'verify' function throw a 'TokenExpiredError'
        mockVerify.mockImplementation(() => {
            const err = new Error();
            err.name = "TokenExpiredError";
            throw err;
        });

        // Define the expected error
        expectedError = new CustomError(
            "Request could not be authenticated due to expired refresh token.",
        );
        expectedError.status = 403;
        expectedError.logMessage = "an expired access token has been received.";

        // Check if the function throws the expected error
        expect(() => {
            isRefreshTokenValid(mockToken);
        }).toThrow(expectedError);
    });

    // Test if the function throws the appropriate error when the token is invalid
    test("if Throws appropriate error when token is invalid", () => {
        // Make the 'verify' function throw a 'JsonWebTokenError'
        mockVerify.mockImplementation(() => {
            const err = new Error();
            err.name = "JsonWebTokenError";
            throw err;
        });

        // Define the expected error
        expectedError = new CustomError(
            "Request could not be authenticated due to invalid refresh token.",
        );
        expectedError.status = 401;
        expectedError.logMessage = "an invalid access token has been received.";

        // Check if the function throws the expected error
        expect(() => {
            isRefreshTokenValid(mockToken);
        }).toThrow(expectedError);
    });
});
