// Import Types
import type { NextFunction, Request, Response } from "express";

// Import function(s) to be tested
import { delProduct, newProduct } from "../../../../../controllers/public/product";

// Import necessary modules
import { ObjectId } from "mongodb";
import { logger } from "../../../../../logger";
import product from "../../../../../models/product";
import augmentAndForwardError from "../../../../../utils/errorAugmenter";
import ResponsePayload from "../../../../../utils/resGenerator";
import { generateNameforPrimitive } from "../../testNameGenerator";

const mockNewProductData = {
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

jest.mock("../../../../../models/product", () => ({
	create: jest.fn(),
	findByIdAndDelete: jest.fn(),
}));

jest.mock("../../../../../utils/errorAugmenter", () => ({
	__esModule: true,
	default: jest.fn(),
}));

const collectionName = "Product";
const testNames = generateNameforPrimitive(collectionName);
const funcName = "productPrimitiveOps";
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
				mockResponse.json = resPayload;
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
			create: jest.fn(),
			findByIdAndDelete: jest.fn(),
		}));

		jest.mock("../../../../../utils/errorAugmenter", () => ({
			__esModule: true,
			default: jest.fn(),
		}));
	});

	const funcName_1 = "newProduct";
	describe(`${funcName} -> ${funcName_1} tests`, () => {
		const mockP_Create = product.create as jest.Mock;

		beforeEach(() => {
			mockRequest = {
				body: {
					productData: {
						...mockNewProductData,
					},
				},
			};
		});

		test(testNames.newDoc.success, async () => {
			mockP_Create.mockResolvedValue(mockNewProductData);

			await newProduct(
				mockRequest as Request,
				mockResponse as Response,
				mockNextFunction,
			);

			resMessage = `Request to create ${collectionName}-: ${mockNewProductData.name} under business-: ${mockNewProductData.businessId} is successfull.`;
			resPayload.setSuccess(resMessage, mockNewProductData);

			expect(mockResponse.status).toBe(201);
			expect(mockResponse.json).toStrictEqual(resPayload);
			expect(augmentAndForwardError).not.toHaveBeenCalled();
		});

		test(testNames.newDoc.unsuccess, async () => {
			mockP_Create.mockResolvedValue(null);

			await newProduct(
				mockRequest as Request,
				mockResponse as Response,
				mockNextFunction,
			);

			resMessage = `Request to create ${collectionName}-: ${mockNewProductData.name} under business-: ${mockNewProductData.businessId} is unsuccessfull.`;
			resPayload.setConflict(resMessage);

			expect(mockResponse.status).toBe(409);
			expect(mockResponse.json).toStrictEqual(resPayload);
			expect(augmentAndForwardError).not.toHaveBeenCalled();
		});

		test(testNames.error, async () => {
			mockP_Create.mockImplementation(() => {
				throw new Error("new error");
			});

			await newProduct(
				mockRequest as Request,
				mockResponse as Response,
				mockNextFunction,
			);

			expect(augmentAndForwardError).toHaveBeenCalled();
		});
	});

	const funcName_2 = "delProduct";
	describe(`${funcName} -> ${funcName_2} tests`, () => {
		const mockProductId = new ObjectId().toString();

		beforeEach(() => {
			mockRequest = {
				params: {
					productId: mockProductId,
				},
			};
		});

		const mockP_FindByIdAndDelete = product.findByIdAndDelete as jest.Mock;

		test(testNames.delDoc.success, async () => {
			const mockRecievedProductData = {
				...mockNewProductData,
				_id: mockProductId,
			};
			mockP_FindByIdAndDelete.mockResolvedValue(mockRecievedProductData);

			await delProduct(
				mockRequest as Request,
				mockResponse as Response,
				mockNextFunction,
			);

			resMessage = `Request to delete ${collectionName}-: ${mockProductId} is successfull.`;
			resPayload.setSuccess(resMessage);

			expect(mockResponse.status).toBe(200);
			expect(mockResponse.json).toStrictEqual(resPayload);
			expect(augmentAndForwardError).not.toHaveBeenCalled();
		});

		test(testNames.delDoc.unsuccess, async () => {
			mockP_FindByIdAndDelete.mockResolvedValue(null);

			await delProduct(
				mockRequest as Request,
				mockResponse as Response,
				mockNextFunction,
			);

			resMessage = `Request to delete ${collectionName}-: ${mockProductId} is unsuccessfull.`;
			resPayload.setConflict(resMessage);

			expect(mockResponse.status).toBe(409);
			expect(mockResponse.json).toStrictEqual(resPayload);
			expect(augmentAndForwardError).not.toHaveBeenCalled();
		});

		test(testNames.error, async () => {
			mockP_FindByIdAndDelete.mockImplementation(() => {
				throw new Error("new error");
			});
			await delProduct(
				mockRequest as Request,
				mockResponse as Response,
				mockNextFunction,
			);

			expect(augmentAndForwardError).toHaveBeenCalled();
		});
	});
});
