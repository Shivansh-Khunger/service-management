// Import types
import type { NextFunction, Request, Response } from "express";

// Import function to be tested
import checkForDevice from "@middlewares/deviceCheck";

// Define the name of the function being tested
const funcName = "checkForDevice";

// Begin a test suite for the checkForDevice middleware function
describe(`middleware -> ${funcName} tests`, () => {
    // Declare variables for a mock request, response, and next function
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    const mockNextFunction: NextFunction = jest.fn();

    // Before each test, initialize the mock request and response
    beforeEach(() => {
        mockRequest = {
            headers: {
                "user-agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
            },
        };
        mockResponse = {};
    });

    // After each test, clear all mocks
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test that checkImei is set to true when the device is a tablet
    test("if sets checkImei to true when device is tablet", () => {
        // Set the user-agent string to represent a tablet
        mockRequest = {
            headers: {
                "user-agent":
                    "Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1",
            },
        };

        // Call the middleware function with the mock request, response, and next function
        checkForDevice(
            mockRequest as Request,
            mockResponse as Response,
            mockNextFunction,
        );

        // Assert that checkImei was set to true and the next function was called once
        expect(mockRequest.flags?.checkImei).toBeTruthy();
        expect(mockNextFunction).toHaveBeenCalledTimes(1);
    });

    // Test that checkImei is set to true when the device is a mobile
    test("if sets checkImei to true when device is mobile", () => {
        // Set the user-agent string to represent a mobile
        mockRequest = {
            headers: {
                "user-agent":
                    "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1",
            },
        };

        // Call the middleware function with the mock request, response, and next function
        checkForDevice(
            mockRequest as Request,
            mockResponse as Response,
            mockNextFunction,
        );

        // Assert that checkImei was set to true and the next function was called once
        expect(mockRequest.flags?.checkImei).toBeTruthy();
        expect(mockNextFunction).toHaveBeenCalledTimes(1);
    });

    // Test that checkImei is set to false when the device is neither a mobile nor a tablet
    test("if sets checkImei to false when device is any other than mobile or tablet", () => {
        // Call the middleware function with the mock request, response, and next function
        checkForDevice(
            mockRequest as Request,
            mockResponse as Response,
            mockNextFunction,
        );

        // Assert that checkImei was set to false and the next function was called once
        expect(mockRequest.flags?.checkImei).toBeFalsy();
        expect(mockNextFunction).toHaveBeenCalledTimes(1);
    });
});
