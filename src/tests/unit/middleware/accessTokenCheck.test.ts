// Import types
import type { NextFunction, Request, Response } from "express";

// Import function to be tested
import checkForAccessToken from "@middlewares/accessTokenCheck";

// Import necessary modules
import { insertJWT } from "@helpers/createCookie";
import createToken from "@helpers/createTokens";
import isRefreshTokenValid from "@helpers/validRefreshToken";
import CustomError from "@utils/customError";
import augmentAndForwardError from "@utils/errorAugmenter";
import jwt from "jsonwebtoken";

// Mock the 'jsonwebtoken' module
jest.mock("jsonwebtoken", () => ({
    verify: jest.fn(),
}));

// Mock the 'createTokens' helper function
jest.mock("@helpers/createTokens", () => ({
    __esModule: true, // Needed when mocking ES6 modules
    default: jest.fn(),
}));

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

// Mock the 'createCookie' helper function
jest.mock("@helpers/createCookie", () => ({
    insertJWT: jest.fn(),
}));

// Define the function name for logging purposes
const funcName = "checkForAccessToken";

// Start a test suite for the middleware function checkForAccessToken
describe(`middleware -> ${funcName} tests`, () => {
    // Declare variables to hold the mock request, response, and next function
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    const mockNextFunction: NextFunction = jest.fn();

    // Create a mock for the 'verify' function of 'jsonwebtoken'
    const mockVerify = jwt.verify as jest.Mock;

    // Define a mock decoded JWT
    const mockJWTDecode = {
        sub: "userId",
    };

    // Before each test, initialize the mock request and response
    beforeEach(() => {
        mockRequest = {
            signedCookies: {
                accessToken: "mockAccessToken",
                refreshToken: "mockRefreshToken",
            },
            userCredentials: {
                userId: "",
            },
        };
        mockResponse = {
            json: jest.fn(),
        };
    });

    // After each test, clear all mocks
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test if the function calls the next function when the access token is valid
    test("if Calls nextFunction when access token is valid ", () => {
        // Make the 'verify' function return the mock decoded JWT
        mockVerify.mockReturnValue(mockJWTDecode);

        // Call the function with the mock request, response, and next function
        checkForAccessToken(
            mockRequest as Request,
            mockResponse as Response,
            mockNextFunction,
        );

        // Check if the function updated the user credentials and called the next function
        expect(mockRequest.userCredentials?.userId).toBe("userId");
        expect(mockNextFunction).toHaveBeenCalled();
    });

    // Start a test suite for the case when the access token is not present
    describe("if Access token is not present", () => {
        // Before each test, ensure that the access token is not present
        beforeEach(() => {
            if (mockRequest.signedCookies?.accessToken) {
                mockRequest.signedCookies.accessToken = undefined;
            }
        });

        // Create mocks for the 'isRefreshTokenValid' and 'createToken' functions
        const mockIsRefreshTokenValid = isRefreshTokenValid as jest.Mock;
        const mockCreateToken = createToken as jest.Mock;

        // Test if the function calls the next function when the refresh token is valid
        test("if Calls nextFunction when refresh token is valid", () => {
            // Make the 'isRefreshTokenValid' function return a mock decoded JWT
            mockIsRefreshTokenValid.mockReturnValue(mockJWTDecode);
            // Make the 'createToken' function return a mock JWT
            mockCreateToken.mockReturnValue("mockJWT");

            // Call the function with the mock request, response, and next function
            checkForAccessToken(
                mockRequest as Request,
                mockResponse as Response,
                mockNextFunction,
            );

            // Define the expected max age for the user access cookie
            const userAccessCookieMaxAge = 1000 * 60 * 60;

            // Check if the function called 'insertJWT' with the expected parameters
            expect(insertJWT).toHaveBeenCalledWith({
                res: mockResponse as Response,
                field: "accessToken",
                fieldValue: "mockJWT",
                maxAge: userAccessCookieMaxAge,
            });

            // Check if the function called the next function
            expect(mockNextFunction).toHaveBeenCalled();
        });

        // Test if the function calls 'augmentAndForwardError' when the refresh token is expired or invalid
        test("if Calls augmentAndForwardError when refresh token is expired or invalid", () => {
            // Define a mock error
            const mockErr = new CustomError("mock Error");

            // Make the 'isRefreshTokenValid' function throw the mock error
            mockIsRefreshTokenValid.mockImplementation(() => {
                throw mockErr;
            });

            // Call the function with the mock request, response, and next function
            checkForAccessToken(
                mockRequest as Request,
                mockResponse as Response,
                mockNextFunction,
            );

            // Check if the function did not call 'insertJWT' or the next function
            expect(insertJWT).not.toHaveBeenCalled();
            expect(mockNextFunction).not.toHaveBeenCalled();

            // Check if the function called 'augmentAndForwardError' with the expected parameters
            expect(augmentAndForwardError).toHaveBeenCalledWith({
                next: mockNextFunction,
                err: mockErr,
                funcName: funcName,
            });
        });
    });

    // Start a test suite for the case when an error is thrown while verifying the access token
    describe("if Throws error when verifying access token", () => {
        // Declare variables to hold the custom error and the thrown error
        let mockErr: CustomError;
        let mockThrownError: Error;

        // Before each test, initialize the custom error and the thrown error
        beforeEach(() => {
            mockErr = new CustomError();
            mockThrownError = new Error();
        });

        // Test if the function throws the appropriate error when the token is expired
        test("if Throws appropriate error when token is expired", () => {
            // Make the 'verify' function throw a 'TokenExpiredError'
            mockVerify.mockImplementation(() => {
                mockThrownError.name = "TokenExpiredError";
                throw mockThrownError;
            });

            // Define the expected error
            mockErr.message =
                "Request could not be authenticated due to expired access token.";
            mockErr.status = 401;
            mockErr.logMessage = "an expired access token has been received.";

            // Call the function with the mock request, response, and next function
            checkForAccessToken(
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

        // Test if the function throws the appropriate error when the token is invalid
        test("if Throws appropriate error when token is invalid", () => {
            // Make the 'verify' function throw a 'JsonWebTokenError'
            mockVerify.mockImplementation(() => {
                mockThrownError.name = "JsonWebTokenError";
                throw mockThrownError;
            });

            // Define the expected error
            mockErr.message =
                "Request could not be authenticated due to invalid access token.";
            mockErr.status = 401;
            mockErr.logMessage = "an invalid access token has been received.";

            // Call the function with the mock request, response, and next function
            checkForAccessToken(
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
});
