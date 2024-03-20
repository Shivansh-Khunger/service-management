// Import types
import type { NextFunction, Request, Response } from "express";
import type {
	validateBodyOptions,
	validateParamsOptions,
} from "../../../middlewares/inputValidator";

// Import function(s) to be tested
import {
	validateBody,
	validateParams,
} from "../../../middlewares/inputValidator";

// Import necessary modules
import Joi from "joi";
import CustomError from "../../../utils/customError";

// Define the name of the function suite
const funcName = "inputValidator";

// Starting the test suite for the inputValidator middleware function(s)
describe(`middleware -> ${funcName} tests`, () => {
	let mockRequest: Partial<Request>;
	let mockResponse: Partial<Response>;
	const mockNextFunction: NextFunction = jest.fn();

	afterEach(() => {
		jest.clearAllMocks();
	});

	// Define the name of the function being tested
	const funcName_1 = "validateBody";

	// Describe a block of tests for the validateBody function
	describe(`${funcName} -> ${funcName_1} tests`, () => {
		let inputOptions: validateBodyOptions;

		// Before each test, set up the input options for the validateBody function
		beforeEach(() => {
			inputOptions = {
				schema: Joi.object({
					name: Joi.string().required(), // The schema requires an object with a 'name' property that is a string
				}),
				entity: "businessData", // The entity to validate is 'businessData'
			};
		});

		// Describe a block of tests where the entity is present
		describe("with entity", () => {
			// Test that the validateBody function calls next() when validation passes
			test("if Calls next() for passed validation", () => {
				// Set up a mock request with valid businessData
				mockRequest = {
					body: {
						businessData: {
							name: "businessName",
						},
					},
				};

				// Call the validateBody function with the mock request and check that next() is called without an error
				validateBody(inputOptions)(
					mockRequest as Request,
					mockResponse as Response,
					mockNextFunction,
				);

				expect(mockNextFunction).toHaveBeenCalledTimes(1);
				expect(mockNextFunction).not.toHaveBeenCalledWith(
					expect.any(CustomError),
				);
			});

			// Test that the validateBody function calls next() with an error when validation fails
			test("if Calls next(with err) for failed validation", () => {
				// Set up a mock request with invalid businessData (empty name)
				mockRequest = {
					body: {
						businessData: {
							name: "",
						},
					},
				};

				// Call the validateBody function with the mock request and check that next() is called with a CustomError
				validateBody(inputOptions)(
					mockRequest as Request,
					mockResponse as Response,
					mockNextFunction,
				);

				expect(mockNextFunction).toHaveBeenCalledTimes(1);
				expect(mockNextFunction).toHaveBeenCalledWith(expect.any(CustomError));
			});

			// Test that the validateBody function calls next() with an error when the input type is different
			test("if Calls next(with err) for failed validation when different input type", () => {
				// Set up a mock request with invalid businessData (name is a number)
				mockRequest = {
					body: {
						businessData: {
							name: 123,
						},
					},
				};

				// Call the validateBody function with the mock request and check that next() is called with a CustomError
				validateBody(inputOptions)(
					mockRequest as Request,
					mockResponse as Response,
					mockNextFunction,
				);

				expect(mockNextFunction).toHaveBeenCalledTimes(1);
				expect(mockNextFunction).toHaveBeenCalledWith(expect.any(CustomError));
			});

			// Test that the validateBody function calls next() with an error when the entity is missing
			test("if Calls next(with err) for failed validation when missing entity", () => {
				// Set up a mock request with missing businessData
				mockRequest = {
					body: {
						businessData: {},
					},
				};

				// Call the validateBody function with the mock request and check that next() is called with a CustomError
				validateBody(inputOptions)(
					mockRequest as Request,
					mockResponse as Response,
					mockNextFunction,
				);

				expect(mockNextFunction).toHaveBeenCalledTimes(1);
				expect(mockNextFunction).toHaveBeenCalledWith(expect.any(CustomError));
			});
		});

		// Describe a block of tests where the entity is not present
		describe("without entity", () => {
			// Before each test, remove the entity from the input options
			beforeEach(() => {
				inputOptions.entity = undefined;
			});

			// Test that the validateBody function calls next() when validation passes
			test("if Calls next() for passed validation", () => {
				// Set up a mock request with valid data
				mockRequest = {
					body: {
						name: "businessName",
					},
				};

				// Call the validateBody function with the mock request and check that next() is called without an error
				validateBody(inputOptions)(
					mockRequest as Request,
					mockResponse as Response,
					mockNextFunction,
				);

				expect(mockNextFunction).toHaveBeenCalledTimes(1);
				expect(mockNextFunction).not.toHaveBeenCalledWith(
					expect.any(CustomError),
				);
			});

			// Test that the validateBody function calls next() with an error when validation fails
			test("if Calls next(with err) for failed validation", () => {
				// Set up a mock request with invalid data (empty name)
				mockRequest = {
					body: {
						name: "",
					},
				};

				// Call the validateBody function with the mock request and check that next() is called with a CustomError
				validateBody(inputOptions)(
					mockRequest as Request,
					mockResponse as Response,
					mockNextFunction,
				);

				expect(mockNextFunction).toHaveBeenCalledTimes(1);
				expect(mockNextFunction).toHaveBeenCalledWith(expect.any(CustomError));
			});

			// Test that the validateBody function calls next() with an error when the input type is different
			test("if Calls next(with err) for failed validation when different input type", () => {
				// Set up a mock request with invalid data (name is a number)
				mockRequest = {
					body: {
						name: 123,
					},
				};

				// Call the validateBody function with the mock request and check that next() is called with a CustomError
				validateBody(inputOptions)(
					mockRequest as Request,
					mockResponse as Response,
					mockNextFunction,
				);

				expect(mockNextFunction).toHaveBeenCalledTimes(1);
				expect(mockNextFunction).toHaveBeenCalledWith(expect.any(CustomError));
			});

			// Test that the validateBody function calls next() with an error when the entity is missing
			test("if Calls next(with err) for failed validation when missing entity", () => {
				// Set up a mock request with missing data
				mockRequest = {
					body: {},
				};

				// Call the validateBody function with the mock request and check that next() is called with a CustomError
				validateBody(inputOptions)(
					mockRequest as Request,
					mockResponse as Response,
					mockNextFunction,
				);

				expect(mockNextFunction).toHaveBeenCalledTimes(1);
				expect(mockNextFunction).toHaveBeenCalledWith(expect.any(CustomError));
			});
		});
	});

	// Define the name of the function being tested
	const funcName_2 = "validateParams";

	// Describe a block of tests for the validateParams function
	describe(`${funcName} -> ${funcName_2} tests`, () => {
		let inputOptions: validateParamsOptions;

		// Before each test, set up the input options for the validateParams function
		beforeEach(() => {
			inputOptions = {
				schema: Joi.object({
					businessId: Joi.string().length(24).required(), // The schema requires an object with a 'businessId' property that is a string of length 24
				}),
			};
		});

		// Test that the validateParams function calls next() when validation passes
		test("if Calls next() for passed validation", () => {
			// Set up a mock request with valid params
			mockRequest = {
				params: {
					businessId: "MEiLt}y/7{kEwGz(:5STGdgG",
				},
			};

			// Call the validateParams function with the mock request and check that next() is called without an error
			validateParams(inputOptions)(
				mockRequest as Request,
				mockResponse as Response,
				mockNextFunction,
			);

			expect(mockNextFunction).toHaveBeenCalledTimes(1);
			expect(mockNextFunction).not.toHaveBeenCalledWith(
				expect.any(CustomError),
			);
		});

		// Test that the validateParams function calls next() with an error when validation fails
		test("if Calls next(with err) for failed validation", () => {
			// Set up a mock request with invalid params (businessId is too short)
			mockRequest = {
				params: {
					businessId: "MEiLt}y/7{kEwGz(:5STGdg",
				},
			};

			// Call the validateParams function with the mock request and check that next() is called with a CustomError
			validateParams(inputOptions)(
				mockRequest as Request,
				mockResponse as Response,
				mockNextFunction,
			);

			expect(mockNextFunction).toHaveBeenCalledTimes(1);
			expect(mockNextFunction).toHaveBeenCalledWith(expect.any(CustomError));
		});

		// Test that the validateParams function calls next() with an error when validation fails due to empty input
		test("if Calls next(with err) for failed validation when empty input", () => {
			// Set up a mock request with empty params
			mockRequest = {
				params: {
					businessId: "",
				},
			};

			// Call the validateParams function with the mock request and check that next() is called with a CustomError
			validateParams(inputOptions)(
				mockRequest as Request,
				mockResponse as Response,
				mockNextFunction,
			);

			expect(mockNextFunction).toHaveBeenCalledTimes(1);
			expect(mockNextFunction).toHaveBeenCalledWith(expect.any(CustomError));
		});

		// Test that the validateParams function calls next() with an error when validation fails due to missing entity
		test("if Calls next(with err) for failed validation when missing entity", () => {
			// Set up a mock request with missing params
			mockRequest = {
				params: {},
			};

			// Call the validateParams function with the mock request and check that next() is called with a CustomError
			validateParams(inputOptions)(
				mockRequest as Request,
				mockResponse as Response,
				mockNextFunction,
			);

			expect(mockNextFunction).toHaveBeenCalledTimes(1);
			expect(mockNextFunction).toHaveBeenCalledWith(expect.any(CustomError));
		});
	});
});
