// Import Types
import type { NextFunction, Request, Response } from "express";

// Import function(s) to be tested
import {
	delCategory,
	newCategory,
} from "../../../../../controllers/private/category";

// Import necessary modules
import { ObjectId } from "mongodb";
import { logger } from "../../../../../logger";
import category from "../../../../../models/category";
import subCategory from "../../../../../models/subCategory";
import augmentAndForwardError from "../../../../../utils/errorAugmenter";
import ResponsePayload from "../../../../../utils/resGenerator";
import { generateNameforPrimitive } from "../../testNameGenerator";

const mockNewCategoryData = {
	name: "Sample Category",
	image: "https://sample.com/image",
	description: "This is a sample category",
};

jest.mock("../../../../../models/category", () => ({
	create: jest.fn(),
	findOneAndDelete: jest.fn(),
}));

jest.mock("../../../../../models/subCategory", () => ({
	deleteMany: jest.fn(),
}));

jest.mock("../../../../../utils/errorAugmenter", () => ({
	__esModule: true,
	default: jest.fn(),
}));

const collectionName = "Category";
const testNames = generateNameforPrimitive(collectionName);
const funcName = "categoryPrimitiveOps";
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

		jest.mock("../../../../../models/category", () => ({
			create: jest.fn(),
			findOneAndDelete: jest.fn(),
		}));

		jest.mock("../../../../../utils/errorAugmenter", () => ({
			__esModule: true,
			default: jest.fn(),
		}));
	});

	const funcName_1 = "newCategory";
	describe(`${funcName} -> ${funcName_1} tests`, () => {
		const mockC_Create = category.create as jest.Mock;

		beforeEach(() => {
			mockRequest = {
				body: {
					categoryData: {
						...mockNewCategoryData,
					},
				},
			};
		});

		test(testNames.newDoc.success, async () => {
			mockC_Create.mockResolvedValue(mockNewCategoryData);

			await newCategory(
				mockRequest as Request,
				mockResponse as Response,
				mockNextFunction,
			);

			resMessage = `Request to create ${collectionName}-: ${mockNewCategoryData.name} is successfull.`;
			resPayload.setSuccess(resMessage, mockNewCategoryData);

			expect(mockResponse.status).toBe(201);
			expect(mockResponse.json).toStrictEqual(resPayload);
			expect(augmentAndForwardError).not.toHaveBeenCalled();
		});

		test(testNames.newDoc.unsuccess, async () => {
			mockC_Create.mockResolvedValue(null);

			await newCategory(
				mockRequest as Request,
				mockResponse as Response,
				mockNextFunction,
			);

			resMessage = `Request to create ${collectionName}-: ${mockNewCategoryData.name} is unsuccessfull.`;
			resPayload.setConflict(resMessage);

			expect(mockResponse.status).toBe(409);
			expect(mockResponse.json).toStrictEqual(resPayload);
			expect(augmentAndForwardError).not.toHaveBeenCalled();
		});

		test(testNames.error, async () => {
			mockC_Create.mockImplementation(() => {
				throw new Error("new error");
			});

			await newCategory(
				mockRequest as Request,
				mockResponse as Response,
				mockNextFunction,
			);

			expect(augmentAndForwardError).toHaveBeenCalled();
		});
	});

	const funcName_2 = "delCategory";
	describe(`${funcName} -> ${funcName_2} tests`, () => {
		const mockCategoryId = new ObjectId().toString();

		const SC_DeleteMany = subCategory.deleteMany as jest.Mock;

		beforeEach(() => {
			mockRequest = {
				params: {
					categoryName: mockNewCategoryData.name,
				},
			};

			SC_DeleteMany.mockResolvedValue({});
		});

		const mockC_FindOneAndDelete = category.findOneAndDelete as jest.Mock;

		test(testNames.delDoc.success, async () => {
			const mockRecievedCategoryData = {
				...mockNewCategoryData,
				_id: mockCategoryId,
			};
			mockC_FindOneAndDelete.mockResolvedValue(mockRecievedCategoryData);

			await delCategory(
				mockRequest as Request,
				mockResponse as Response,
				mockNextFunction,
			);

			resMessage = `Request to delete ${collectionName}-: ${mockNewCategoryData.name} is successfull.`;
			resPayload.setSuccess(resMessage);

			expect(mockResponse.status).toBe(200);
			expect(mockResponse.json).toStrictEqual(resPayload);
			expect(augmentAndForwardError).not.toHaveBeenCalled();
		});

		test(testNames.delDoc.unsuccess, async () => {
			mockC_FindOneAndDelete.mockResolvedValue(null);

			await delCategory(
				mockRequest as Request,
				mockResponse as Response,
				mockNextFunction,
			);

			resMessage = `Request to delete ${collectionName}-: ${mockNewCategoryData.name} is unsuccessfull.`;
			resPayload.setConflict(resMessage);

			expect(mockResponse.status).toBe(409);
			expect(mockResponse.json).toStrictEqual(resPayload);
			expect(augmentAndForwardError).not.toHaveBeenCalled();
		});

		test(testNames.error, async () => {
			mockC_FindOneAndDelete.mockImplementation(() => {
				throw new Error("new error");
			});

			await delCategory(
				mockRequest as Request,
				mockResponse as Response,
				mockNextFunction,
			);

			expect(augmentAndForwardError).toHaveBeenCalled();
		});
	});
});
