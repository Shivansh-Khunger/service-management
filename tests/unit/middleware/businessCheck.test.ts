// Import types
import type { NextFunction, Request, Response } from "express";
import type { BusinessCheckOptions } from "../../../middlewares/businessCheck";

// Import function to be tested
import checkForBusiness from "../../../middlewares/businessCheck";

// Import necessary modules
import ifBusinessExists from "../../../helpers/models/businessExists";
import validateDocumentExistence from "../../../middlewares/helpers/valDocExistence";
import CustomError from "../../../utils/customError";
import augmentAndForwardError from "../../../utils/errorAugmenter";

// Mocking the businessExists helper function
jest.mock("../../../helpers/models/businessExists", () => ({
	__esModule: true,
	default: jest.fn().mockResolvedValue({ _id: "businessId" }), // Mocking the default export to return a resolved promise with a business ID
}));

// Mocking the validateDocumentExistence middleware helper function
jest.mock("../../../middlewares/helpers/valDocExistence", () => ({
	__esModule: true,
	default: jest.fn(), // Mocking the default export to be a jest function
}));

// Mocking the errorAugmenter utility function
jest.mock("../../../utils/errorAugmenter", () => ({
	__esModule: true,
	default: jest.fn(), // Mocking the default export to be a jest function
}));

const funcName = "checkForBusiness";

// Starting the test suite for the checkForBusiness helper function
describe(`middleware -> ${funcName} tests`, () => {
	let mockRequest: Partial<Request>;
	let mockResponse: Partial<Response>;
	const mockNextFunction: NextFunction = jest.fn();

	let inputOptions: BusinessCheckOptions;

	// Creating mock versions of the helper and middleware functions
	const mockIfBusinessExists = ifBusinessExists as jest.Mock;
	const mockValidateDocumentExistence = validateDocumentExistence as jest.Mock;

	// Setting up the mock request and response objects before each test
	beforeEach(() => {
		mockRequest = {};
		mockResponse = {
			json: jest.fn(),
		};
	});

	// Clearing all mocks and re-mocking the helper and middleware functions after each test
	afterEach(() => {
		jest.clearAllMocks();

		// Re-mocking the helper and middleware functions
		jest.mock("../../../helpers/models/businessExists", () => ({
			__esModule: true,
			default: jest.fn().mockResolvedValue({ _id: "businessId" }),
		}));

		jest.mock("../../../middlewares/helpers/valDocExistence", () => ({
			__esModule: true,
			default: jest.fn(),
		}));

		jest.mock("../../../utils/errorAugmenter", () => ({
			__esModule: true,
			default: jest.fn(),
		}));
	});

	// Testing the checkForBusiness function when the checkIn parameter is "body"
	describe("checkIn -> body", () => {
		// Before each test, set up the input options for the checkForBusiness function
		beforeEach(() => {
			inputOptions = {
				checkIn: "body",
				bodyEntity: "businessData",
				entity: "name",
				passIfExists: true,
				key: "name",
			};
		});

		// Testing the function when the document exists
		test("if Calls valDocExist(with intended input) for existent doc", async () => {
			// Setting up the mock request body
			mockRequest = {
				body: {
					businessData: {
						name: "mockName",
					},
				},
			};

			// Calling the checkForBusiness function and checking if the helper and middleware functions were called with the correct arguments
			await checkForBusiness(inputOptions)(
				mockRequest as Request,
				mockResponse as Response,
				mockNextFunction,
			);

			// Assertions to check if the helper and middleware functions were called with the correct arguments
			expect(ifBusinessExists).toHaveBeenCalledTimes(1);
			expect(ifBusinessExists).toHaveBeenCalledWith(mockNextFunction, {
				name: "mockName",
			});

			expect(validateDocumentExistence).toHaveBeenCalledTimes(1);
			expect(validateDocumentExistence).toHaveBeenCalledWith({
				nextFunction: mockNextFunction,
				docExists: { _id: "businessId" },
				passIfExists: true,
				collection: "Business",
				collectionAttr: "mockName",
			});
		});

		// Testing the function when the document does not exist
		test("if Calls valDocExist(with intended input) for non-existent doc", async () => {
			// Setting up the mock request body
			inputOptions.entity = "businessId";
			inputOptions.key = "_id";
			mockRequest = {
				body: {
					businessData: {
						businessId: "businessId",
					},
				},
			};

			// Making the mockIfBusinessExists function return a resolved promise with null
			mockIfBusinessExists.mockResolvedValueOnce(null);

			// Calling the checkForBusiness function and checking if the helper and middleware functions were called with the correct arguments
			await checkForBusiness(inputOptions)(
				mockRequest as Request,
				mockResponse as Response,
				mockNextFunction,
			);

			// Assertions to check if the helper and middleware functions were called with the correct arguments
			expect(ifBusinessExists).toHaveBeenCalledTimes(1);
			expect(ifBusinessExists).toHaveBeenCalledWith(mockNextFunction, {
				_id: "businessId",
			});

			expect(validateDocumentExistence).toHaveBeenCalledTimes(1);
			expect(validateDocumentExistence).toHaveBeenCalledWith({
				nextFunction: mockNextFunction,
				docExists: null,
				passIfExists: true,
				collection: "Business",
				collectionAttr: "businessId",
			});
		});
	});

	// Testing the checkForBusiness function when the checkIn parameter is "params"
	describe("checkIn -> params", () => {
		beforeEach(() => {
			inputOptions = {
				checkIn: "params",
				bodyEntity: null,
				entity: "businessId",
				passIfExists: true,
				key: "_id",
			};
		});

		// Testing the function when the document exists
		test("if Calls valDocExist(with intended input) for existent doc", async () => {
			// Setting up the mock request params
			mockRequest = {
				params: {
					businessId: "businessId",
				},
			};

			// Calling the checkForBusiness function and checking if the helper and middleware functions were called with the correct arguments
			await checkForBusiness(inputOptions)(
				mockRequest as Request,
				mockResponse as Response,
				mockNextFunction,
			);

			// Assertions to check if the helper and middleware functions were called with the correct arguments
			expect(ifBusinessExists).toHaveBeenCalledTimes(1);
			expect(ifBusinessExists).toHaveBeenCalledWith(mockNextFunction, {
				_id: "businessId",
			});

			expect(validateDocumentExistence).toHaveBeenCalledTimes(1);
			expect(validateDocumentExistence).toHaveBeenCalledWith({
				nextFunction: mockNextFunction,
				docExists: { _id: "businessId" },
				passIfExists: true,
				collection: "Business",
				collectionAttr: "businessId",
			});
		});

		// Testing the function when the document does not exist
		test("if Calls valDocExist(with intended input) for non-existent doc", async () => {
			// Setting up the mock request params
			mockRequest = {
				params: {
					businessId: "businessId",
				},
			};

			// Making the mockIfBusinessExists function return a resolved promise with null
			mockIfBusinessExists.mockResolvedValueOnce(null);

			// Calling the checkForBusiness function and checking if the helper and middleware functions were called with the correct arguments
			await checkForBusiness(inputOptions)(
				mockRequest as Request,
				mockResponse as Response,
				mockNextFunction,
			);

			// Assertions to check if the helper and middleware functions were called with the correct arguments
			expect(ifBusinessExists).toHaveBeenCalledTimes(1);
			expect(ifBusinessExists).toHaveBeenCalledWith(mockNextFunction, {
				_id: "businessId",
			});

			expect(validateDocumentExistence).toHaveBeenCalledTimes(1);
			expect(validateDocumentExistence).toHaveBeenCalledWith({
				nextFunction: mockNextFunction,
				docExists: null,
				passIfExists: true,
				collection: "Business",
				collectionAttr: "businessId",
			});
		});
	});

	// Testing the function when an error is thrown
	test("if Calls augmentAndForwardError when error thrown", async () => {
		// Setting up the mock request params
		mockRequest = {
			params: {
				businessId: "businessId",
			},
		};

		// Making the mockValidateDocumentExistence function throw an error
		mockValidateDocumentExistence.mockImplementation(() => {
			throw new CustomError("new error");
		});

		// Calling the checkForBusiness function and checking if the errorAugmenter function was called with the correct arguments
		await checkForBusiness(inputOptions)(
			mockRequest as Request,
			mockResponse as Response,
			mockNextFunction,
		);

		// Assertion to check if the errorAugmenter function was called with the correct arguments
		expect(augmentAndForwardError).toHaveBeenCalledWith({
			next: mockNextFunction,
			err: new CustomError("new error"),
			funcName: funcName,
			errStatus: 400,
		});
	});
});
