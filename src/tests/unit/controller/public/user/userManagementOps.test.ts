// Import Types
import type { NextFunction, Request, Response } from "express";

// Import function(s) to be tested
import { updateUser } from "@controllers/public/user";

// Import necessary modules
import { logger } from "@logger";
import user from "@models/user";
import augmentAndForwardError from "@utils/errorAugmenter";
import ResponsePayload from "@utils/resGenerator";
import { ObjectId } from "mongodb";
import { generateNameforManagement } from "../../testNameGenerator";

// Mock the 'findByIdAndUpdate' function from the 'user' model
jest.mock("@models/user", () => ({
    findByIdAndUpdate: jest.fn(),
}));

// Mock the 'errorAugmenter' utility function
jest.mock("@utils/errorAugmenter", () => ({
    __esModule: true, // This property is necessary when mocking ES6 modules
    default: jest.fn(),
}));

// Define a mock user data object
const mockUserData = {
    name: "Rahul",
    email: "rahul@gmail.com",
    phoneNumber: "2589631470",
};

// Define the name of the collection being tested
const collectionName = "User";

// Generate test names for the user management operations
const testNames = generateNameforManagement(collectionName);

// Define the name of the function being tested
const funcName = "userManagementOps";

// Begin a test suite for the user management operations
describe(`controller -> ${funcName} tests`, () => {
    // Define mock request and response objects
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;

    // Define a mock next function for Express middleware
    const mockNextFunction: NextFunction = jest.fn();

    // Define a response payload and message
    let resPayload: ResponsePayload;
    let resMessage: string;

    // Before each test, set up the mock request and response and reset the response payload and message
    beforeEach(() => {
        mockRequest = {};
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
        resPayload = new ResponsePayload();
        resMessage = "";
    });

    // After each test, clear all mocks and reset the user model and error augmenter mocks
    afterEach(() => {
        jest.clearAllMocks();

        jest.mock("@models/user", () => ({
            findByIdAndUpdate: jest.fn(),
        }));

        jest.mock("@utils/errorAugmenter", () => ({
            __esModule: true,
            default: jest.fn(),
        }));
    });

    // Define the name of the function being tested
    const funcName_1 = "updateUser";

    // Begin a test suite for the updateUser function
    describe(`${funcName} -> ${funcName_1}`, () => {
        // Mock the 'findByIdAndUpdate' function from the 'user' model
        const mockU_findByIdAndUpdate = user.findByIdAndUpdate as jest.Mock;

        // Define a mock user ID
        const mockUserId = new ObjectId().toString();

        // Define a mock user data object
        const mockLatestUser = {
            ...mockUserData,
            name: "Business My",
            _id: mockUserId,
        };

        // Before each test, set up the mock request object
        beforeEach(() => {
            mockRequest = {
                body: {
                    latestUser: mockLatestUser,
                },
                params: {
                    userId: mockUserId,
                },
            };
        });

        // Test that the updateUser function successfully updates a user
        test(testNames.updateDoc.success, async () => {
            // Mock the 'findByIdAndUpdate' function to return the mock user data
            mockU_findByIdAndUpdate.mockResolvedValue(mockLatestUser);

            // Call the updateUser function with the mock request and response
            await updateUser(
                mockRequest as Request,
                mockResponse as Response,
                mockNextFunction,
            );

            // Set the expected response message and payload
            resMessage = `Request to update ${collectionName}-: ${mockUserId} is successfull.`;
            resPayload.setSuccess(resMessage, mockLatestUser);

            // Check that the response status and body are as expected
            expect(mockResponse.status).toBe(200);
            expect(mockResponse.json).toStrictEqual(resPayload);
            // Check that the error handling function was not called
            expect(augmentAndForwardError).not.toHaveBeenCalled();
        });

        // Test that the updateUser function handles an unsuccessful user update
        test(testNames.updateDoc.unsuccess, async () => {
            // Mock the 'findByIdAndUpdate' function to return null
            mockU_findByIdAndUpdate.mockResolvedValue(null);

            // Call the updateUser function with the mock request and response
            await updateUser(
                mockRequest as Request,
                mockResponse as Response,
                mockNextFunction,
            );

            // Set the expected response message and payload
            resMessage = `Request to update ${collectionName}-: ${mockUserId} is unsuccessfull.`;
            resPayload.setConflict(resMessage);

            // Check that the response status and body are as expected
            expect(mockResponse.status).toBe(409);
            expect(mockResponse.json).toStrictEqual(resPayload);
            // Check that the error handling function was not called
            expect(augmentAndForwardError).not.toHaveBeenCalled();
        });

        // Test that the updateUser function handles an error
        test(testNames.error, async () => {
            // Mock the 'findByIdAndUpdate' function to throw an error
            mockU_findByIdAndUpdate.mockImplementation(() => {
                throw new Error("new error");
            });

            // Call the updateUser function with the mock request and response
            await updateUser(
                mockRequest as Request,
                mockResponse as Response,
                mockNextFunction,
            );

            // Check that the error handling function was called
            expect(augmentAndForwardError).toHaveBeenCalled();
        });
    });
});
