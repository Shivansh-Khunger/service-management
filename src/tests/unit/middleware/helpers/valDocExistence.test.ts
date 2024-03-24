// Import types
import type { valDocOptions } from "@middlewares/helpers/valDocExistence";
import type { NextFunction } from "express";

// Import the function to be tested
import validateDocumentExistence from "@middlewares/helpers/valDocExistence";

import CustomError from "@utils/customError";
// Import necessary modules
import { ObjectId } from "mongodb";

// Define the function name
const funcName = "validateDocumentExistence";

// Start the test suite for the validateDocumentExistence helper function
describe(`middleware -> helper -> ${funcName} tests`, () => {
    // Mock the next function
    const mockNextFunction: NextFunction = jest.fn();
    // Define the input options for the validateDocumentExistence function
    let inputOptions: valDocOptions;

    // Before each test, set up the input options
    beforeEach(() => {
        inputOptions = {
            nextFunction: mockNextFunction, // The next function to be called
            docExists: { _id: new ObjectId() }, // The document to check for existence
            passIfExists: true, // Whether to pass if the document exists
            collection: "collectionName", // The name of the collection
            collectionAttr: "collectionAttrVal", // The attribute of the collection
        };
    });

    // After each test, reset all mocks
    afterEach(() => {
        jest.resetAllMocks();
    });

    // Test the function when passIfExists and docExists are both truthy
    test("f Calls next() for truthy passIfExists & docExists", () => {
        // The function should not throw an error
        expect(() => {
            validateDocumentExistence(inputOptions);
        }).not.toThrow(CustomError);

        // The next function should be called once
        expect(mockNextFunction).toHaveBeenCalledTimes(1);
    });

    // Test the function when passIfExists is falsy and docExists is truthy
    test("if Throws err for falsy passIfExists & truthy docExists", () => {
        // Set passIfExists to false
        inputOptions.passIfExists = false;

        // The function should throw an error
        expect(() => {
            validateDocumentExistence(inputOptions);
        }).toThrow(CustomError);

        // The next function should not be called
        expect(mockNextFunction).not.toHaveBeenCalled();
    });

    // Test the function when passIfExists is truthy and docExists is falsy
    test("if Throws err for truthy passIfExists & falsy docExists", () => {
        // Set docExists to null
        inputOptions.docExists = null;

        expect(() => {
            validateDocumentExistence(inputOptions);
        }).toThrow(CustomError);

        expect(mockNextFunction).not.toHaveBeenCalled();
    });

    // Test the function when passIfExists and docExists are both falsy
    test("if Calls next() for falsy passIfExists & docExists", () => {
        // Set docExists to null and passIfExists to false
        inputOptions.docExists = null;
        inputOptions.passIfExists = false;

        expect(() => {
            validateDocumentExistence(inputOptions);
        }).not.toThrow(CustomError);

        expect(mockNextFunction).toHaveBeenCalledTimes(1);
    });
});
