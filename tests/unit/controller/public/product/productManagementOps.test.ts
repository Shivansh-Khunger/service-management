// Import Types
import type { NextFunction, Request, Response } from "express";

// Import function(s) to be tested
import { updateProduct } from "../../../../../controllers/public/product";

// Import necessary modules
import { ObjectId } from "mongodb";
import { logger } from "../../../../../logger";
import product from "../../../../../models/product";
import augmentAndForwardError from "../../../../../utils/errorAugmenter";
import ResponsePayload from "../../../../../utils/resGenerator";
import { generateNameforManagement } from "../../testNameGenerator";

jest.mock("../../../../../models/product", () => ({
	findByIdAndUpdate: jest.fn(),
}));

jest.mock("../../../../../utils/errorAugmenter", () => ({
	__esModule: true,
	default: jest.fn(),
}));

const mockProductData = {
	name: "Product Name",
	brandName: "Brand Name",
	description: "Product Description",
	openingStock: 100,
	stockType: "Stock Type",
	unitMrp: 100.0,
	sellingPrice: 90.0,
	batchNo: "Batch123",
	manufacturingDate: "2022-01-01",
	expiryDate: "2023-01-01",
	attributes: [
		{ name: "color", value: "red" },
		{ name: "size", value: "large" },
	],
	images: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
	businessId: "65e221fbd9f5432ff59d3ddd",
	userId: "65e221dad9f5432ff59d3ddb",
	countryCode: "IN",
};

const collectionName = "Product";
const testNames = generateNameforManagement(collectionName);
const funcName = "productManagementOps";
describe(`controller -> ${funcName} tests`, () => {
	let mockRequest: Partial<Request>;
	let mockResponse: Partial<Response>;
	const mockNextFunction: NextFunction = jest.fn();

	let resPayload: ResponsePayload;
	let resMessage: string;
	beforeEach(() => {
		mockRequest = {};
		mockResponse = {
			status: jest.fn().mockImplementation((statusCode) => {
				mockResponse.status = statusCode;
				return mockResponse;
			}),
			json: jest.fn().mockImplementation((resPayload) => {
				mockResponse.json = resPayload
				return mockResponse;
			}),
			log: logger,
		};
		resPayload = new ResponsePayload();
		resMessage = "";
	});

	afterEach(() => {
		jest.clearAllMocks();

		jest.mock("../../../../../models/product", () => ({
			findByIdAndUpdate: jest.fn(),
		}));

		jest.mock("../../../../../utils/errorAugmenter", () => ({
			__esModule: true,
			default: jest.fn(),
		}));
	});

	const funcName_1 = "updateProduct";
	describe(`${funcName} -> ${funcName_1}`, () => {
		const mockP_findByIdAndUpdate = product.findByIdAndUpdate as jest.Mock;

		const mockProductId = new ObjectId().toString();

		const mockLatestProduct = {
			...mockProductData,
			name: "Business My",
			_id: mockProductId,
		};

		beforeEach(() => {
			mockRequest = {
				body: {
					latestProduct: mockLatestProduct,
				},
				params: {
					productId: mockProductId,
				},
			};
		});

		test(testNames.updateDoc.success, async () => {
			mockP_findByIdAndUpdate.mockResolvedValue(mockLatestProduct);

			await updateProduct(
				mockRequest as Request,
				mockResponse as Response,
				mockNextFunction,
			);

			resMessage = `Request to update ${collectionName}-: ${mockProductId} is successfull.`;
			resPayload.setSuccess(resMessage, mockLatestProduct);

			expect(mockResponse.status).toBe(200);
			expect(mockResponse.json).toStrictEqual(resPayload);
			expect(augmentAndForwardError).not.toHaveBeenCalled();
		});

		test(testNames.updateDoc.unsuccess, async () => {
			mockP_findByIdAndUpdate.mockResolvedValue(null);

			await updateProduct(
				mockRequest as Request,
				mockResponse as Response,
				mockNextFunction,
			);

			resMessage = `Request to update ${collectionName}-: ${mockProductId} is unsuccessfull.`;
			resPayload.setConflict(resMessage);

			expect(mockResponse.status).toBe(409);
			expect(mockResponse.json).toStrictEqual(resPayload);
			expect(augmentAndForwardError).not.toHaveBeenCalled();
		});

		test(testNames.error, async () => {
			mockP_findByIdAndUpdate.mockImplementation(() => {
				throw new Error("new error");
			});

			await updateProduct(
				mockRequest as Request,
				mockResponse as Response,
				mockNextFunction,
			);

			expect(augmentAndForwardError).toHaveBeenCalled();
		});
	});
});
