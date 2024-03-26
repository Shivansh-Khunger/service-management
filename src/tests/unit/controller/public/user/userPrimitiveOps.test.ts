// Import Types
import type { NextFunction, Request, Response } from "express";

// Import function(s) to be tested
import { delUser, newUser } from "@controllers/public/user";

// Import necessary modules
import { ifUserExistsByEmail } from "@helpers/models/userExists";
import { logger } from "@logger";
import Business from "@models/business";
import Product from "@models/product";
import User from "@models/user";
import CustomError from "@utils/customError";
import augmentAndForwardError from "@utils/errorAugmenter";
import ResponsePayload from "@utils/resGenerator";
import { ObjectId } from "mongodb";
import { generateNameforPrimitive } from "../../testNameGenerator";

// Mock the createCookie helper function
jest.mock("@helpers/createCookie", () => ({
    insertJWT: jest.fn(),
}));

// Mock the createTokens helper function to return a mock token
jest.mock("@helpers/createTokens", () => ({
    __esModule: true,
    default: jest.fn().mockReturnValue("mockToken"),
}));

// Mock the hashPassword helper function to return a mock hashed password
jest.mock("@helpers/hashPassword", () => ({
    __esModule: true,
    default: jest.fn().mockReturnValue("mockHashedPassword"),
}));

// Mock the ifUserExistsByEmail helper function
jest.mock("@helpers/models/userExists", () => ({
    ifUserExistsByEmail: jest.fn(),
}));

// Mock the deleteMany function of the Business model
jest.mock("@models/business", () => ({
    deleteMany: jest.fn(),
}));

// Mock the deleteMany function of the Product model
jest.mock("@models/product", () => ({
    deleteMany: jest.fn(),
}));

// Mock the updateOne, findByIdAndDelete, and create functions of the User model
jest.mock("@models/user", () => ({
    updateOne: jest.fn(),
    findByIdAndDelete: jest.fn(),
    create: jest.fn(),
}));

// Mock the errorAugmenter utility function
jest.mock("@utils/errorAugmenter", () => ({
    __esModule: true,
    default: jest.fn(),
}));

// Mock the referalGenerator utility function to return a mock referral code
jest.mock("@utils/referalGenerator", () => ({
    __esModule: true,
    default: jest.fn().mockReturnValue("mockReferalCode"),
}));

// Define mock data for a new user
const mockNewUserData = {
    name: "RahulUser",
    email: "rahul@example.com",
    phoneNumber: "2234567890",
    password: "blabla",
    referalCode: "referalCode",
    countryCode: "IN",
    pushToken: "pushToken",
    profilePic: "profilePicUrl",
    imeiNumber: "imeiNumber",
    geoLocation: [40.730776, -74.005974],
    interestArray: ["65fffee82adf14a93a9c0626"],
};

// Define the name of the collection and the function being tested
const collectionName = "User";
const funcName = "userPrimitiveOps";

// Generate names for the tests
const testNames = generateNameforPrimitive(collectionName);

// Begin a test suite for the userPrimitiveOps function
describe(`controller -> ${funcName} tests`, () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    const mockNextFunction: NextFunction = jest.fn();

    let mockResPayload: ResponsePayload;
    let mockResMessage: string;

    const mockUserId = new ObjectId();
    const mockErr = new CustomError();

    // Before each test, set up the mock request and response objects and the response payload and message
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
        mockResPayload = new ResponsePayload();
        mockResMessage = "";
    });

    // After each test, clear all mocks
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Define the name of the function being tested
    const funcName_1 = "newUser";

    // Begin a test suite for the newUser function
    describe(`${funcName} -> ${funcName_1} tests`, () => {
        // Before each test, set up the mock request object
        beforeEach(() => {
            mockRequest = {
                body: {
                    userData: {
                        ...mockNewUserData,
                        referalCode: "",
                    },
                },
            };
        });

        // Mock the ifUserExistsByEmail and User.create functions
        const mockIfUserExistsByEmail = ifUserExistsByEmail as jest.Mock;
        const mockU_Create = User.create as jest.Mock;

        // Test the case where the User does not exist
        describe("if User is non-existent", () => {
            // Before each test in this describe block, set the mockIfUserExistsByEmail function to return false
            beforeEach(() => {
                mockIfUserExistsByEmail.mockResolvedValue(false);
            });

            // Test the successful creation of a new user with a non-empty referral code
            test(`${testNames.newDoc.success} with non-empty referal code`, async () => {
                // Set the referral code in the mock request
                mockRequest.body.userData.referalCode = "mockReferalCode";

                // Mock the User.create function to return a new user
                mockU_Create.mockResolvedValue({
                    ...mockNewUserData,
                    _id: mockUserId,
                });

                // Call the function being tested
                await newUser(
                    mockRequest as Request,
                    mockResponse as Response,
                    mockNextFunction,
                );

                // Set up the expected response message and payload
                mockResMessage = `Request to create ${collectionName} with name-: ${mockNewUserData.name} and email -: ${mockNewUserData.email} is successfull.`;
                mockResPayload.setSuccess(mockResMessage, {
                    ...mockNewUserData,
                    _id: mockUserId,
                });

                // Assert that the User.updateOne function was called with the correct arguments
                expect(User.updateOne).toHaveBeenCalledWith(
                    {
                        referalCode: "mockReferalCode",
                    },
                    { $inc: { bounty: 1 } },
                );

                // Assert that the response status and body are as expected
                expect(mockResponse.status).toBe(201);
                expect(mockResponse.json).toStrictEqual(mockResPayload);

                // Assert that the error handling function was not called
                expect(augmentAndForwardError).not.toHaveBeenCalled();
            });

            // Test the successful creation of a new user with an empty referral code
            test(`${testNames.newDoc.success} with empty referal code`, async () => {
                // Mock the User.create function to return a new user
                mockU_Create.mockResolvedValue({
                    ...mockNewUserData,
                    _id: mockUserId,
                });

                // Call the function being tested
                await newUser(
                    mockRequest as Request,
                    mockResponse as Response,
                    mockNextFunction,
                );

                // Set up the expected response message and payload
                mockResMessage = `Request to create ${collectionName} with name-: ${mockNewUserData.name} and email -: ${mockNewUserData.email} is successfull.`;
                mockResPayload.setSuccess(mockResMessage, {
                    ...mockNewUserData,
                    _id: mockUserId,
                });

                // Assert that the response status and body are as expected
                expect(mockResponse.status).toBe(201);
                expect(mockResponse.json).toStrictEqual(mockResPayload);

                // Assert that the error handling function was not called
                expect(augmentAndForwardError).not.toHaveBeenCalled();
            });

            // Test the unsuccessful creation of a new user
            test(testNames.newDoc.unsuccess, async () => {
                // Mock the User.create function to return null
                mockU_Create.mockResolvedValue(null);

                // Call the function being tested
                await newUser(
                    mockRequest as Request,
                    mockResponse as Response,
                    mockNextFunction,
                );

                // Set up the expected response message and payload
                mockResMessage = `Request to create ${collectionName} with name-: ${mockNewUserData.name} and email -: ${mockNewUserData.email} is unsuccessfull.`;
                mockResPayload.setConflict(mockResMessage);

                // Assert that the response status and body are as expected
                expect(mockResponse.status).toBe(409);
                expect(mockResponse.json).toStrictEqual(mockResPayload);

                // Assert that the error handling function was not called
                expect(augmentAndForwardError).not.toHaveBeenCalled();
            });
        });

        // Test the case where the User already exists
        test(`if Sends appropiate response when ${collectionName} is existent`, async () => {
            // Set the mockIfUserExistsByEmail function to return true
            mockIfUserExistsByEmail.mockResolvedValue(true);

            // Call the function being tested
            await newUser(
                mockRequest as Request,
                mockResponse as Response,
                mockNextFunction,
            );

            // Set up the expected response message and payload
            mockResMessage = `Request to create ${collectionName} with the email-: ${mockNewUserData.email} and phone number-:${mockNewUserData.phoneNumber} was not successful because a user with these details already exists.`;
            mockResPayload.setConflict(mockResMessage);

            // Assert that the response status and body are as expected
            expect(mockResponse.status).toBe(409);
            expect(mockResponse.json).toStrictEqual(mockResPayload);

            // Assert that the error handling function was not called
            expect(augmentAndForwardError).not.toHaveBeenCalled();
        });

        // Test the handling of an error during user creation
        test(testNames.error, async () => {
            // Set the mockIfUserExistsByEmail function to return false
            mockIfUserExistsByEmail.mockResolvedValue(false);

            // Mock the User.create function to throw an error
            mockU_Create.mockImplementation(() => {
                throw mockErr;
            });

            // Call the function being tested
            await newUser(
                mockRequest as Request,
                mockResponse as Response,
                mockNextFunction,
            );

            // Assert that the error handling function was called with the correct arguments
            expect(augmentAndForwardError).toHaveBeenCalledWith({
                next: mockNextFunction,
                err: mockErr,
                funcName: funcName_1,
            });
        });
    });

    // Define the name of the function being tested
    const funcName_2 = "delUser";

    // Begin a test suite for the delUser function
    describe(`${funcName} -> ${funcName_2} tests`, () => {
        // Before each test, set up the mock request object
        beforeEach(() => {
            mockRequest = {
                userCredentials: {
                    userId: mockUserId.toString(),
                },
            };
        });

        // Mock the User.findByIdAndDelete function
        const mockU_FindByIdAndDelete = User.findByIdAndDelete as jest.Mock;

        // Test the successful deletion of a user
        test(testNames.delDoc.success, async () => {
            // Mock the response of the findByIdAndDelete function
            mockU_FindByIdAndDelete.mockResolvedValue({
                ...mockNewUserData,
                _id: mockUserId,
            });

            // Call the function being tested
            await delUser(
                mockRequest as Request,
                mockResponse as Response,
                mockNextFunction,
            );

            // Set up the expected response message and payload
            mockResMessage = `the request to delete the ${collectionName}-: ${mockUserId} is successfull.`;
            mockResPayload.setSuccess(mockResMessage);

            // Assert that the Business and Product deleteMany functions were called with the correct arguments
            expect(Business.deleteMany).toHaveBeenCalledWith({
                userId: mockUserId.toString(),
            });
            expect(Product.deleteMany).toHaveBeenCalledWith({
                userId: mockUserId.toString(),
            });

            // Assert that the response status and body are as expected
            expect(mockResponse.status).toBe(200);
            expect(mockResponse.json).toStrictEqual(mockResPayload);

            // Assert that the error handling function was not called
            expect(augmentAndForwardError).not.toHaveBeenCalled();
        });

        // Test the unsuccessful deletion of a user
        test(testNames.delDoc.unsuccess, async () => {
            // Mock the response of the findByIdAndDelete function to be null
            mockU_FindByIdAndDelete.mockResolvedValue(null);

            // Call the function being tested
            await delUser(
                mockRequest as Request,
                mockResponse as Response,
                mockNextFunction,
            );

            // Set up the expected response message and payload
            mockResMessage = `the request to delete the ${collectionName}-: ${mockUserId} is not successfull.`;
            mockResPayload.setConflict(mockResMessage);

            // Assert that the Business and Product deleteMany functions were not called
            expect(Business.deleteMany).not.toHaveBeenCalled();
            expect(Product.deleteMany).not.toHaveBeenCalled();

            // Assert that the response status and body are as expected
            expect(mockResponse.status).toBe(401);
            expect(mockResponse.json).toStrictEqual(mockResPayload);

            // Assert that the error handling function was not called
            expect(augmentAndForwardError).not.toHaveBeenCalled();
        });

        // Test the handling of an error during deletion
        test(testNames.error, async () => {
            // Mock the findByIdAndDelete function to throw an error
            mockU_FindByIdAndDelete.mockImplementation(() => {
                throw mockErr;
            });

            // Call the function being tested
            await delUser(
                mockRequest as Request,
                mockResponse as Response,
                mockNextFunction,
            );

            // Assert that the error handling function was called with the correct arguments
            expect(augmentAndForwardError).toHaveBeenCalledWith({
                next: mockNextFunction,
                err: mockErr,
                funcName: funcName_2,
            });
        });
    });
});
