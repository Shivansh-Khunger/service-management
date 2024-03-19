// Import types
import type { NextFunction } from "express";
import type { T_idDeal } from "../../../../models/deal";

// Import the function to be tested
import ifDealExists from "../../../../helpers/models/dealExists";

// Import necessary modules
import CustomError from "../../../../utils/customError";
import augmentAndForwardError from "../../../../utils/errorAugmenter";
import generateName from "./testNameGenerator";


// Mock the 'exists' method of the 'deal' model
jest.mock("../../../../models/deal", () => ({
	exists: jest
		.fn()
		// First call to 'exists' will resolve with a deal object
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

const funcName = "ifDealExists";
const testNames = generateName(funcName);
describe(testNames.testSuite, () => {
	const nextFunction: NextFunction = jest.fn();
	let criteria: Partial<T_idDeal>;

	// Reset 'criteria' before each test
	beforeEach(() => {
		criteria = {};
	});

	// Test that 'ifDealExists' returns a valid document when given existing document details
	test(testNames.valDoc, async () => {
		criteria = { name: "RAM LAL" };

		const res = await ifDealExists(nextFunction, criteria);

		expect(res).toBeTruthy();
	});

	// Test that 'ifDealExists' returns null when given non-existing document details
	test(testNames.invalDoc, async () => {
		criteria = { _id: "non-existentId" };

		const res = await ifDealExists(nextFunction, criteria);
		expect(res).toBeNull();
	});

	// Test that 'ifDealExists' calls 'augmentAndForwardError' when an error is thrown
	test(testNames.throwErr, async () => {
		await ifDealExists(nextFunction, criteria);

		expect(augmentAndForwardError).toHaveBeenCalledWith({
			next: nextFunction,
			err: new CustomError("new error"),
			funcName: funcName,
		});
	});
});
