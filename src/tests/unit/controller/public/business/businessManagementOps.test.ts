// Import Types
import type { NextFunction, Request, Response } from "express";

// Import function(s) to be tested
import { updateBusiness } from "@controllers/public/business";

// Import necessary modules
import { logger } from "@logger";
import business from "@models/business";
import augmentAndForwardError from "@utils/errorAugmenter";
import ResponsePayload from "@utils/resGenerator";
import { ObjectId } from "mongodb";
import { generateNameforManagement } from "../../testNameGenerator";

// Mock the 'findByIdAndUpdate' function from the 'business' model
jest.mock("@models/business", () => ({
    findByIdAndUpdate: jest.fn(),
}));

// Mock the 'errorAugmenter' utility function
jest.mock("@utils/errorAugmenter", () => ({
    __esModule: true, // This is necessary when mocking ES6 modules
    default: jest.fn(),
}));

// Define a mock business data object
const mockBusinessData = {
    name: "My Business",
    owner: "65e1e153ebae16a07816bc4f",
    openingTime: 1617254400,
    closingTime: 1617297600,
    phoneNumber: "1234567890",
    landline: "0987654321",
    email: "business@example.com",
    website: "https://www.example.com",
    imageUrls: [
        "https://www.example.com/image1.jpg",
        "https://www.example.com/image2.jpg",
    ],
    geoLocation: [40.712776, -74.005974],
    upiId: "business@upi",
    managerPhoneNumber: "1122334455",
    managerEmail: "manager@example.com",
};

// Define the name of the collection being tested
const collectionName = "Business";

// Generate test names for the business management operations
const testNames = generateNameforManagement(collectionName);

// Define the name of the function being tested
const funcName = "businessManagementOps";

// Begin a test suite for the business management operations
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

    // After each test, clear all mocks and reset the business model and error augmenter mocks
    afterEach(() => {
        jest.clearAllMocks();

        jest.mock("@models/business", () => ({
            findByIdAndUpdate: jest.fn(),
        }));

        jest.mock("@utils/errorAugmenter", () => ({
            __esModule: true,
            default: jest.fn(),
        }));
    });

    // Define the name of the function being tested
    const funcName_1 = "updateBusiness";

    // Begin a test suite for the updateBusiness function
    describe(`${funcName} -> ${funcName_1}`, () => {
        // Mock the findByIdAndUpdate function from the business model
        const mockB_findByIdAndUpdate = business.findByIdAndUpdate as jest.Mock;

        // Define a mock business ID
        const mockBusinessId = new ObjectId().toString();

        // Define a mock business object
        const mockLatestBusiness = {
            ...mockBusinessData,
            name: "Business My",
            _id: mockBusinessId,
        };

        // Before each test, set up the mock request object
        beforeEach(() => {
            mockRequest = {
                body: {
                    latestBusiness: mockLatestBusiness,
                },
                params: {
                    businessId: mockBusinessId,
                },
            };
        });

        // Test that the updateBusiness function successfully updates a business
        test(testNames.updateDoc.success, async () => {
            // Mock the findByIdAndUpdate function to return the mock business
            mockB_findByIdAndUpdate.mockResolvedValue(mockLatestBusiness);

            // Call the updateBusiness function with the mock request and response
            await updateBusiness(
                mockRequest as Request,
                mockResponse as Response,
                mockNextFunction,
            );

            // Set the expected response message and payload
            resMessage = `request to update ${collectionName}-: ${mockBusinessId} is successfull.`;
            resPayload.setSuccess(resMessage, mockLatestBusiness);

            // Check that the response status and body are as expected
            expect(mockResponse.status).toBe(200);
            expect(mockResponse.json).toStrictEqual(resPayload);
            // Check that the error handling function was not called
            expect(augmentAndForwardError).not.toHaveBeenCalled();
        });

        // Test that the updateBusiness function handles an unsuccessful update
        test(testNames.updateDoc.unsuccess, async () => {
            // Mock the findByIdAndUpdate function to return null
            mockB_findByIdAndUpdate.mockResolvedValue(null);

            // Call the updateBusiness function with the mock request and response
            await updateBusiness(
                mockRequest as Request,
                mockResponse as Response,
                mockNextFunction,
            );

            // Set the expected response message and payload
            resMessage = `request to update ${collectionName}-: ${mockBusinessId} is unsuccessfull.`;
            resPayload.setConflict(resMessage);

            // Check that the response status and body are as expected
            expect(mockResponse.status).toBe(409);
            expect(mockResponse.json).toStrictEqual(resPayload);
            // Check that the error handling function was not called
            expect(augmentAndForwardError).not.toHaveBeenCalled();
        });

        // Test that the updateBusiness function handles an error
        test(testNames.error, async () => {
            // Mock the findByIdAndUpdate function to throw an error
            mockB_findByIdAndUpdate.mockImplementation(() => {
                throw new Error("new error");
            });

            // Call the updateBusiness function with the mock request and response
            await updateBusiness(
                mockRequest as Request,
                mockResponse as Response,
                mockNextFunction,
            );

            // Check that the error handling function was called
            expect(augmentAndForwardError).toHaveBeenCalled();
        });
    });
});
