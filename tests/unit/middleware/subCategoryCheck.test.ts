// Import types
import type { NextFunction, Request, Response } from "express";
import type { SubCategoryCheckOptions } from "../../../middlewares/subCategoryCheck";

// Import function to be tested
import checkForSubCategory from "../../../middlewares/subCategoryCheck";

// Import necessary modules
import ifSubCategoryExists from "../../../helpers/models/subCategoryExists";
import validateDocumentExistence from "../../../middlewares/helpers/valDocExistence";
import CustomError from "../../../utils/customError";
import augmentAndForwardError from "../../../utils/errorAugmenter";

// Mocking the subCategoryExists helper function
jest.mock("../../../helpers/models/subCategoryExists", () => ({
	__esModule: true,
	default: jest.fn().mockResolvedValue({ _id: "subCategoryId" }), // Mocking the default export to return a resolved promise with a subCategory ID
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

const funcName = "checkForSubCategory";

// Starting the test suite for the checkForSubCategory helper function
describe(`middleware -> ${funcName} tests`, () => {
	let mockRequest: Partial<Request>;
	let mockResponse: Partial<Response>;
	const mockNextFunction: NextFunction = jest.fn();

	let inputOptions: SubCategoryCheckOptions;

	// Creating mock versions of the helper and middleware functions
	const mockifSubCategoryExists = ifSubCategoryExists as jest.Mock;
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
		jest.mock("../../../helpers/models/subCategoryExists", () => ({
			__esModule: true,
			default: jest.fn().mockResolvedValue({ _id: "subCategoryId" }), // Mocking the default export to return a resolved promise with a subCategory ID
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

	// Testing the checkForSubCategory function when the checkIn parameter is "body"
	describe("checkIn -> body", () => {
		// Before each test, set up the input options for the checkForBusiness function
		beforeEach(() => {
			inputOptions = {
				checkIn: "body",
				bodyEntity: "subCategoryData",
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
					subCategoryData: {
						name: "mockName",
					},
				},
			};

			// Calling the checkForSubCategory function and checking if the helper and middleware functions were called with the correct arguments
			await checkForSubCategory(inputOptions)(
				mockRequest as Request,
				mockResponse as Response,
				mockNextFunction,
			);

			// Assertions to check if the helper and middleware functions were called with the correct arguments
			expect(ifSubCategoryExists).toHaveBeenCalledTimes(1);
			expect(ifSubCategoryExists).toHaveBeenCalledWith(mockNextFunction, {
				name: "mockName",
			});

			expect(validateDocumentExistence).toHaveBeenCalledTimes(1);
			expect(validateDocumentExistence).toHaveBeenCalledWith({
				nextFunction: mockNextFunction,
				docExists: { _id: "subCategoryId" },
				passIfExists: true,
				collection: "SubCategory",
				collectionAttr: "mockName",
			});
		});

		// Testing the function when the document does not exist
		test("if Calls valDocExist(with intended input) for non-existent doc", async () => {
			// Setting up the mock request body
			inputOptions.entity = "subCategoryId";
			inputOptions.key = "_id";
			mockRequest = {
				body: {
					subCategoryData: {
						subCategoryId: "subCategoryId",
					},
				},
			};

			// Making the mockifSubCategoryExists function return a resolved promise with null
			mockifSubCategoryExists.mockResolvedValueOnce(null);

			// Calling the checkForSubCategory function and checking if the helper and middleware functions were called with the correct arguments
			await checkForSubCategory(inputOptions)(
				mockRequest as Request,
				mockResponse as Response,
				mockNextFunction,
			);

			// Assertions to check if the helper and middleware functions were called with the correct arguments
			expect(ifSubCategoryExists).toHaveBeenCalledTimes(1);
			expect(ifSubCategoryExists).toHaveBeenCalledWith(mockNextFunction, {
				_id: "subCategoryId",
			});

			expect(validateDocumentExistence).toHaveBeenCalledTimes(1);
			expect(validateDocumentExistence).toHaveBeenCalledWith({
				nextFunction: mockNextFunction,
				docExists: null,
				passIfExists: true,
				collection: "SubCategory",
				collectionAttr: "subCategoryId",
			});
		});
	});

	// Testing the checkForSubCategory function when the checkIn parameter is "params"
	describe("checkIn -> params", () => {
		beforeEach(() => {
			inputOptions = {
				checkIn: "params",
				bodyEntity: null,
				entity: "subCategoryId",
				passIfExists: true,
				key: "_id",
			};
		});

		// Testing the function when the document exists
		test("if Calls valDocExist(with intended input) for existent doc", async () => {
			// Setting up the mock request params
			mockRequest = {
				params: {
					subCategoryId: "subCategoryId",
				},
			};

			// Calling the checkForSubCategory function and checking if the helper and middleware functions were called with the correct arguments
			await checkForSubCategory(inputOptions)(
				mockRequest as Request,
				mockResponse as Response,
				mockNextFunction,
			);

			// Assertions to check if the helper and middleware functions were called with the correct arguments
			expect(ifSubCategoryExists).toHaveBeenCalledTimes(1);
			expect(ifSubCategoryExists).toHaveBeenCalledWith(mockNextFunction, {
				_id: "subCategoryId",
			});

			expect(validateDocumentExistence).toHaveBeenCalledTimes(1);
			expect(validateDocumentExistence).toHaveBeenCalledWith({
				nextFunction: mockNextFunction,
				docExists: { _id: "subCategoryId" },
				passIfExists: true,
				collection: "SubCategory",
				collectionAttr: "subCategoryId",
			});
		});

		// Testing the function when the document does not exist
		test("if Calls valDocExist(with intended input) for non-existent doc", async () => {
			// Setting up the mock request params
			mockRequest = {
				params: {
					subCategoryId: "subCategoryId",
				},
			};

			// Making the mockifSubCategoryExists function return a resolved promise with null
			mockifSubCategoryExists.mockResolvedValueOnce(null);

			// Calling the checkForSubCategory function and checking if the helper and middleware functions were called with the correct arguments
			await checkForSubCategory(inputOptions)(
				mockRequest as Request,
				mockResponse as Response,
				mockNextFunction,
			);

			// Assertions to check if the helper and middleware functions were called with the correct arguments
			expect(ifSubCategoryExists).toHaveBeenCalledTimes(1);
			expect(ifSubCategoryExists).toHaveBeenCalledWith(mockNextFunction, {
				_id: "subCategoryId",
			});

			expect(validateDocumentExistence).toHaveBeenCalledTimes(1);
			expect(validateDocumentExistence).toHaveBeenCalledWith({
				nextFunction: mockNextFunction,
				docExists: null,
				passIfExists: true,
				collection: "SubCategory",
				collectionAttr: "subCategoryId",
			});
		});
	});

	// Testing the function when an error is thrown
	test("if Calls augmentAndForwardError when error thrown", async () => {
		// Setting up the mock request params
		mockRequest = {
			params: {
				subCategoryId: "subCategoryId",
			},
		};

		// Making the mockValidateDocumentExistence function throw an error
		mockValidateDocumentExistence.mockImplementation(() => {
			throw new CustomError("new error");
		});

		// Calling the checkForSubCategory function and checking if the errorAugmenter function was called with the correct arguments
		await checkForSubCategory(inputOptions)(
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
