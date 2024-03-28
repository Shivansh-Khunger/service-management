// Import Types
import type { NextFunction, Request, Response } from 'express';

// Import function(s) to be tested
import { delDeal, newDeal } from '@controllers/public/deals';

// Import necessary modules
import { logger } from '@logger';
import Business from '@models/business';
import Deal from '@models/deal';
import Product from '@models/product';
import augmentAndForwardError from '@utils/errorAugmenter';
import ResponsePayload from '@utils/resGenerator';
import axios from 'axios';
import { ObjectId } from 'mongodb';
import { generateNameforPrimitive } from '../../testNameGenerator';

// Define a mock deal data object
const mockNewDealData = {
    name: 'Sample Deal',
    startDate: new Date(),
    endDate: new Date(),
    description: 'This is a sample deal',
    stockType: 'In Stock',
    videoUrl: 'https://sample.com/video',
    images: ['https://sample.com/image1', 'https://sample.com/image2'],
    upiAddress: 'sample@upi',
    paymentMode: 'UPI',
    ifReturn: true,
    deliveryType: 'Home Delivery',
    returnPolicyDescription: 'Return within 10 days',
    marketPrice: 1000,
    offerPrice: 800,
    quantity: 10,
    ifHomeDelivery: true,
    freeHomeDeliveryKm: 5,
    costPerKm: 10,
    ifPublicPhone: true,
    ifSellingOnline: true,
    productId: new ObjectId(),
    businessId: new ObjectId(),
    userId: new ObjectId(),
};

// Mock the 'findById' functions from the 'business' model
jest.mock('@models/business', () => ({
    findById: jest
        .fn()
        .mockResolvedValue({ _id: 'mockId', name: 'mockBusinessName' }),
}));

// Mock the 'create' and 'findByIdAndDelete' functions from the 'deal' model
jest.mock('@models/deal', () => ({
    create: jest.fn(),
    findByIdAndDelete: jest.fn(),
}));

// Mock the 'findById' functions from the 'product' model
jest.mock('@models/product', () => ({
    findById: jest
        .fn()
        .mockResolvedValue({ _id: 'mockId', name: 'mockProductName' }),
}));

// Mock the 'errorAugmenter' utility function
jest.mock('@utils/errorAugmenter', () => ({
    __esModule: true, // This is necessary when mocking ES6 modules
    default: jest.fn(),
}));

// Mock the axios module to replace the 'post' method with a jest mock function
jest.mock('axios', () => ({
    post: jest.fn(),
}));

// Define the name of the collection being tested
const collectionName = 'Deal';

// Generate test names for the deal primitive operations
const testNames = generateNameforPrimitive(collectionName);

// Define the name of the function being tested
const funcName = 'dealPrimitiveOps';

// Begin a test suite for the deal primitive operations
describe(`controller -> ${funcName} tests`, () => {
    // Define mock request and response objects
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;

    // Define a mock next function for Express middleware
    const mockNextFunction: NextFunction = jest.fn();

    // Define a response payload and message
    let resPayload: ResponsePayload;
    let resMessage: string;

    const mockUserId = new ObjectId();
    // Before each test, set up the mock request and response and reset the response payload and message
    beforeEach(() => {
        mockRequest = {
            userCredentials: {
                userId: mockUserId.toString(),
                userName: 'mockName',
                userEmail: 'mockEmail',
            },
        };
        mockResponse = {
            status: jest.fn().mockImplementation(statusCode => {
                mockResponse.status = statusCode;
                return mockResponse;
            }),
            json: jest.fn().mockImplementation(resPayload => {
                mockResponse.json = resPayload;
                return mockResponse;
            }),
            log: logger,
        };
        resPayload = new ResponsePayload();
        resMessage = '';
    });

    // After each test, clear all mocks and reset the deal model and error augmenter mocks
    afterEach(() => {
        jest.clearAllMocks();

        jest.mock('@models/deal', () => ({
            create: jest.fn(),
            findByIdAndDelete: jest.fn(),
        }));

        jest.mock('@utils/errorAugmenter', () => ({
            __esModule: true,
            default: jest.fn(),
        }));
    });

    // Define the name of the function being tested
    const funcName_1 = 'newDeal';

    // Begin a test suite for the newDeal function
    describe(`${funcName} -> ${funcName_1} tests`, () => {
        // Mock the create function from the deal model
        const mockD_Create = Deal.create as jest.Mock;

        // Before each test, set up the mock request object
        beforeEach(() => {
            mockRequest = {
                ...mockRequest,
                body: {
                    dealData: {
                        ...mockNewDealData,
                    },
                },
            };
        });

        // Test that the newDeal function successfully creates a deal
        test(testNames.newDoc.success, async () => {
            // Mock the create function to return the mock deal data
            mockD_Create.mockResolvedValue(mockNewDealData);

            // Call the newDeal function with the mock request and response
            await newDeal(
                mockRequest as Request,
                mockResponse as Response,
                mockNextFunction,
            );

            // Set the expected response message and payload
            resMessage = `Request to create deal-: ${mockNewDealData.name} by user -:${mockNewDealData.userId} is successfull.`;
            resPayload.setSuccess(resMessage, mockNewDealData);

            // Check that the response status and body are as expected
            expect(mockResponse.status).toBe(201);
            expect(mockResponse.json).toStrictEqual(resPayload);

            // Assert that axios would be called with certain arguments
            expect(axios.post).toHaveBeenCalledWith(
                `${process.env.SERVICE_EMAIL_URL}d/new`,
                {
                    recipientEmail: mockRequest.userCredentials?.userEmail,
                    recipientName: mockRequest.userCredentials?.userName,
                    businessName: 'mockBusinessName',
                    productName: 'mockProductName',
                    dealName: mockNewDealData.name,
                    dealEndDate: mockNewDealData.endDate.toString(),
                },
            );

            // Check that the error handling function was not called
            expect(augmentAndForwardError).not.toHaveBeenCalled();
        });

        // Test that the newDeal function handles an unsuccessful deal creation
        test(testNames.newDoc.unsuccess, async () => {
            // Mock the create function to return null
            mockD_Create.mockResolvedValue(null);

            // Call the newDeal function with the mock request and response
            await newDeal(
                mockRequest as Request,
                mockResponse as Response,
                mockNextFunction,
            );

            // Set the expected response message and payload
            resMessage = `Request to create deal-: ${mockNewDealData.name} is unsuccessfull.`;
            resPayload.setConflict(resMessage);

            // Check that the response status and body are as expected
            expect(mockResponse.status).toBe(409);
            expect(mockResponse.json).toStrictEqual(resPayload);
            // Check that the error handling function was not called
            expect(augmentAndForwardError).not.toHaveBeenCalled();
        });

        // Test that the newDeal function handles an error
        test(testNames.error, async () => {
            // Mock the create function to throw an error
            mockD_Create.mockImplementation(() => {
                throw new Error('new error');
            });

            // Call the newDeal function with the mock request and response
            await newDeal(
                mockRequest as Request,
                mockResponse as Response,
                mockNextFunction,
            );

            // Check that the error handling function was called
            expect(augmentAndForwardError).toHaveBeenCalled();
        });
    });

    // Define the name of the function being tested
    const funcName_2 = 'delBusiness';

    // Begin a test suite for the delBusiness function
    describe(`${funcName} -> ${funcName_2} tests`, () => {
        // Define a mock deal ID
        const mockDealId = new ObjectId().toString();

        // Before each test, set up the mock request object
        beforeEach(() => {
            mockRequest = {
                ...mockRequest,
                params: {
                    dealId: mockDealId,
                },
            };
        });

        // Mock the findByIdAndDelete function from the deal model
        const mockD_FindByIdAndDelete = Deal.findByIdAndDelete as jest.Mock;

        // Test that the delDeal function successfully deletes a deal
        test(testNames.delDoc.success, async () => {
            // Define a mock deal data object
            const mockRecievedDealData = {
                ...mockNewDealData,
                _id: mockDealId,
            };

            // Mock the findByIdAndDelete function to return the mock deal data
            mockD_FindByIdAndDelete.mockResolvedValue(mockRecievedDealData);

            // Call the delDeal function with the mock request and response
            await delDeal(
                mockRequest as Request,
                mockResponse as Response,
                mockNextFunction,
            );

            // Set the expected response message and payload
            resMessage = `Request to delete deal-: ${mockDealId} is successfull.`;
            resPayload.setSuccess(resMessage);

            // Check that the response status and body are as expected
            expect(mockResponse.status).toBe(200);
            expect(mockResponse.json).toStrictEqual(resPayload);
            // Check that the error handling function was not called
            expect(augmentAndForwardError).not.toHaveBeenCalled();
        });

        // Test that the delDeal function handles an unsuccessful deal deletion
        test(testNames.delDoc.unsuccess, async () => {
            // Mock the findByIdAndDelete function to return null
            mockD_FindByIdAndDelete.mockResolvedValue(null);

            // Call the delDeal function with the mock request and response
            await delDeal(
                mockRequest as Request,
                mockResponse as Response,
                mockNextFunction,
            );

            // Set the expected response message and payload
            resMessage = `Request to delete deal-: ${mockDealId} is unsuccessfull.`;
            resPayload.setConflict(resMessage);

            // Check that the response status and body are as expected
            expect(mockResponse.status).toBe(409);
            expect(mockResponse.json).toStrictEqual(resPayload);
            // Check that the error handling function was not called
            expect(augmentAndForwardError).not.toHaveBeenCalled();
        });

        // Test that the delDeal function handles an error
        test(testNames.error, async () => {
            // Mock the findByIdAndDelete function to throw an error
            mockD_FindByIdAndDelete.mockImplementation(() => {
                throw new Error('new error');
            });

            // Call the delDeal function with the mock request and response
            await delDeal(
                mockRequest as Request,
                mockResponse as Response,
                mockNextFunction,
            );

            // Check that the error handling function was called
            expect(augmentAndForwardError).toHaveBeenCalled();
        });
    });
});
