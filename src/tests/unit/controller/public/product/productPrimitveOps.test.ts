// Import Types
import type { NextFunction, Request, Response } from "express";

// Import function(s) to be tested
import { delProduct, newProduct } from "@controllers/public/product";

// Import necessary modules
import { logger } from "@logger";
import product from "@models/product";
import augmentAndForwardError from "@utils/errorAugmenter";
import ResponsePayload from "@utils/resGenerator";
import { ObjectId } from "mongodb";
import { generateNameforPrimitive } from "../../testNameGenerator";

// Define a mock product data object
const mockNewProductData = {
    name: "Product Name",
    brandName: "Brand Name",
    description: "Product Description",
    openingStock: 100,
    stockType: "Stock Type",
    unitMrp: 100.0,
    sellingPrice: 90.0,
    batchNo: "Batch123",
    manufacturingDate: "2022-01-01",
    expiryDate: "2023-01-01",
    attributes: [
        { name: "color", value: "red" },
        { name: "size", value: "large" },
    ],
    images: [
        "https://example.com/image1.jpg",
        "https://example.com/image2.jpg",
    ],
    businessId: "65e221fbd9f5432ff59d3ddd",
    userId: "65e221dad9f5432ff59d3ddb",
    countryCode: "IN",
};

// Mock the 'create' and 'findByIdAndDelete' functions from the 'product' model
jest.mock("@models/product", () => ({
    create: jest.fn(),
    findByIdAndDelete: jest.fn(),
}));

// Mock the 'errorAugmenter' utility function
jest.mock("@utils/errorAugmenter", () => ({
    __esModule: true, // This is necessary when mocking ES6 modules
    default: jest.fn(),
}));

// Define the name of the collection being tested
const collectionName = "Product";

// Generate test names for the product management operations
const testNames = generateNameforPrimitive(collectionName);

// Define the name of the function being tested
const funcName = "productPrimitiveOps";

// Begin a test suite for the product management operations
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

    // After each test, clear all mocks and reset the product model and error augmenter mocks
    afterEach(() => {
        jest.clearAllMocks();

        jest.mock("@models/product", () => ({
            create: jest.fn(),
            findByIdAndDelete: jest.fn(),
        }));

        jest.mock("@utils/errorAugmenter", () => ({
            __esModule: true,
            default: jest.fn(),
        }));
    });

    // Define the name of the function being tested
    const funcName_1 = "newProduct";

    // Begin a test suite for the newProduct function
    describe(`${funcName} -> ${funcName_1} tests`, () => {
        // Mock the 'create' function from the 'product' model
        const mockP_Create = product.create as jest.Mock;

        // Before each test, set up the mock request object
        beforeEach(() => {
            mockRequest = {
                body: {
                    productData: {
                        ...mockNewProductData,
                    },
                },
            };
        });

        // Test that the newProduct function successfully creates a product
        test(testNames.newDoc.success, async () => {
            // Mock the 'create' function to return the mock product data
            mockP_Create.mockResolvedValue(mockNewProductData);

            // Call the newProduct function with the mock request and response
            await newProduct(
                mockRequest as Request,
                mockResponse as Response,
                mockNextFunction,
            );

            // Set the expected response message and payload
            resMessage = `Request to create ${collectionName}-: ${mockNewProductData.name} under business-: ${mockNewProductData.businessId} is successfull.`;
            resPayload.setSuccess(resMessage, mockNewProductData);

            // Check that the response status and body are as expected
            expect(mockResponse.status).toBe(201);
            expect(mockResponse.json).toStrictEqual(resPayload);
            // Check that the error handling function was not called
            expect(augmentAndForwardError).not.toHaveBeenCalled();
        });

        // Test that the newProduct function handles an unsuccessful product creation
        test(testNames.newDoc.unsuccess, async () => {
            // Mock the 'create' function to return null
            mockP_Create.mockResolvedValue(null);

            // Call the newProduct function with the mock request and response
            await newProduct(
                mockRequest as Request,
                mockResponse as Response,
                mockNextFunction,
            );

            // Set the expected response message and payload
            resMessage = `Request to create ${collectionName}-: ${mockNewProductData.name} under business-: ${mockNewProductData.businessId} is unsuccessfull.`;
            resPayload.setConflict(resMessage);

            // Check that the response status and body are as expected
            expect(mockResponse.status).toBe(409);
            expect(mockResponse.json).toStrictEqual(resPayload);
            // Check that the error handling function was not called
            expect(augmentAndForwardError).not.toHaveBeenCalled();
        });

        // Test that the newProduct function handles an error
        test(testNames.error, async () => {
            // Mock the 'create' function to throw an error
            mockP_Create.mockImplementation(() => {
                throw new Error("new error");
            });

            // Call the newProduct function with the mock request and response
            await newProduct(
                mockRequest as Request,
                mockResponse as Response,
                mockNextFunction,
            );

            // Check that the error handling function was called
            expect(augmentAndForwardError).toHaveBeenCalled();
        });
    });

    // Define the name of the function being tested
    const funcName_2 = "delProduct";

    // Begin a test suite for the delProduct function
    describe(`${funcName} -> ${funcName_2} tests`, () => {
        // Define a mock product ID
        const mockProductId = new ObjectId().toString();

        // Before each test, set up the mock request object
        beforeEach(() => {
            mockRequest = {
                params: {
                    productId: mockProductId,
                },
            };
        });

        // Mock the 'findByIdAndDelete' function from the 'product' model
        const mockP_FindByIdAndDelete = product.findByIdAndDelete as jest.Mock;

        // Test that the delProduct function successfully deletes a product
        test(testNames.delDoc.success, async () => {
            // Define a mock product data object
            const mockRecievedProductData = {
                ...mockNewProductData,
                _id: mockProductId,
            };

            // Mock the 'findByIdAndDelete' function to return the mock product data
            mockP_FindByIdAndDelete.mockResolvedValue(mockRecievedProductData);

            // Call the delProduct function with the mock request and response
            await delProduct(
                mockRequest as Request,
                mockResponse as Response,
                mockNextFunction,
            );

            // Set the expected response message and payload
            resMessage = `Request to delete ${collectionName}-: ${mockProductId} is successfull.`;
            resPayload.setSuccess(resMessage);

            // Check that the response status and body are as expected
            expect(mockResponse.status).toBe(200);
            expect(mockResponse.json).toStrictEqual(resPayload);
            // Check that the error handling function was not called
            expect(augmentAndForwardError).not.toHaveBeenCalled();
        });

        // Test that the delProduct function handles an unsuccessful product deletion
        test(testNames.delDoc.unsuccess, async () => {
            // Mock the 'findByIdAndDelete' function to return null
            mockP_FindByIdAndDelete.mockResolvedValue(null);

            // Call the delProduct function with the mock request and response
            await delProduct(
                mockRequest as Request,
                mockResponse as Response,
                mockNextFunction,
            );

            // Set the expected response message and payload
            resMessage = `Request to delete ${collectionName}-: ${mockProductId} is unsuccessfull.`;
            resPayload.setConflict(resMessage);

            // Check that the response status and body are as expected
            expect(mockResponse.status).toBe(409);
            expect(mockResponse.json).toStrictEqual(resPayload);
            // Check that the error handling function was not called
            expect(augmentAndForwardError).not.toHaveBeenCalled();
        });

        // Test that the delProduct function handles an error
        test(testNames.error, async () => {
            // Mock the 'findByIdAndDelete' function to throw an error
            mockP_FindByIdAndDelete.mockImplementation(() => {
                throw new Error("new error");
            });

            // Call the delProduct function with the mock request and response
            await delProduct(
                mockRequest as Request,
                mockResponse as Response,
                mockNextFunction,
            );

            // Check that the error handling function was called
            expect(augmentAndForwardError).toHaveBeenCalled();
        });
    });
});
