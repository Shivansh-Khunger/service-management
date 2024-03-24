// TODO -> Check for typos in the test descriptions

// Import types
import type { NextFunction, Request, Response } from "express";
import type { CategoryCheckOptions } from "../../../middlewares/categoryCheck";

// Import function to be tested
import checkForCategory from "../../../middlewares/categoryCheck";

// Import necessary modules
import ifCategoryExists from "../../../helpers/models/categoryExists";
import validateDocumentExistence from "../../../middlewares/helpers/valDocExistence";
import CustomError from "../../../utils/customError";
import augmentAndForwardError from "../../../utils/errorAugmenter";

// Mocking the categoryExists helper function
jest.mock("../../../helpers/models/categoryExists", () => ({
	__esModule: true,
	default: jest.fn().mockResolvedValue({ _id: "categoryId" }), // Mocking the default export to return a resolved promise with a category ID
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

const funcName = "checkForCategory";

// Starting the test suite for the checkForCategory helper function
describe(`middleware -> ${funcName} tests`, () => {
	let mockRequest: Partial<Request>;
	let mockResponse: Partial<Response>;
	const mockNextFunction: NextFunction = jest.fn();

	let inputOptions: CategoryCheckOptions;

	// Creating mock versions of the helper and middleware functions
	const mockIfCategoryExists = ifCategoryExists as jest.Mock;
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
		jest.mock("../../../helpers/models/categoryExists", () => ({
			__esModule: true,
			default: jest.fn().mockResolvedValue({ _id: "categoryId" }), // Mocking the default export to return a resolved promise with a category ID
		}));

		jest.mock("../../../middlewares/helpers/valDocExistence", () => ({
			__esModule: true,
			default: jest.fn(), // Mocking the default export to be a jest function
		}));

		jest.mock("../../../utils/errorAugmenter", () => ({
			__esModule: true,
			default: jest.fn(),
		}));
	});

	// Testing the checkForCategory function when the checkIn parameter is "body"
	describe("checkIn -> body", () => {
		// Before each test, set up the input options for the checkForCategory function
		beforeEach(() => {
			inputOptions = {
				checkIn: "body",
				bodyEntity: "categoryData",
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
					categoryData: {
						name: "mockName",
					},
				},
			};

			// Calling the checkForBusiness function and checking if the helper and middleware functions were called with the correct arguments
			await checkForCategory(inputOptions)(
				mockRequest as Request,
				mockResponse as Response,
				mockNextFunction,
			);

			// Assertions to check if the helper and middleware functions were called with the correct arguments
			expect(ifCategoryExists).toHaveBeenCalledTimes(1);
			expect(ifCategoryExists).toHaveBeenCalledWith(mockNextFunction, {
				name: "mockName",
			});

			expect(validateDocumentExistence).toHaveBeenCalledTimes(1);
			expect(validateDocumentExistence).toHaveBeenCalledWith({
				nextFunction: mockNextFunction,
				docExists: { _id: "categoryId" },
				passIfExists: true,
				collection: "Category",
				collectionAttr: "mockName",
			});
		});

		// Testing the function when the document does not exist
		test("if Calls valDocExist(with intended input) for non-existent doc", async () => {
			// Setting up the mock request body
			inputOptions.entity = "categoryId";
			inputOptions.key = "_id";
			mockRequest = {
				body: {
					categoryData: {
						categoryId: "categoryId",
					},
				},
			};

			// Making the mockIfCategoryExists function return a resolved promise with null
			mockIfCategoryExists.mockResolvedValueOnce(null);

			// Calling the checkForCategory function and checking if the helper and middleware functions were called with the correct arguments
			await checkForCategory(inputOptions)(
				mockRequest as Request,
				mockResponse as Response,
				mockNextFunction,
			);

			// Assertions to check if the helper and middleware functions were called with the correct arguments
			expect(ifCategoryExists).toHaveBeenCalledTimes(1);
			expect(ifCategoryExists).toHaveBeenCalledWith(mockNextFunction, {
				_id: "categoryId",
			});

			expect(validateDocumentExistence).toHaveBeenCalledTimes(1);
			expect(validateDocumentExistence).toHaveBeenCalledWith({
				nextFunction: mockNextFunction,
				docExists: null,
				passIfExists: true,
				collection: "Category",
				collectionAttr: "categoryId",
			});
		});
	});

	// Testing the checkForCategory function when the checkIn parameter is "params"
	describe("checkIn -> params", () => {
		beforeEach(() => {
			inputOptions = {
				checkIn: "params",
				bodyEntity: null,
				entity: "categoryId",
				passIfExists: true,
				key: "_id",
			};
		});

		// Testing the function when the document exists
		test("if Calls valDocExist(with intended input) for existent doc", async () => {
			// Setting up the mock request params
			mockRequest = {
				params: {
					categoryId: "categoryId",
				},
			};

			// Calling the checkForCategory function and checking if the helper and middleware functions were called with the correct arguments
			await checkForCategory(inputOptions)(
				mockRequest as Request,
				mockResponse as Response,
				mockNextFunction,
			);

			// Assertions to check if the helper and middleware functions were called with the correct arguments
			expect(ifCategoryExists).toHaveBeenCalledTimes(1);
			expect(ifCategoryExists).toHaveBeenCalledWith(mockNextFunction, {
				_id: "categoryId",
			});

			expect(validateDocumentExistence).toHaveBeenCalledTimes(1);
			expect(validateDocumentExistence).toHaveBeenCalledWith({
				nextFunction: mockNextFunction,
				docExists: { _id: "categoryId" },
				passIfExists: true,
				collection: "Category",
				collectionAttr: "categoryId",
			});
		});

		// Testing the function when the document does not exist
		test("if Calls valDocExist(with intended input) for non-existent doc", async () => {
			// Setting up the mock request params
			mockRequest = {
				params: {
					categoryId: "categoryId",
				},
			};

			// Making the mockIfCategoryExists function return a resolved promise with null
			mockIfCategoryExists.mockResolvedValueOnce(null);

			// Calling the checkForCategory function and checking if the helper and middleware functions were called with the correct arguments
			await checkForCategory(inputOptions)(
				mockRequest as Request,
				mockResponse as Response,
				mockNextFunction,
			);

			// Assertions to check if the helper and middleware functions were called with the correct arguments
			expect(ifCategoryExists).toHaveBeenCalledTimes(1);
			expect(ifCategoryExists).toHaveBeenCalledWith(mockNextFunction, {
				_id: "categoryId",
			});

			expect(validateDocumentExistence).toHaveBeenCalledTimes(1);
			expect(validateDocumentExistence).toHaveBeenCalledWith({
				nextFunction: mockNextFunction,
				docExists: null,
				passIfExists: true,
				collection: "Category",
				collectionAttr: "categoryId",
			});
		});
	});

	// Testing the function when an error is thrown
	test("if Calls augmentAndForwardError when error thrown", async () => {
		// Setting up the mock request params
		mockRequest = {
			params: {
				categoryId: "categoryId",
			},
		};

		// Making the mockValidateDocumentExistence function throw an error
		mockValidateDocumentExistence.mockImplementation(() => {
			throw new CustomError("new error");
		});

		// Calling the checkForCategory function and checking if the errorAugmenter function was called with the correct arguments
		await checkForCategory(inputOptions)(
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
