// Import necessary types
import type { NextFunction } from "express";
import type { T_idBusiness } from "../../../../models/business";

// Import the function to be tested
import ifCategoryExists from "../../../../helpers/models/categoryExists";

// Import necessary modules
import CustomError from "../../../../utils/customError";
import augmentAndForwardError from "../../../../utils/errorAugmenter";
import generateName from "./testNameGenerator";

// Mock the 'exists' method of the 'category' model
jest.mock("../../../../models/category", () => ({
	exists: jest
		.fn()
		// First call to 'exists' will resolve with a category object
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
jest.mock("../../../../utils/errorAugmenter", () => jest.fn());

const funcName = "ifCategoryExists";
const testNames = generateName(funcName);
describe(testNames.testSuite, () => {
	const nextFunction: NextFunction = jest.fn();
	let criteria: Partial<T_idBusiness>;

	// Reset 'criteria' before each test
	beforeEach(() => {
		criteria = {};
	});

	// Test that 'ifCategoryExists' returns a valid document when given existing document details
	test(testNames.valDoc, async () => {
		criteria = { name: "categoryName" };

		const res = await ifCategoryExists(nextFunction, criteria);

		expect(res).toBeTruthy();
	});

	// Test that 'ifCategoryExists' returns null when given non-existing document details
	test(testNames.invalDoc, async () => {
		criteria = { _id: "not existent" };

		const res = await ifCategoryExists(nextFunction, criteria);
		expect(res).toBeNull();
	});

	// Test that 'ifCategoryExists' calls 'augmentAndForwardError' when an error is thrown
	test(testNames.throwErr, async () => {
		await ifCategoryExists(nextFunction, criteria);

		expect(augmentAndForwardError).toHaveBeenCalledWith({
			next: nextFunction,
			err: new CustomError("new error"),
			funcName: funcName,
		});
	});
});
