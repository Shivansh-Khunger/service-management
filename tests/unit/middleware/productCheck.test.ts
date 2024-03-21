// Import types
import type { NextFunction, Request, Response } from "express";
import type { ProductCheckOptions } from "../../../middlewares/productCheck";

// Import function to be tested
import checkForProduct from "../../../middlewares/productCheck";

// Import necessary modules
import ifProductExists from "../../../helpers/models/productExists";
import validateDocumentExistence from "../../../middlewares/helpers/valDocExistence";
import CustomError from "../../../utils/customError";
import augmentAndForwardError from "../../../utils/errorAugmenter";

// Mocking the productExists helper function
jest.mock("../../../helpers/models/productExists", () => ({
	__esModule: true,
	default: jest.fn().mockResolvedValue({ _id: "productId" }), // Mocking the default export to return a resolved promise with a product ID
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

const funcName = "checkForProduct";

// Starting the test suite for the checkForProduct helper function
describe(`middleware -> ${funcName} tests`, () => {
	let mockRequest: Partial<Request>;
	let mockResponse: Partial<Response>;
	const mockNextFunction: NextFunction = jest.fn();

	let inputOptions: ProductCheckOptions;

	// Creating mock versions of the helper and middleware functions
	const mockIfProductExists = ifProductExists as jest.Mock;
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
		jest.mock("../../../helpers/models/productExists", () => ({
			__esModule: true,
			default: jest.fn().mockResolvedValue({ _id: "productId" }), // Mocking the default export to return a resolved promise with a product ID
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

	// Testing the checkForProduct function when the checkIn parameter is "body"
	describe("checkIn -> body", () => {
		// Before each test, set up the input options for the checkForProduct function
		beforeEach(() => {
			inputOptions = {
				checkIn: "body",
				bodyEntity: "productData",
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
					productData: {
						name: "mockName",
					},
				},
			};

			// Calling the checkForProduct function and checking if the helper and middleware functions were called with the correct arguments
			await checkForProduct(inputOptions)(
				mockRequest as Request,
				mockResponse as Response,
				mockNextFunction,
			);

			// Assertions to check if the helper and middleware functions were called with the correct arguments
			expect(ifProductExists).toHaveBeenCalledTimes(1);
			expect(ifProductExists).toHaveBeenCalledWith(mockNextFunction, {
				name: "mockName",
			});

			expect(validateDocumentExistence).toHaveBeenCalledTimes(1);
			expect(validateDocumentExistence).toHaveBeenCalledWith({
				nextFunction: mockNextFunction,
				docExists: { _id: "productId" },
				passIfExists: true,
				collection: "Product",
				collectionAttr: "mockName",
			});
		});

		// Testing the function when the document does not exist
		test("if Calls valDocExist(with intended input) for non-existent doc", async () => {
			// Setting up the mock request body
			inputOptions.entity = "productId";
			inputOptions.key = "_id";
			mockRequest = {
				body: {
					productData: {
						productId: "productId",
					},
				},
			};

			// Making the mockIfProductExists function return a resolved promise with null
			mockIfProductExists.mockResolvedValueOnce(null);

			// Calling the checkForProduct function and checking if the helper and middleware functions were called with the correct arguments
			await checkForProduct(inputOptions)(
				mockRequest as Request,
				mockResponse as Response,
				mockNextFunction,
			);

			// Assertions to check if the helper and middleware functions were called with the correct arguments
			expect(ifProductExists).toHaveBeenCalledTimes(1);
			expect(ifProductExists).toHaveBeenCalledWith(mockNextFunction, {
				_id: "productId",
			});

			expect(validateDocumentExistence).toHaveBeenCalledTimes(1);
			expect(validateDocumentExistence).toHaveBeenCalledWith({
				nextFunction: mockNextFunction,
				docExists: null,
				passIfExists: true,
				collection: "Product",
				collectionAttr: "productId",
			});
		});
	});

	// Testing the checkForProduct function when the checkIn parameter is "params"
	describe("checkIn -> params", () => {
		beforeEach(() => {
			inputOptions = {
				checkIn: "params",
				bodyEntity: null,
				entity: "productId",
				passIfExists: true,
				key: "_id",
			};
		});

		// Testing the function when the document exists
		test("if Calls valDocExist(with intended input) for existent doc", async () => {
			// Setting up the mock request params
			mockRequest = {
				params: {
					productId: "productId",
				},
			};

			// Calling the checkForProduct function and checking if the helper and middleware functions were called with the correct arguments
			await checkForProduct(inputOptions)(
				mockRequest as Request,
				mockResponse as Response,
				mockNextFunction,
			);

			// Assertions to check if the helper and middleware functions were called with the correct arguments
			expect(ifProductExists).toHaveBeenCalledTimes(1);
			expect(ifProductExists).toHaveBeenCalledWith(mockNextFunction, {
				_id: "productId",
			});

			expect(validateDocumentExistence).toHaveBeenCalledTimes(1);
			expect(validateDocumentExistence).toHaveBeenCalledWith({
				nextFunction: mockNextFunction,
				docExists: { _id: "productId" },
				passIfExists: true,
				collection: "Product",
				collectionAttr: "productId",
			});
		});

		// Testing the function when the document does not exist
		test("if Calls valDocExist(with intended input) for non-existent doc", async () => {
			// Setting up the mock request params
			mockRequest = {
				params: {
					productId: "productId",
				},
			};

			// Making the mockIfProductExists function return a resolved promise with null
			mockIfProductExists.mockResolvedValueOnce(null);

			// Calling the checkForProduct function and checking if the helper and middleware functions were called with the correct arguments
			await checkForProduct(inputOptions)(
				mockRequest as Request,
				mockResponse as Response,
				mockNextFunction,
			);

			// Assertions to check if the helper and middleware functions were called with the correct arguments
			expect(ifProductExists).toHaveBeenCalledTimes(1);
			expect(ifProductExists).toHaveBeenCalledWith(mockNextFunction, {
				_id: "productId",
			});

			expect(validateDocumentExistence).toHaveBeenCalledTimes(1);
			expect(validateDocumentExistence).toHaveBeenCalledWith({
				nextFunction: mockNextFunction,
				docExists: null,
				passIfExists: true,
				collection: "Product",
				collectionAttr: "productId",
			});
		});
	});

	// Testing the function when an error is thrown
	test("if Calls augmentAndForwardError when error thrown", async () => {
		// Setting up the mock request params
		mockRequest = {
			params: {
				productId: "productId",
			},
		};

		// Making the mockValidateDocumentExistence function throw an error
		mockValidateDocumentExistence.mockImplementation(() => {
			throw new CustomError("new error");
		});

		// Calling the checkForProduct function and checking if the errorAugmenter function was called with the correct arguments
		await checkForProduct(inputOptions)(
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
