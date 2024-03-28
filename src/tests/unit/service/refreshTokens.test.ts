// Import Types
import type { NextFunction, Request, Response } from 'express';

// Import function(s) to be tested
import { assignNewRefreshToken } from '@services/refreshTokens';

// Import necessary modules
import { insertJWT } from '@helpers/createCookie';
import createToken from '@helpers/createTokens';
import isRefreshTokenValid from '@helpers/validRefreshToken';
import { logger } from '@logger';
import CustomError from '@utils/customError';
import augmentAndForwardError from '@utils/errorAugmenter';
import ResponsePayload from '@utils/resGenerator';

// Mock the 'isRefreshTokenValid' helper function
jest.mock('@helpers/validRefreshToken', () => ({
    __esModule: true, // Needed when mocking ES6 modules
    default: jest.fn(),
}));

// Mock the 'insertJWT' helper function
jest.mock('@helpers/createCookie', () => ({
    insertJWT: jest.fn(),
}));

// Mock the 'augmentAndForwardError' utility function
jest.mock('@utils/errorAugmenter', () => ({
    __esModule: true, // Needed when mocking ES6 modules
    default: jest.fn(),
}));

// Mock the 'createToken' helper function
jest.mock('@helpers/createTokens', () => ({
    __esModule: true, // Needed when mocking ES6 modules
    default: jest.fn(),
}));

// Define the function name for logging purposes
const funcName = 'assignNewRefreshToken';

// Start a test suite for the assignNewRefreshToken service function
describe(`service -> ${funcName} tests`, () => {
    // Declare variables to hold the mock request, response, and next function
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    const mockNextFunction: NextFunction = jest.fn();
    let mockResPayload: ResponsePayload;

    // Define a mock decoded JWT
    const mockJWTDecode = {
        sub: 'userId',
        userData: {
            userName: 'mockName',
            userEmail: 'mockEmail',
        },
    };

    // Before each test, initialize the mock request and response
    beforeEach(() => {
        mockRequest = {
            signedCookies: {
                refreshToken: 'mockRefreshToken',
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

        // Initialize the mock response payload
        mockResPayload = new ResponsePayload();
    });

    // Create mocks for the 'isRefreshTokenValid' and 'createToken' functions
    const mockisRefreshTokenValid = isRefreshTokenValid as jest.Mock;
    const mockCreateToken = createToken as jest.Mock;

    // Test if the function sends the appropriate response when a new refresh token is assigned
    test('if Sends appropiate response when new refresh token is appropiatly assigned', async () => {
        // Define a mock token
        const mockToken = 'mockToken';

        // Make the 'isRefreshTokenValid' function return the mock decoded JWT
        mockisRefreshTokenValid.mockReturnValue(mockJWTDecode);

        // Make the 'createToken' function return the mock token
        mockCreateToken.mockReturnValue(mockToken);

        // Call the function with the mock request, response, and next function
        await assignNewRefreshToken(
            mockRequest as Request,
            mockResponse as Response,
            mockNextFunction,
        );

        // Define the max age for the refresh token cookie (1 week)
        const userRefreshCookieMaxAge = 1000 * 60 * 60 * 24 * 7;

        // Check if the function called 'insertJWT' with the expected parameters
        expect(insertJWT).toHaveBeenCalledWith({
            res: mockResponse,
            field: 'refreshToken',
            fieldValue: mockToken,
            maxAge: userRefreshCookieMaxAge,
        });

        // Define the success message for the response
        const mockResMessage =
            'Request to refresh the refresh token is successfull.';

        // Set the success message in the mock response payload
        mockResPayload.setSuccess(mockResMessage);

        // Check if the function set the status and JSON of the response as expected
        expect(mockResponse.status).toBe(200);
        expect(mockResponse.json).toStrictEqual(mockResPayload);

        // Check if the function did not call 'augmentAndForwardError'
        expect(augmentAndForwardError).not.toHaveBeenCalled();
    });

    // Test if the function calls 'augmentAndForwardError' when an error is thrown
    test('if Calls augmentAndForwardError when an error is thrown', async () => {
        // Define a mock error
        const mockErr = new CustomError('mock Error');

        // Make the 'isRefreshTokenValid' function throw the mock error
        mockisRefreshTokenValid.mockImplementation(() => {
            throw mockErr;
        });

        // Call the function with the mock request, response, and next function
        await assignNewRefreshToken(
            mockRequest as Request,
            mockResponse as Response,
            mockNextFunction,
        );

        // Check if the function called 'augmentAndForwardError' with the expected parameters
        expect(augmentAndForwardError).toHaveBeenCalledWith({
            next: mockNextFunction,
            err: mockErr,
            funcName: funcName,
        });
    });
});
