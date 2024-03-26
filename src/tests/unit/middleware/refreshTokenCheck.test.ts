// Import types
import type { NextFunction, Request, Response } from "express";

// Import function to be tested
import checkForRefreshToken from "@middlewares/refreshTokenCheck";

// Import necessary modules
import isRefreshTokenValid from "@helpers/validRefreshToken";
import CustomError from "@utils/customError";
import augmentAndForwardError from "@utils/errorAugmenter";

// Mock the 'validRefreshToken' helper function
jest.mock("@helpers/validRefreshToken", () => ({
    __esModule: true, // Needed when mocking ES6 modules
    default: jest.fn(),
}));

// Mock the 'errorAugmenter' utility function
jest.mock("@utils/errorAugmenter", () => ({
    __esModule: true, // Needed when mocking ES6 modules
    default: jest.fn(),
}));

// Define the function name for logging purposes
const funcName = "checkForRefreshToken";

// Start a test suite for the middleware function checkForRefreshToken
describe(`middleware -> ${funcName} tests`, () => {
    // Declare variables to hold the mock request, response, and next function
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    const mockNextFunction: NextFunction = jest.fn();

    // Define a mock decoded JWT
    const mockJWTDecode = {
        sub: "userId",
    };

    // Create a mock for the 'isRefreshTokenValid' function
    const mockisRefreshTokenValid = isRefreshTokenValid as jest.Mock;

    // Before each test, initialize the mock request and response
    beforeEach(() => {
        mockRequest = {
            signedCookies: {
                refreshToken: "mockRefreshToken",
            },
        };
        mockResponse = {
            json: jest.fn(),
        };
    });

    // Test if the function calls the next function when the refresh token is valid
    test("if Calls nextFunction when refresh token is valid", () => {
        // Make the 'isRefreshTokenValid' function return the mock decoded JWT
        mockisRefreshTokenValid.mockReturnValue(mockJWTDecode);

        // Call the function with the mock request, response, and next function
        checkForRefreshToken(
            mockRequest as Request,
            mockResponse as Response,
            mockNextFunction,
        );

        // Check if the function called the next function and did not call 'augmentAndForwardError'
        expect(mockNextFunction).toHaveBeenCalled();
        expect(augmentAndForwardError).not.toHaveBeenCalled();
    });

    // Test if the function calls 'augmentAndForwardError' when the refresh token is not present
    test("if Calls augmentAndForwardError when refresh token is not present", () => {
        // Remove the refresh token from the mock request
        mockRequest.signedCookies = {
            refreshToken: undefined,
        };

        // Define a mock error
        const mockErr = new CustomError("Request could not be authenticated.");
        mockErr.status = 401;

        // Call the function with the mock request, response, and next function
        checkForRefreshToken(
            mockRequest as Request,
            mockResponse as Response,
            mockNextFunction,
        );

        // Check if the function called 'augmentAndForwardError' with the expected parameters
        expect(augmentAndForwardError).toHaveBeenCalledWith({
            next: mockNextFunction,
            err: mockErr,
            funcName: funcName,
        });
    });

    // Test if the function calls 'augmentAndForwardError' when 'isRefreshTokenValid' throws an error
    test("if Calls augmentAndForwardError when isRefreshTokenValid throws", () => {
        // Define a mock error
        const mockErr = new CustomError(
            "Request could not be authenticated due to expired refresh token.",
        );
        mockErr.status = 403;

        // Make the 'isRefreshTokenValid' function throw the mock error
        mockisRefreshTokenValid.mockImplementation(() => {
            throw mockErr;
        });

        // Call the function with the mock request, response, and next function
        checkForRefreshToken(
            mockRequest as Request,
            mockResponse as Response,
            mockNextFunction,
        );

        // Check if the function called 'augmentAndForwardError' with the expected parameters
        expect(augmentAndForwardError).toHaveBeenCalledWith({
            next: mockNextFunction,
            err: mockErr,
            funcName: funcName,
        });
    });
});
