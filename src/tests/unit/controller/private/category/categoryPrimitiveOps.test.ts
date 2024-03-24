// Import Types
import type { NextFunction, Request, Response } from "express";

// Import function(s) to be tested
import { delCategory, newCategory } from "@controllers/private/category";

// Import necessary modules
import { logger } from "@logger";
import category from "@models/category";
import subCategory from "@models/subCategory";
import augmentAndForwardError from "@utils/errorAugmenter";
import ResponsePayload from "@utils/resGenerator";
import { ObjectId } from "mongodb";
import { generateNameforPrimitive } from "../../testNameGenerator";

// Define a mock category data object
const mockNewCategoryData = {
    name: "Sample Category",
    image: "https://sample.com/image",
    description: "This is a sample category",
};

// Mock the 'create' and 'findOneAndDelete' functions from the 'category' model
jest.mock("@models/category", () => ({
    create: jest.fn(),
    findOneAndDelete: jest.fn(),
}));

// Mock the 'deleteMany' function from the 'subCategory' model
jest.mock("@models/subCategory", () => ({
    deleteMany: jest.fn(),
}));

// Mock the 'errorAugmenter' utility function
jest.mock("@utils/errorAugmenter", () => ({
    __esModule: true, // This property is necessary when mocking ES6 modules
    default: jest.fn(),
}));

// Define the name of the collection being tested
const collectionName = "Category";

// Generate test names for the category primitive operations
const testNames = generateNameforPrimitive(collectionName);

// Define the name of the function being tested
const funcName = "categoryPrimitiveOps";

// Begin a test suite for the category primitive operations
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

    // After each test, clear all mocks and reset the category model and error augmenter mocks
    afterEach(() => {
        jest.clearAllMocks();

        jest.mock("@models/category", () => ({
            create: jest.fn(),
            findOneAndDelete: jest.fn(),
        }));

        jest.mock("@utils/errorAugmenter", () => ({
            __esModule: true,
            default: jest.fn(),
        }));
    });

    // Define the name of the function being tested
    const funcName_1 = "newCategory";

    // Begin a test suite for the newCategory function
    describe(`${funcName} -> ${funcName_1} tests`, () => {
        // Mock the 'create' function from the 'category' model
        const mockC_Create = category.create as jest.Mock;

        // Before each test, set up the mock request object
        beforeEach(() => {
            mockRequest = {
                body: {
                    categoryData: {
                        ...mockNewCategoryData,
                    },
                },
            };
        });

        // Test that the newCategory function successfully creates a category
        test(testNames.newDoc.success, async () => {
            // Mock the 'create' function to return the mock category data
            mockC_Create.mockResolvedValue(mockNewCategoryData);

            // Call the newCategory function with the mock request and response
            await newCategory(
                mockRequest as Request,
                mockResponse as Response,
                mockNextFunction,
            );

            // Set the expected response message and payload
            resMessage = `Request to create ${collectionName}-: ${mockNewCategoryData.name} is successfull.`;
            resPayload.setSuccess(resMessage, mockNewCategoryData);

            // Check that the response status and body are as expected
            expect(mockResponse.status).toBe(201);
            expect(mockResponse.json).toStrictEqual(resPayload);
            // Check that the error handling function was not called
            expect(augmentAndForwardError).not.toHaveBeenCalled();
        });

        // Test that the newCategory function handles an unsuccessful category creation
        test(testNames.newDoc.unsuccess, async () => {
            // Mock the 'create' function to return null
            mockC_Create.mockResolvedValue(null);

            // Call the newCategory function with the mock request and response
            await newCategory(
                mockRequest as Request,
                mockResponse as Response,
                mockNextFunction,
            );

            // Set the expected response message and payload
            resMessage = `Request to create ${collectionName}-: ${mockNewCategoryData.name} is unsuccessfull.`;
            resPayload.setConflict(resMessage);

            // Check that the response status and body are as expected
            expect(mockResponse.status).toBe(409);
            expect(mockResponse.json).toStrictEqual(resPayload);
            // Check that the error handling function was not called
            expect(augmentAndForwardError).not.toHaveBeenCalled();
        });

        // Test that the newCategory function handles an error
        test(testNames.error, async () => {
            // Mock the 'create' function to throw an error
            mockC_Create.mockImplementation(() => {
                throw new Error("new error");
            });

            // Call the newCategory function with the mock request and response
            await newCategory(
                mockRequest as Request,
                mockResponse as Response,
                mockNextFunction,
            );

            // Check that the error handling function was called
            expect(augmentAndForwardError).toHaveBeenCalled();
        });
    });

    // Define the name of the function being tested
    const funcName_2 = "delCategory";

    // Begin a test suite for the delCategory function
    describe(`${funcName} -> ${funcName_2} tests`, () => {
        // Define a mock category ID
        const mockCategoryId = new ObjectId().toString();

        // Mock the 'deleteMany' function from the 'subCategory' model
        const SC_DeleteMany = subCategory.deleteMany as jest.Mock;

        // Before each test, set up the mock request object and 'deleteMany' function
        beforeEach(() => {
            mockRequest = {
                params: {
                    categoryName: mockNewCategoryData.name,
                },
            };

            SC_DeleteMany.mockResolvedValue({});
        });

        // Mock the 'findOneAndDelete' function from the 'category' model
        const mockC_FindOneAndDelete = category.findOneAndDelete as jest.Mock;

        // Test that the delCategory function successfully deletes a category
        test(testNames.delDoc.success, async () => {
            // Define a mock category data object
            const mockRecievedCategoryData = {
                ...mockNewCategoryData,
                _id: mockCategoryId,
            };

            // Mock the 'findOneAndDelete' function to return the mock category data
            mockC_FindOneAndDelete.mockResolvedValue(mockRecievedCategoryData);

            // Call the delCategory function with the mock request and response
            await delCategory(
                mockRequest as Request,
                mockResponse as Response,
                mockNextFunction,
            );

            // Set the expected response message and payload
            resMessage = `Request to delete ${collectionName}-: ${mockNewCategoryData.name} is successfull.`;
            resPayload.setSuccess(resMessage);

            // Check that the response status and body are as expected
            expect(mockResponse.status).toBe(200);
            expect(mockResponse.json).toStrictEqual(resPayload);
            // Check that the error handling function was not called
            expect(augmentAndForwardError).not.toHaveBeenCalled();
        });

        // Test that the delCategory function handles an unsuccessful category deletion
        test(testNames.delDoc.unsuccess, async () => {
            // Mock the 'findOneAndDelete' function to return null
            mockC_FindOneAndDelete.mockResolvedValue(null);

            // Call the delCategory function with the mock request and response
            await delCategory(
                mockRequest as Request,
                mockResponse as Response,
                mockNextFunction,
            );

            // Set the expected response message and payload
            resMessage = `Request to delete ${collectionName}-: ${mockNewCategoryData.name} is unsuccessfull.`;
            resPayload.setConflict(resMessage);

            // Check that the response status and body are as expected
            expect(mockResponse.status).toBe(409);
            expect(mockResponse.json).toStrictEqual(resPayload);
            // Check that the error handling function was not called
            expect(augmentAndForwardError).not.toHaveBeenCalled();
        });

        // Test that the delCategory function handles an error
        test(testNames.error, async () => {
            // Mock the 'findOneAndDelete' function to throw an error
            mockC_FindOneAndDelete.mockImplementation(() => {
                throw new Error("new error");
            });

            // Call the delCategory function with the mock request and response
            await delCategory(
                mockRequest as Request,
                mockResponse as Response,
                mockNextFunction,
            );

            // Check that the error handling function was called
            expect(augmentAndForwardError).toHaveBeenCalled();
        });
    });
});
