// Import necessary types
import type { NextFunction } from "express";
import type { T_idProduct } from "../../../../models/product";

// Import the function to be tested
import ifProductExists from "../../../../helpers/models/productExists";

// Import necessary modules
import CustomError from "../../../../utils/customError";
import augmentAndForwardError from "../../../../utils/errorAugmenter";
import generateName from "./testNameGenerator";

// Mock the 'exists' method of the 'product' model
jest.mock("../../../../models/product", () => ({
	exists: jest
		.fn()
		// First call to 'exists' will resolve with a product object
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

const funcName = "ifProductExists";
const testNames = generateName(funcName);
describe(testNames.testSuite, () => {
	const nextFunction: NextFunction = jest.fn();
	let criteria: Partial<T_idProduct>;

	// Reset 'criteria' before each test
	beforeEach(() => {
		criteria = {};
	});

	// Test that 'ifProductExists' returns a valid document when given existing document details
	test(testNames.valDoc, async () => {
		criteria = { name: "productName" };

		const res = await ifProductExists(nextFunction, criteria);

		expect(res).toBeTruthy();
	});

	// Test that 'ifProductExists' returns null when given non-existing document details
	test(testNames.invalDoc, async () => {
		criteria = { _id: "non-existentId" };

		const res = await ifProductExists(nextFunction, criteria);
		expect(res).toBeNull();
	});

	// Test that 'ifProductExists' calls 'augmentAndForwardError' when an error is thrown
	test(testNames.throwErr, async () => {
		await ifProductExists(nextFunction, criteria);

		expect(augmentAndForwardError).toHaveBeenCalledWith({
			next: nextFunction,
			err: new CustomError("new error"),
			funcName: funcName,
		});
	});
});
