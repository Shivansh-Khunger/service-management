// Import types
import type { Response } from "express";

// Import function(s) to be tested
import { insertJWT } from "@helpers/createCookie";

// Define the function name for logging purposes
const funcName = "insertJWT";

// Start a test suite for the helper function insertJWT
describe(`helper -> ${funcName} tests`, () => {
    // Declare a variable to hold the mock response object
    let mockResponse: Partial<Response>;

    // Define a mock max age for the cookie
    const mockMaxAge = 1000 * 60 * 5;

    // Before each test, initialize the mock response object
    beforeEach(() => {
        mockResponse = {
            // Mock the cookie method of the response object
            cookie: jest.fn(),
        };
    });

    // Test if the insertJWT function calls res.cookie with appropriate arguments
    test("if Calls res.cookie with appropriate arguments", () => {
        // Define a field and fieldValue for the test
        const field = "field";
        const fieldValue = "value";

        // Call the insertJWT function with the mock response and test parameters
        insertJWT({
            res: mockResponse as Response,
            field: "field",
            fieldValue: "value",
            maxAge: mockMaxAge,
        });

        // Check if the cookie method was called with the correct arguments
        expect(mockResponse.cookie).toHaveBeenCalledWith(field, fieldValue, {
            maxAge: mockMaxAge,
            httpOnly: true,
            secure: true,
            signed: true,
        });
    });
});
