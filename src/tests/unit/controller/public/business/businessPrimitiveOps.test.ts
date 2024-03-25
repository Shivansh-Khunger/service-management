// Import Types
import type { NextFunction, Request, Response } from "express";

// Import function(s) to be tested
import { delBusiness, newBusiness } from "@controllers/public/business";

// Import necessary modules
import { logger } from "@logger";
import business from "@models/business";
import augmentAndForwardError from "@utils/errorAugmenter";
import ResponsePayload from "@utils/resGenerator";
import { ObjectId } from "mongodb";
import { generateNameforPrimitive } from "../../testNameGenerator";

// Define mock data for a new business
const mockNewBusinessData = {
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

// Mock the business model's create and findByIdAndDelete functions
jest.mock("@models/business", () => ({
    create: jest.fn(),
    findByIdAndDelete: jest.fn(),
}));

// Mock the error augmenter function
jest.mock("@utils/errorAugmenter", () => ({
    __esModule: true,
    default: jest.fn(),
}));

// Define the collection name and generate test names
const collectionName = "Business";
const testNames = generateNameforPrimitive(collectionName);
const funcName = "businessPrimitiveOps";

// Start of test suite for business primitive operations
describe(`controller -> ${funcName} tests`, () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    const mockNextFunction: NextFunction = jest.fn();

    let resPayload: ResponsePayload;
    let resMessage: string;

    // Set up the mock request and response before each test
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

    // Clear all mocks after each test
    afterEach(() => {
        jest.clearAllMocks();

        jest.mock("@models/business", () => ({
            create: jest.fn(),
            findByIdAndDelete: jest.fn(),
        }));

        jest.mock("@utils/errorAugmenter", () => ({
            __esModule: true,
            default: jest.fn(),
        }));
    });

    // Define the function name for this test suite
    const funcName_1 = "newBusiness";

    // Start of test suite for newBusiness function
    describe(`${funcName} -> ${funcName_1} tests`, () => {
        // Mock the business.create function
        const mockB_Create = business.create as jest.Mock;

        // Set up the mock request before each test
        beforeEach(() => {
            mockRequest = {
                body: {
                    businessData: {
                        ...mockNewBusinessData,
                    },
                },
            };
        });

        // Test case: Check if the function sends appropriate response when new business creation is successful
        test(testNames.newDoc.success, async () => {
            // Mock the business.create function to return mockNewBusinessData
            mockB_Create.mockResolvedValue(mockNewBusinessData);

            // Call the newBusiness function
            await newBusiness(
                mockRequest as Request,
                mockResponse as Response,
                mockNextFunction,
            );

            resMessage = `Request to create ${collectionName}-: ${mockNewBusinessData.name} is successfull.`;
            resPayload.setSuccess(resMessage, mockNewBusinessData);

            // Check if the response status is 201 and the response body is as expected
            expect(mockResponse.status).toBe(201);
            expect(mockResponse.json).toStrictEqual(resPayload);
            // Check if the augmentAndForwardError function was not called
            expect(augmentAndForwardError).not.toHaveBeenCalled();
        });

        // Test case: Check if the function sends appropriate response when new business creation is unsuccessful
        test(testNames.newDoc.unsuccess, async () => {
            // Mock the business.create function to return null
            mockB_Create.mockResolvedValue(null);

            // Call the newBusiness function
            await newBusiness(
                mockRequest as Request,
                mockResponse as Response,
                mockNextFunction,
            );

            resMessage = `Request to create ${collectionName}-: ${mockNewBusinessData.name} is unsuccessfull.`;
            resPayload.setConflict(resMessage);

            // Check if the response status is 409 and the response body is as expected
            expect(mockResponse.status).toBe(409);
            expect(mockResponse.json).toStrictEqual(resPayload);

            // Check if the augmentAndForwardError function was not called
            expect(augmentAndForwardError).not.toHaveBeenCalled();
        });

        // Test case: Check if the function calls errorAugmenter when an error occurs
        test(testNames.error, async () => {
            // Mock the business.create function to throw an error
            mockB_Create.mockImplementation(() => {
                throw new Error("new error");
            });

            // Call the newBusiness function
            await newBusiness(
                mockRequest as Request,
                mockResponse as Response,
                mockNextFunction,
            );

            // Check if the augmentAndForwardError function was called
            expect(augmentAndForwardError).toHaveBeenCalled();
        });
    });

    // Define the function name for this test suite
    const funcName_2 = "delBusiness";

    // Start of test suite for delBusiness function
    describe(`${funcName} -> ${funcName_2} tests`, () => {
        // Generate a mock business ID
        const mockBusinessId = new ObjectId().toString();

        // Set up the mock request before each test
        beforeEach(() => {
            mockRequest = {
                params: {
                    businessId: mockBusinessId,
                },
            };
        });

        // Mock the business.findByIdAndDelete function
        const mockB_FindByIdAndDelete = business.findByIdAndDelete as jest.Mock;

        // Test case: Check if the function sends appropriate response when business deletion is successful
        test(testNames.delDoc.success, async () => {
            // Mock the business data to be returned when a business is deleted
            const mockRecievedBusinessData = {
                ...mockNewBusinessData,
                _id: mockBusinessId,
            };
            // Mock the business.findByIdAndDelete function to return the mock business data
            mockB_FindByIdAndDelete.mockResolvedValue(mockRecievedBusinessData);

            // Call the delBusiness function
            await delBusiness(
                mockRequest as Request,
                mockResponse as Response,
                mockNextFunction,
            );

            resMessage = `Request to delete ${collectionName}-: ${mockBusinessId} is successfull.`;
            resPayload.setSuccess(resMessage);

            // Check if the response status is 200 and the response body is as expected
            expect(mockResponse.status).toBe(200);
            expect(mockResponse.json).toStrictEqual(resPayload);

            // Check if the augmentAndForwardError function was not called
            expect(augmentAndForwardError).not.toHaveBeenCalled();
        });

        // Test case: Check if the function sends appropriate response when business deletion is unsuccessful
        test(testNames.delDoc.unsuccess, async () => {
            // Mock the business.findByIdAndDelete function to return null
            mockB_FindByIdAndDelete.mockResolvedValue(null);

            // Call the delBusiness function
            await delBusiness(
                mockRequest as Request,
                mockResponse as Response,
                mockNextFunction,
            );

            resMessage = `Request to delete ${collectionName}-: ${mockBusinessId} is unsuccessfull.`;
            resPayload.setConflict(resMessage);

            // Check if the response status is 409 and the response body is as expected
            expect(mockResponse.status).toBe(409);
            expect(mockResponse.json).toStrictEqual(resPayload);

            // Check if the augmentAndForwardError function was not called
            expect(augmentAndForwardError).not.toHaveBeenCalled();
        });

        // Test case: Check if the function calls errorAugmenter when an error occurs
        test(testNames.error, async () => {
            // Mock the business.findByIdAndDelete function to throw an error
            mockB_FindByIdAndDelete.mockImplementation(() => {
                throw new Error("new error");
            });

            // Call the delBusiness function
            await delBusiness(
                mockRequest as Request,
                mockResponse as Response,
                mockNextFunction,
            );

            // Check if the augmentAndForwardError function was called
            expect(augmentAndForwardError).toHaveBeenCalled();
        });
    });
});
