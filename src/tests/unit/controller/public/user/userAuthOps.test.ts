// Import Types
import type { NextFunction, Request, Response } from "express";

// Import function(s) to be tested
import { loginUser } from "@controllers/public/user";

// Import necessary modules
import { insertJWT } from "@helpers/createCookie";
import { logger } from "@logger";
import User from "@models/user";
import CustomError from "@utils/customError";
import augmentAndForwardError from "@utils/errorAugmenter";
import ResponsePayload from "@utils/resGenerator";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import { generateNameforPrimitive } from "../../testNameGenerator";

// Mock the createCookie helper function
jest.mock("@helpers/createCookie", () => ({
    insertJWT: jest.fn(), // Mock the insertJWT function
}));

// Mock the createTokens helper function to return a mock token
jest.mock("@helpers/createTokens", () => ({
    __esModule: true, // Enable mocking of default export
    default: jest.fn().mockReturnValue("mockToken"), // Mock the default export to return a mock token
}));

// Mock the User model's findOne and aggregate functions
jest.mock("@models/user", () => ({
    findOne: jest.fn(), // Mock the findOne function
    aggregate: jest.fn(), // Mock the aggregate function
}));

// Mock the errorAugmenter utility function
jest.mock("@utils/errorAugmenter", () => ({
    __esModule: true, // Enable mocking of default export
    default: jest.fn(), // Mock the default export
}));

// Mock the compare function of bcrypt
jest.mock("bcrypt", () => ({
    compare: jest.fn(), // Mock the compare function
}));

// Define mock user credentials
const mockUserCredentials = {
    email: "rahul@example.com",
    phoneNumber: "2234567890",
    password: "blabla",
};

// Define the name of the collection and the function being tested
const collectionName = "User";
const funcName = "loginUser";

// Generate names for the tests
const testNames = generateNameforPrimitive(collectionName);

// Begin a test suite for the loginUser function
describe(`controller -> ${funcName} tests`, () => {
    // Define mock request, response, and next function
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    const mockNextFunction: NextFunction = jest.fn();

    // Define mock response payload and message
    let mockResPayload: ResponsePayload;
    let mockResMessage: string;

    // Define a mock error
    const mockErr = new CustomError();

    // Before each test, set up the mock request and response objects and the response payload and message
    beforeEach(() => {
        mockRequest = {
            body: {
                userCredentials: mockUserCredentials,
            },
        };
        mockResponse = {
            status: jest.fn().mockImplementation((statusCode) => {
                mockResponse.status = statusCode;
                return mockResponse;
            }),
            json: jest.fn().mockImplementation((resPayload) => {
                mockResponse.json = resPayload;
                return mockResponse;
            }),
            log: logger,
        };
        mockResPayload = new ResponsePayload();
        mockResMessage = "";
    });

    // After each test, clear all mocks
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Define mock functions for findOne, compare, and aggregate
    const mockU_FindOne = User.findOne as jest.Mock;
    const mockJ_Compare = bcrypt.compare as jest.Mock;
    const mockU_Aggregate = User.aggregate as jest.Mock;

    // Define a mock user
    const mockUser = [
        {
            ...mockUserCredentials,
            bussinesses: {
                products: [],
            },
        },
    ];

    // Test case: User is successfully authenticated
    test(`if Sends appropriate response when ${collectionName} is authenticated`, async () => {
        // Set up the request body with user credentials
        mockRequest = {
            body: {
                userCredentials: mockUserCredentials,
            },
        };

        // Mock the findOne function to return a user with a hashed password
        mockU_FindOne.mockResolvedValue({
            _id: new ObjectId(),
            password: "hashedPassword",
        });

        // Mock the compare function to return true, indicating a password match
        mockJ_Compare.mockResolvedValue(true);

        // Mock the aggregate function to return the mock user
        mockU_Aggregate.mockResolvedValue(mockUser);

        // Call the loginUser function with the mock request and response
        await loginUser(
            mockRequest as Request,
            mockResponse as Response,
            mockNextFunction,
        );

        // Set up the expected response message and payload
        mockResMessage = `Request to log in ${collectionName}-: ${
            mockUserCredentials?.email
                ? mockUserCredentials?.email
                : mockUserCredentials?.phoneNumber
        } is successfull`;
        mockResPayload.setSuccess(mockResMessage, mockUser);

        // Check that the response status is 200, the response payload matches the expected payload, the insertJWT function was called twice, and the augmentAndForwardError function was not called
        expect(mockResponse.status).toBe(200);
        expect(mockResponse.json).toStrictEqual(mockResPayload);
        expect(insertJWT).toHaveBeenCalledTimes(2);
        expect(augmentAndForwardError).not.toHaveBeenCalled();
    });

    // Test case: User is not authenticated due to wrong password
    test(`if Sends appropriate response when ${collectionName} is not authenticated`, async () => {
        // Mock the findOne function to return a user with a hashed password
        mockU_FindOne.mockResolvedValue({
            _id: new ObjectId(),
            password: "hashedPassword",
        });

        // Mock the compare function to return false, indicating a password mismatch
        mockJ_Compare.mockResolvedValue(false);

        // Call the loginUser function with the mock request and response
        await loginUser(
            mockRequest as Request,
            mockResponse as Response,
            mockNextFunction,
        );

        // Set up the expected response message and payload
        mockResMessage = `Request to log in user-: ${
            mockUserCredentials?.email
                ? mockUserCredentials?.email
                : mockUserCredentials?.phoneNumber
        } is unsuccessfull due to wrong password`;
        mockResPayload.setError(mockResMessage);

        // Check that the response status is 401, the response payload matches the expected payload, the insertJWT function was not called, and the augmentAndForwardError function was not called
        expect(mockResponse.status).toBe(401);
        expect(mockResponse.json).toStrictEqual(mockResPayload);
        expect(insertJWT).not.toHaveBeenCalled();
        expect(augmentAndForwardError).not.toHaveBeenCalled();
    });

    // Test case: User is non-existent
    test(`if Sends appropriate response when ${collectionName} is non-existent`, async () => {
        // Mock the findOne function to return null, indicating no user found
        mockU_FindOne.mockResolvedValue(null);

        // Call the loginUser function with the mock request and response
        await loginUser(
            mockRequest as Request,
            mockResponse as Response,
            mockNextFunction,
        );

        // Set up the expected response message and payload
        mockResMessage =
            "Request to log in user is unsuccessfull due to user being non-existent";
        mockResPayload.setError(mockResMessage);

        // Check that the response status is 404, the response payload matches the expected payload, the insertJWT function was not called, and the augmentAndForwardError function was not called
        expect(mockResponse.status).toBe(404);
        expect(mockResponse.json).toStrictEqual(mockResPayload);
        expect(insertJWT).not.toHaveBeenCalled();
        expect(augmentAndForwardError).not.toHaveBeenCalled();
    });

    // Test case: Error occurs during login
    test(testNames.error, async () => {
        // Mock the findOne function to throw an error
        mockU_FindOne.mockImplementation(() => {
            throw mockErr;
        });

        // Call the loginUser function with the mock request and response
        await loginUser(
            mockRequest as Request,
            mockResponse as Response,
            mockNextFunction,
        );

        // Set up the expected response message and payload
        mockResMessage =
            "Request to log in user is unsuccessfull due to user being non-existent";
        mockResPayload.setError(mockResMessage);

        // Check that the insertJWT function was not called and the augmentAndForwardError function was called with the correct arguments
        expect(insertJWT).not.toHaveBeenCalled();
        expect(augmentAndForwardError).toHaveBeenCalledWith({
            next: mockNextFunction,
            err: mockErr,
            funcName: funcName,
        });
    });
});
