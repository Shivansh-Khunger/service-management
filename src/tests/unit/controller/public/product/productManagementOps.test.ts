// Import Types
import type { NextFunction, Request, Response } from "express";

// Import function(s) to be tested
import { updateProduct } from "@controllers/public/product";

// Import necessary modules
import { logger } from "@logger";
import product from "@models/product";
import augmentAndForwardError from "@utils/errorAugmenter";
import ResponsePayload from "@utils/resGenerator";
import { ObjectId } from "mongodb";
import { generateNameforManagement } from "../../testNameGenerator";

// Mock the 'findByIdAndUpdate' function from the 'product' model
jest.mock("@models/product", () => ({
    findByIdAndUpdate: jest.fn(),
}));

// Mock the 'errorAugmenter' utility function
jest.mock("@utils/errorAugmenter", () => ({
    __esModule: true, // This is necessary when mocking ES6 modules
    default: jest.fn(),
}));

// Define a mock product data object
const mockProductData = {
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

// Define the name of the collection being tested
const collectionName = "Product";

// Generate test names for the product management operations
const testNames = generateNameforManagement(collectionName);

// Define the name of the function being tested
const funcName = "productManagementOps";

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
            findByIdAndUpdate: jest.fn(),
        }));

        jest.mock("@utils/errorAugmenter", () => ({
            __esModule: true,
            default: jest.fn(),
        }));
    });
    // Define the name of the function being tested
    const funcName_1 = "updateProduct";

    // Begin a test suite for the updateProduct function
    describe(`${funcName} -> ${funcName_1}`, () => {
        // Mock the findByIdAndUpdate function from the product model
        const mockP_findByIdAndUpdate = product.findByIdAndUpdate as jest.Mock;

        // Define a mock product ID
        const mockProductId = new ObjectId().toString();

        // Define a mock product data object
        const mockLatestProduct = {
            ...mockProductData,
            name: "Business My",
            _id: mockProductId,
        };

        // Before each test, set up the mock request object
        beforeEach(() => {
            mockRequest = {
                body: {
                    latestProduct: mockLatestProduct,
                },
                params: {
                    productId: mockProductId,
                },
            };
        });

        // Test that the updateProduct function successfully updates a product
        test(testNames.updateDoc.success, async () => {
            // Mock the findByIdAndUpdate function to return the mock product data
            mockP_findByIdAndUpdate.mockResolvedValue(mockLatestProduct);

            // Call the updateProduct function with the mock request and response
            await updateProduct(
                mockRequest as Request,
                mockResponse as Response,
                mockNextFunction,
            );

            // Set the expected response message and payload
            resMessage = `Request to update ${collectionName}-: ${mockProductId} is successfull.`;
            resPayload.setSuccess(resMessage, mockLatestProduct);

            // Check that the response status and body are as expected
            expect(mockResponse.status).toBe(200);
            expect(mockResponse.json).toStrictEqual(resPayload);
            // Check that the error handling function was not called
            expect(augmentAndForwardError).not.toHaveBeenCalled();
        });

        // Test that the updateProduct function handles an unsuccessful product update
        test(testNames.updateDoc.unsuccess, async () => {
            // Mock the findByIdAndUpdate function to return null
            mockP_findByIdAndUpdate.mockResolvedValue(null);

            // Call the updateProduct function with the mock request and response
            await updateProduct(
                mockRequest as Request,
                mockResponse as Response,
                mockNextFunction,
            );

            // Set the expected response message and payload
            resMessage = `Request to update ${collectionName}-: ${mockProductId} is unsuccessfull.`;
            resPayload.setConflict(resMessage);

            // Check that the response status and body are as expected
            expect(mockResponse.status).toBe(409);
            expect(mockResponse.json).toStrictEqual(resPayload);
            // Check that the error handling function was not called
            expect(augmentAndForwardError).not.toHaveBeenCalled();
        });

        // Test that the updateProduct function handles an error
        test(testNames.error, async () => {
            // Mock the findByIdAndUpdate function to throw an error
            mockP_findByIdAndUpdate.mockImplementation(() => {
                throw new Error("new error");
            });

            // Call the updateProduct function with the mock request and response
            await updateProduct(
                mockRequest as Request,
                mockResponse as Response,
                mockNextFunction,
            );

            // Check that the error handling function was called
            expect(augmentAndForwardError).toHaveBeenCalled();
        });
    });
});
