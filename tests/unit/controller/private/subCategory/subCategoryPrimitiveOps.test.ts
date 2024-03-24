// Import Types
import type { NextFunction, Request, Response } from "express";

// Import function(s) to be tested
import {
	delSubCategory,
	newSubCategory,
} from "../../../../../controllers/private/subCategory";

// Import necessary modules
import { ObjectId } from "mongodb";
import { logger } from "../../../../../logger";
import subCategory from "../../../../../models/subCategory";
import augmentAndForwardError from "../../../../../utils/errorAugmenter";
import ResponsePayload from "../../../../../utils/resGenerator";
import { generateNameforPrimitive } from "../../testNameGenerator";

const mockNewSubCategoryData = {
	name: "Sample SubCategory",
	image: "https://sample.com/image",
	description: "This is a sample subCategory",
	categoryId: new ObjectId(),
};

jest.mock("../../../../../models/subCategory", () => ({
	create: jest.fn(),
	findOneAndDelete: jest.fn(),
}));

jest.mock("../../../../../utils/errorAugmenter", () => ({
	__esModule: true,
	default: jest.fn(),
}));

const collectionName = "SubCategory";
const testNames = generateNameforPrimitive(collectionName);
const funcName = "subCategoryPrimitiveOps";
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

		jest.mock("../../../../../models/subCategory", () => ({
			create: jest.fn(),
			findOneAndDelete: jest.fn(),
		}));

		jest.mock("../../../../../utils/errorAugmenter", () => ({
			__esModule: true,
			default: jest.fn(),
		}));
	});

	const funcName_1 = "newSubCategory";
	describe(`${funcName} -> ${funcName_1} tests`, () => {
		const mockSC_Create = subCategory.create as jest.Mock;

		beforeEach(() => {
			mockRequest = {
				body: {
					subCategoryData: {
						...mockNewSubCategoryData,
					},
				},
			};
		});

		test(testNames.newDoc.success, async () => {
			mockSC_Create.mockResolvedValue(mockNewSubCategoryData);

			await newSubCategory(
				mockRequest as Request,
				mockResponse as Response,
				mockNextFunction,
			);

			resMessage = `Request to create ${collectionName}-: ${mockNewSubCategoryData.name} is successfull.`;
			resPayload.setSuccess(resMessage, mockNewSubCategoryData);

			expect(mockResponse.status).toBe(201);
			expect(mockResponse.json).toStrictEqual(resPayload);
			expect(augmentAndForwardError).not.toHaveBeenCalled();
		});

		test(testNames.newDoc.unsuccess, async () => {
			mockSC_Create.mockResolvedValue(null);

			await newSubCategory(
				mockRequest as Request,
				mockResponse as Response,
				mockNextFunction,
			);

			resMessage = `Request to create ${collectionName}-: ${mockNewSubCategoryData.name} is unsuccessfull.`;
			resPayload.setConflict(resMessage);

			expect(mockResponse.status).toBe(409);
			expect(mockResponse.json).toStrictEqual(resPayload);
			expect(augmentAndForwardError).not.toHaveBeenCalled();
		});

		test(testNames.error, async () => {
			mockSC_Create.mockImplementation(() => {
				throw new Error("new error");
			});

			await newSubCategory(
				mockRequest as Request,
				mockResponse as Response,
				mockNextFunction,
			);

			expect(augmentAndForwardError).toHaveBeenCalled();
		});
	});

	const funcName_2 = "delSubCategory";
	describe(`${funcName} -> ${funcName_2} tests`, () => {
		const mockSubCategoryId = new ObjectId().toString();

		beforeEach(() => {
			mockRequest = {
				params: {
					subCategoryName: mockNewSubCategoryData.name,
				},
			};
		});

		const mockSC_FindOneAndDelete = subCategory.findOneAndDelete as jest.Mock;

		test(testNames.delDoc.success, async () => {
			const mockRecievedCategoryData = {
				...mockNewSubCategoryData,
				_id: mockSubCategoryId,
			};
			mockSC_FindOneAndDelete.mockResolvedValue(mockRecievedCategoryData);

			await delSubCategory(
				mockRequest as Request,
				mockResponse as Response,
				mockNextFunction,
			);

			resMessage = `Request to delete ${collectionName}-: ${mockNewSubCategoryData.name} is successfull.`;
			resPayload.setSuccess(resMessage);

			expect(mockResponse.status).toBe(200);
			expect(mockResponse.json).toStrictEqual(resPayload);
			expect(augmentAndForwardError).not.toHaveBeenCalled();
		});

		test(testNames.delDoc.unsuccess, async () => {
			mockSC_FindOneAndDelete.mockResolvedValue(null);

			await delSubCategory(
				mockRequest as Request,
				mockResponse as Response,
				mockNextFunction,
			);

			resMessage = `Request to delete ${collectionName}-: ${mockNewSubCategoryData.name} is unsuccessfull.`;
			resPayload.setConflict(resMessage);

			expect(mockResponse.status).toBe(409);
			expect(mockResponse.json).toStrictEqual(resPayload);
			expect(augmentAndForwardError).not.toHaveBeenCalled();
		});

		test(testNames.error, async () => {
			mockSC_FindOneAndDelete.mockImplementation(() => {
				throw new Error("new error");
			});

			await delSubCategory(
				mockRequest as Request,
				mockResponse as Response,
				mockNextFunction,
			);

			expect(augmentAndForwardError).toHaveBeenCalled();
		});
	});
});
