// Import types
import type { NextFunction, Request, Response } from "express";
import type { DealCheckOptions } from "../../../middlewares/dealCheck";

// Import function to be tested
import checkForDeal from "../../../middlewares/dealCheck";

// Import necessary modules
import ifDealExists from "../../../helpers/models/dealExists";
import validateDocumentExistence from "../../../middlewares/helpers/valDocExistence";
import CustomError from "../../../utils/customError";
import augmentAndForwardError from "../../../utils/errorAugmenter";

// Mocking the dealExists helper function
jest.mock("../../../helpers/models/dealExists", () => ({
	__esModule: true,
	default: jest.fn().mockResolvedValue({ _id: "dealId" }), // Mocking the default export to return a resolved promise with a deal ID
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

const funcName = "checkForDeal";

// Starting the test suite for the checkForDeal helper function
describe(`middleware -> ${funcName} tests`, () => {
	let mockRequest: Partial<Request>;
	let mockResponse: Partial<Response>;
	const mockNextFunction: NextFunction = jest.fn();

	let inputOptions: DealCheckOptions;

	// Creating mock versions of the helper and middleware functions
	const mockIfDealExists = ifDealExists as jest.Mock;
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
		jest.mock("../../../helpers/models/dealExists", () => ({
			__esModule: true,
			default: jest.fn().mockResolvedValue({ _id: "dealId" }), // Mocking the default export to return a resolved promise with a deal ID
		}));

		jest.mock("../../../middlewares/helpers/valDocExistence", () => ({
			__esModule: true,
			default: jest.fn(), // Mocking the default export to be a jest function
		}));

		jest.mock("../../../utils/errorAugmenter", () => ({
			__esModule: true,
			default: jest.fn(), // Mocking the default export to be a jest function
		}));
	});

	// Testing the checkForDeal middleware function when the checkIn option is "body"
	describe("checkIn -> body", () => {
		// Before each test, set up the input options for the checkForDeal function
		beforeEach(() => {
			inputOptions = {
				checkIn: "body",
				bodyEntity: "dealData",
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
					dealData: {
						name: "mockName",
					},
				},
			};

			// Calling the checkForDeal function and checking if the helper and middleware functions were called with the correct arguments
			await checkForDeal(inputOptions)(
				mockRequest as Request,
				mockResponse as Response,
				mockNextFunction,
			);

			// Assertions to check if the helper and middleware functions were called with the correct arguments
			expect(ifDealExists).toHaveBeenCalledTimes(1);
			expect(ifDealExists).toHaveBeenCalledWith(mockNextFunction, {
				name: "mockName",
			});

			expect(validateDocumentExistence).toHaveBeenCalledTimes(1);
			expect(validateDocumentExistence).toHaveBeenCalledWith({
				nextFunction: mockNextFunction,
				docExists: { _id: "dealId" },
				passIfExists: true,
				collection: "Deal",
				collectionAttr: "mockName",
			});
		});

		// Testing the function when the document does not exist
		test("if Calls valDocExist(with intended input) for non-existent doc", async () => {
			// Setting up the mock request body
			inputOptions.entity = "dealId";
			inputOptions.key = "_id";
			mockRequest = {
				body: {
					dealData: {
						dealId: "dealId",
					},
				},
			};

			// Making the mockIfDealExists function return a resolved promise with null
			mockIfDealExists.mockResolvedValueOnce(null);

			// Calling the checkForDeal function and checking if the helper and middleware functions were called with the correct arguments
			await checkForDeal(inputOptions)(
				mockRequest as Request,
				mockResponse as Response,
				mockNextFunction,
			);

			// Assertions to check if the helper and middleware functions were called with the correct arguments
			expect(ifDealExists).toHaveBeenCalledTimes(1);
			expect(ifDealExists).toHaveBeenCalledWith(mockNextFunction, {
				_id: "dealId",
			});

			expect(validateDocumentExistence).toHaveBeenCalledTimes(1);
			expect(validateDocumentExistence).toHaveBeenCalledWith({
				nextFunction: mockNextFunction,
				docExists: null,
				passIfExists: true,
				collection: "Deal",
				collectionAttr: "dealId",
			});
		});
	});

	// Testing the checkForDeal function when the checkIn parameter is "params"
	describe("checkIn -> params", () => {
		beforeEach(() => {
			inputOptions = {
				checkIn: "params",
				bodyEntity: null,
				entity: "dealId",
				passIfExists: true,
				key: "_id",
			};
		});

		// Testing the function when the document exists
		test("if Calls valDocExist(with intended input) for existent doc", async () => {
			// Setting up the mock request params
			mockRequest = {
				params: {
					dealId: "dealId",
				},
			};

			// Calling the checkForDeal function and checking if the helper and middleware functions were called with the correct arguments
			await checkForDeal(inputOptions)(
				mockRequest as Request,
				mockResponse as Response,
				mockNextFunction,
			);

			// Assertions to check if the helper and middleware functions were called with the correct arguments
			expect(ifDealExists).toHaveBeenCalledTimes(1);
			expect(ifDealExists).toHaveBeenCalledWith(mockNextFunction, {
				_id: "dealId",
			});

			expect(validateDocumentExistence).toHaveBeenCalledTimes(1);
			expect(validateDocumentExistence).toHaveBeenCalledWith({
				nextFunction: mockNextFunction,
				docExists: { _id: "dealId" },
				passIfExists: true,
				collection: "Deal",
				collectionAttr: "dealId",
			});
		});

		// Testing the function when the document does not exist
		test("if Calls valDocExist(with intended input) for non-existent doc", async () => {
			// Setting up the mock request params
			mockRequest = {
				params: {
					dealId: "dealId",
				},
			};

			// Making the mockIfDealExists function return a resolved promise with null
			mockIfDealExists.mockResolvedValueOnce(null);

			// Calling the checkForDeal function and checking if the helper and middleware functions were called with the correct arguments
			await checkForDeal(inputOptions)(
				mockRequest as Request,
				mockResponse as Response,
				mockNextFunction,
			);

			// Assertions to check if the helper and middleware functions were called with the correct arguments
			expect(ifDealExists).toHaveBeenCalledTimes(1);
			expect(ifDealExists).toHaveBeenCalledWith(mockNextFunction, {
				_id: "dealId",
			});

			expect(validateDocumentExistence).toHaveBeenCalledTimes(1);
			expect(validateDocumentExistence).toHaveBeenCalledWith({
				nextFunction: mockNextFunction,
				docExists: null,
				passIfExists: true,
				collection: "Deal",
				collectionAttr: "dealId",
			});
		});
	});

	// Testing the function when an error is thrown
	test("if Calls augmentAndForwardError when error thrown", async () => {
		// Setting up the mock request params
		mockRequest = {
			params: {
				dealId: "dealId",
			},
		};

		// Making the mockValidateDocumentExistence function throw an error
		mockValidateDocumentExistence.mockImplementation(() => {
			throw new CustomError("new error");
		});

		// Calling the checkForDeal function and checking if the errorAugmenter function was called with the correct arguments
		await checkForDeal(inputOptions)(
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
