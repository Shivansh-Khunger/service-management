// Import Types
import type { NextFunction, Request, Response } from "express";

// Import function(s) to be tested
import {
    delSubCategory,
    newSubCategory,
} from "@controllers/private/subCategory";

// Import necessary modules
import { logger } from "@logger";
import subCategory from "@models/subCategory";
import augmentAndForwardError from "@utils/errorAugmenter";
import ResponsePayload from "@utils/resGenerator";
import { ObjectId } from "mongodb";
import { generateNameforPrimitive } from "../../testNameGenerator";

// Define a mock subcategory data object
const mockNewSubCategoryData = {
    name: "Sample SubCategory",
    image: "https://sample.com/image",
    description: "This is a sample subCategory",
    categoryId: new ObjectId(),
};

// Mock the 'create' and 'findOneAndDelete' functions from the 'subCategory' model
jest.mock("@models/subCategory", () => ({
    create: jest.fn(),
    findOneAndDelete: jest.fn(),
}));

// Mock the 'errorAugmenter' utility function
jest.mock("@utils/errorAugmenter", () => ({
    __esModule: true, // This property is necessary when mocking ES6 modules
    default: jest.fn(),
}));

// Define the name of the collection being tested
const collectionName = "SubCategory";

// Generate test names for the subcategory primitive operations
const testNames = generateNameforPrimitive(collectionName);

// Define the name of the function being tested
const funcName = "subCategoryPrimitiveOps";

// Begin a test suite for the subcategory primitive operations
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

    // After each test, clear all mocks and reset the subcategory model and error augmenter mocks
    afterEach(() => {
        jest.clearAllMocks();

        jest.mock("@models/subCategory", () => ({
            create: jest.fn(),
            findOneAndDelete: jest.fn(),
        }));

        jest.mock("@utils/errorAugmenter", () => ({
            __esModule: true,
            default: jest.fn(),
        }));
    });

    // Define the name of the function being tested
    const funcName_1 = "newSubCategory";

    // Begin a test suite for the newSubCategory function
    describe(`${funcName} -> ${funcName_1} tests`, () => {
        // Mock the 'create' function from the 'subCategory' model
        const mockSC_Create = subCategory.create as jest.Mock;

        // Before each test, set up the mock request object
        beforeEach(() => {
            mockRequest = {
                body: {
                    subCategoryData: {
                        ...mockNewSubCategoryData,
                    },
                },
            };
        });

        // Test that the newSubCategory function successfully creates a subcategory
        test(testNames.newDoc.success, async () => {
            // Mock the 'create' function to return the mock subcategory data
            mockSC_Create.mockResolvedValue(mockNewSubCategoryData);

            // Call the newSubCategory function with the mock request and response
            await newSubCategory(
                mockRequest as Request,
                mockResponse as Response,
                mockNextFunction,
            );

            // Set the expected response message and payload
            resMessage = `Request to create ${collectionName}-: ${mockNewSubCategoryData.name} is successfull.`;
            resPayload.setSuccess(resMessage, mockNewSubCategoryData);

            // Check that the response status and body are as expected
            expect(mockResponse.status).toBe(201);
            expect(mockResponse.json).toStrictEqual(resPayload);
            // Check that the error handling function was not called
            expect(augmentAndForwardError).not.toHaveBeenCalled();
        });

        // Test that the newSubCategory function handles an unsuccessful subcategory creation
        test(testNames.newDoc.unsuccess, async () => {
            // Mock the 'create' function to return null
            mockSC_Create.mockResolvedValue(null);

            // Call the newSubCategory function with the mock request and response
            await newSubCategory(
                mockRequest as Request,
                mockResponse as Response,
                mockNextFunction,
            );

            // Set the expected response message and payload
            resMessage = `Request to create ${collectionName}-: ${mockNewSubCategoryData.name} is unsuccessfull.`;
            resPayload.setConflict(resMessage);

            // Check that the response status and body are as expected
            expect(mockResponse.status).toBe(409);
            expect(mockResponse.json).toStrictEqual(resPayload);
            // Check that the error handling function was not called
            expect(augmentAndForwardError).not.toHaveBeenCalled();
        });

        // Test that the newSubCategory function handles an error
        test(testNames.error, async () => {
            // Mock the 'create' function to throw an error
            mockSC_Create.mockImplementation(() => {
                throw new Error("new error");
            });

            // Call the newSubCategory function with the mock request and response
            await newSubCategory(
                mockRequest as Request,
                mockResponse as Response,
                mockNextFunction,
            );

            // Check that the error handling function was called
            expect(augmentAndForwardError).toHaveBeenCalled();
        });
    });

    // Define the name of the function being tested
    const funcName_2 = "delSubCategory";

    // Begin a test suite for the delSubCategory function
    describe(`${funcName} -> ${funcName_2} tests`, () => {
        // Define a mock subcategory ID
        const mockSubCategoryId = new ObjectId().toString();

        // Before each test, set up the mock request object
        beforeEach(() => {
            mockRequest = {
                params: {
                    subCategoryName: mockNewSubCategoryData.name,
                },
            };
        });

        // Mock the 'findOneAndDelete' function from the 'subCategory' model
        const mockSC_FindOneAndDelete =
            subCategory.findOneAndDelete as jest.Mock;

        // Test that the delSubCategory function successfully deletes a subcategory
        test(testNames.delDoc.success, async () => {
            // Define a mock subcategory data object
            const mockRecievedCategoryData = {
                ...mockNewSubCategoryData,
                _id: mockSubCategoryId,
            };

            // Mock the 'findOneAndDelete' function to return the mock subcategory data
            mockSC_FindOneAndDelete.mockResolvedValue(mockRecievedCategoryData);

            // Call the delSubCategory function with the mock request and response
            await delSubCategory(
                mockRequest as Request,
                mockResponse as Response,
                mockNextFunction,
            );

            // Set the expected response message and payload
            resMessage = `Request to delete ${collectionName}-: ${mockNewSubCategoryData.name} is successfull.`;
            resPayload.setSuccess(resMessage);

            // Check that the response status and body are as expected
            expect(mockResponse.status).toBe(200);
            expect(mockResponse.json).toStrictEqual(resPayload);
            // Check that the error handling function was not called
            expect(augmentAndForwardError).not.toHaveBeenCalled();
        });

        // Test that the delSubCategory function handles an unsuccessful subcategory deletion
        test(testNames.delDoc.unsuccess, async () => {
            // Mock the 'findOneAndDelete' function to return null
            mockSC_FindOneAndDelete.mockResolvedValue(null);

            // Call the delSubCategory function with the mock request and response
            await delSubCategory(
                mockRequest as Request,
                mockResponse as Response,
                mockNextFunction,
            );

            // Set the expected response message and payload
            resMessage = `Request to delete ${collectionName}-: ${mockNewSubCategoryData.name} is unsuccessfull.`;
            resPayload.setConflict(resMessage);

            // Check that the response status and body are as expected
            expect(mockResponse.status).toBe(409);
            expect(mockResponse.json).toStrictEqual(resPayload);
            // Check that the error handling function was not called
            expect(augmentAndForwardError).not.toHaveBeenCalled();
        });

        // Test that the delSubCategory function handles an error
        test(testNames.error, async () => {
            // Mock the 'findOneAndDelete' function to throw an error
            mockSC_FindOneAndDelete.mockImplementation(() => {
                throw new Error("new error");
            });

            // Call the delSubCategory function with the mock request and response
            await delSubCategory(
                mockRequest as Request,
                mockResponse as Response,
                mockNextFunction,
            );

            // Check that the error handling function was called
            expect(augmentAndForwardError).toHaveBeenCalled();
        });
    });
});
