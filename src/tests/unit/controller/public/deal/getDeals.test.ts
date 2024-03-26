// Import Types
import type { NextFunction, Request, Response } from "express";

// Import function(s) to be tested
import { getDeals } from "@controllers/public/deals";

// Import necessary modules
import { logger } from "@logger";
import Business from "@models/business";
import Product from "@models/product";
import User from "@models/user";
import CustomError from "@utils/customError";
import augmentAndForwardError from "@utils/errorAugmenter";
import ResponsePayload from "@utils/resGenerator";
import { ObjectId } from "mongodb";
import { generateNameforPrimitive } from "../../testNameGenerator";

// Mock the aggregate function of the Business model
jest.mock("@models/business", () => ({
    aggregate: jest.fn(),
}));

// Mock the findById function of the User model
jest.mock("@models/user", () => ({
    findById: jest.fn(),
}));

// Mock the errorAugmenter utility function
jest.mock("@utils/errorAugmenter", () => ({
    __esModule: true, // Enable mocking of default export
    default: jest.fn(), // Mock the default export
}));

// Define mock deals
const mockDeals = [
    {
        name: "mockBusiness",
        deal: {
            name: "mockDeal",
            product: {
                name: "mockProduct",
            },
        },
    },
];

// Define the name of the collection and the function being tested
const collectionName = "Deals";
const funcName = "getDeals";

// Generate names for the tests
const testNames = generateNameforPrimitive(collectionName);

// Begin a test suite for the getDeals function
describe(`controller -> ${funcName} tests`, () => {
    // Define mock request, response, and next function
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    const mockNextFunction: NextFunction = jest.fn();

    // Define mock response payload and message
    let mockResPayload: ResponsePayload;
    let mockResMessage: string;

    // Define a mock user ID and error
    const mockUserId = new ObjectId();
    const mockErr = new CustomError();

    // Before each test, set up the mock request and response objects and the response payload and message
    beforeEach(() => {
        mockRequest = {
            userCredentials: {
                userId: mockUserId.toString(),
            },
            body: {
                userData: {
                    currentLocation: [40.730776, -74.005974],
                    preferedDistanceInKm: 5,
                },
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

    // Define mock functions for findById and aggregate
    const mockU_FindById = User.findById as jest.Mock;
    const mockB_Aggregate = Business.aggregate as jest.Mock;

    // Test suite: User's interestArray is successfully retrieved
    describe("if grabbing User interestArray is successfull", () => {
        // Before each test, mock the findById function to return a user with an interestArray and an _id
        beforeEach(() => {
            mockU_FindById.mockResolvedValue({
                interestArray: ["65fffee82adf14a93a9c0626"],
                _id: mockUserId,
            });
        });

        // Test case: Deals are successfully retrieved for the user
        test(`if Sends appropiate response if getting ${collectionName} is successfull`, async () => {
            // Mock the aggregate function to return mock deals
            mockB_Aggregate.mockResolvedValue(mockDeals);

            // Call the getDeals function with the mock request and response
            await getDeals(
                mockRequest as Request,
                mockResponse as Response,
                mockNextFunction,
            );

            // Set up the expected response message and payload
            mockResMessage = `Request to get ${collectionName} for user -:${mockUserId} is successfull.`;
            mockResPayload.setSuccess(mockResMessage, mockDeals);

            // Check that the response status is 200, the response payload matches the expected payload, and the augmentAndForwardError function was not called
            expect(mockResponse.status).toBe(200);
            expect(mockResponse.json).toStrictEqual(mockResPayload);
            expect(augmentAndForwardError).not.toHaveBeenCalled();
        });

        // Test case: Deals are not retrieved for the user
        test(`if Sends appropiate response if getting ${collectionName} is unsuccessfull`, async () => {
            // Mock the aggregate function to return null
            mockB_Aggregate.mockResolvedValue(null);

            // Call the getDeals function with the mock request and response
            await getDeals(
                mockRequest as Request,
                mockResponse as Response,
                mockNextFunction,
            );

            // Set up the expected response message and payload
            mockResMessage = `Request to get ${collectionName} for user -:${mockUserId} is not successfull.`;
            mockResPayload.setConflict(mockResMessage);

            // Check that the response status is 409, the response payload matches the expected payload, and the augmentAndForwardError function was not called
            expect(mockResponse.status).toBe(409);
            expect(mockResponse.json).toStrictEqual(mockResPayload);
            expect(augmentAndForwardError).not.toHaveBeenCalled();
        });
    });

    // Test case: User's interestArray is not retrieved
    test("if Sends appropiate response when grabbing User interestArray is unsuccessfull", async () => {
        // Mock the findById function to return null
        mockU_FindById.mockResolvedValue(null);

        // Call the getDeals function with the mock request and response
        await getDeals(
            mockRequest as Request,
            mockResponse as Response,
            mockNextFunction,
        );

        // Set up the expected response message and payload
        mockResMessage = `Request to get ${collectionName} for user -:${mockUserId} is not successfull beacause unable to get intrests for the user.`;
        mockResPayload.setError(mockResMessage);

        // Check that the response status is 409, the response payload matches the expected payload, and the augmentAndForwardError function was not called
        expect(mockResponse.status).toBe(409);
        expect(mockResponse.json).toStrictEqual(mockResPayload);
        expect(augmentAndForwardError).not.toHaveBeenCalled();
    });

    // Test case: Error occurs during getDeals
    test(testNames.error, async () => {
        // Mock the findById function to throw an error
        mockU_FindById.mockImplementation(() => {
            throw mockErr;
        });

        // Call the getDeals function with the mock request and response
        await getDeals(
            mockRequest as Request,
            mockResponse as Response,
            mockNextFunction,
        );

        // Check that the augmentAndForwardError function was called with the correct arguments
        expect(augmentAndForwardError).toHaveBeenCalledWith({
            next: mockNextFunction,
            err: mockErr,
            funcName: funcName,
        });
    });
});
