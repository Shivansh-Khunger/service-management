// Import necessary types
import type { T_idSubCategory } from "@models/subCategory";
import type { NextFunction } from "express";

// Import the function to be tested
import ifSubCategoryExists from "@helpers/models/subCategoryExists";

// Import necessary modules
import CustomError from "@utils/customError";
import augmentAndForwardError from "@utils/errorAugmenter";
import generateName from "./testNameGenerator";

// Mock the 'exists' method of the 'subCategory' model
jest.mock("@models/subCategory", () => ({
    exists: jest
        .fn()
        // First call to 'exists' will resolve with a subCategory object
        .mockResolvedValueOnce({
            _id: "businessId",
        })
        // Second call to 'exists' will resolve with null
        .mockResolvedValueOnce(null)
        // Third call to 'exists' will throw a custom error
        .mockImplementationOnce(() => {
            throw new CustomError("new error");
        }),
}));

// Mock the 'augmentAndForwardError' function
jest.mock("@utils/errorAugmenter", () => jest.fn());

const funcName = "ifSubCategoryExists";
const testNames = generateName(funcName);
describe(testNames.testSuite, () => {
    const nextFunction: NextFunction = jest.fn();
    let criteria: Partial<T_idSubCategory>;

    // Reset 'criteria' before each test
    beforeEach(() => {
        criteria = {};
    });

    // Test that 'ifSubCategoryExists' returns a valid document when given existing document details
    test(testNames.valDoc, async () => {
        criteria = { name: "subCategoryName" };

        const res = await ifSubCategoryExists(nextFunction, criteria);

        expect(res).toBeTruthy();
    });

    // Test that 'ifSubCategoryExists' returns null when given non-existing document details
    test(testNames.invalDoc, async () => {
        criteria = { _id: "non-existentId" };

        const res = await ifSubCategoryExists(nextFunction, criteria);
        expect(res).toBeNull();
    });

    // Test that 'ifSubCategoryExists' calls 'augmentAndForwardError' when an error is thrown
    test(testNames.throwErr, async () => {
        await ifSubCategoryExists(nextFunction, criteria);

        expect(augmentAndForwardError).toHaveBeenCalledWith({
            next: nextFunction,
            err: new CustomError("new error"),
            funcName: funcName,
        });
    });
});
