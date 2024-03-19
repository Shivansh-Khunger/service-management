// Import types
import type { NextFunction } from "express";
import type { T_idBusiness } from "../../../../models/business";

// Import the function to be tested
import ifBusinessExists from "../../../../helpers/models/businessExists";

// Import necessary modules
import CustomError from "../../../../utils/customError";
import augmentAndForwardError from "../../../../utils/errorAugmenter";
import generateName from "./testNameGenerator";

// Mock the 'exists' method of the 'business' model
jest.mock("../../../../models/business", () => ({
	exists: jest
		.fn()
		// First call to 'exists' will resolve with a business object
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

const funcName = "ifBusinessExists";
const testNames = generateName(funcName);
describe(testNames.testSuite, () => {
	const nextFunction: NextFunction = jest.fn();
	let criteria: Partial<T_idBusiness>;

	// Reset 'criteria' before each test
	beforeEach(() => {
		criteria = {};
	});

	// Test that 'ifBusinessExists' returns a valid document when given existing document details
	test(testNames.valDoc, async () => {
		criteria = { name: "businessName" };

		const res = await ifBusinessExists(nextFunction, criteria);

		expect(res).toBeTruthy();
	});

	// Test that 'ifBusinessExists' returns null when given non-existing document details
	test(testNames.invalDoc, async () => {
		criteria = { _id: "non-existentId" };

		const res = await ifBusinessExists(nextFunction, criteria);
		expect(res).toBeNull();
	});

	// Test that 'ifBusinessExists' calls 'augmentAndForwardError' when an error is thrown
	test(testNames.throwErr, async () => {
		await ifBusinessExists(nextFunction, criteria);

		expect(augmentAndForwardError).toHaveBeenCalledWith({
			next: nextFunction,
			err: new CustomError("new error"),
			funcName: funcName,
		});
	});
});
