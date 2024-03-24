// Import Types
import type { NextFunction, Request, Response } from "express";

// Import function(s) to be tested
import { updateBusiness } from "../../../../../controllers/public/business";

// Import necessary modules
import { ObjectId } from "mongodb";
import { logger } from "../../../../../logger";
import business from "../../../../../models/business";
import augmentAndForwardError from "../../../../../utils/errorAugmenter";
import ResponsePayload from "../../../../../utils/resGenerator";
import { generateNameforManagement } from "../../testNameGenerator";

jest.mock("../../../../../models/business", () => ({
	findByIdAndUpdate: jest.fn(),
}));

jest.mock("../../../../../utils/errorAugmenter", () => ({
	__esModule: true,
	default: jest.fn(),
}));

const mockBusinessData = {
	name: "My Business",
	owner: "65e1e153ebae16a07816bc4f",
	openingTime: 1617254400,
	closingTime: 1617297600,
	phoneNumber: "1234567890",
	landline: "0987654321",
	email: "business@example.com",
	website: "https://www.example.com",
	imageUrls: [
		"https://www.example.com/image1.jpg",
		"https://www.example.com/image2.jpg",
	],
	geoLocation: [40.712776, -74.005974],
	upiId: "business@upi",
	managerPhoneNumber: "1122334455",
	managerEmail: "manager@example.com",
};

const collectionName = "Business";
const testNames = generateNameforManagement(collectionName);
const funcName = "businessManagementOps";
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

		jest.mock("../../../../../models/business", () => ({
			findByIdAndUpdate: jest.fn(),
		}));

		jest.mock("../../../../../utils/errorAugmenter", () => ({
			__esModule: true,
			default: jest.fn(),
		}));
	});

	const funcName_1 = "updateBusiness";
	describe(`${funcName} -> ${funcName_1}`, () => {
		const mockB_findByIdAndUpdate = business.findByIdAndUpdate as jest.Mock;

		const mockBusinessId = new ObjectId().toString();

		const mockLatestBusiness = {
			...mockBusinessData,
			name: "Business My",
			_id: mockBusinessId,
		};

		beforeEach(() => {
			mockRequest = {
				body: {
					latestBusiness: mockLatestBusiness,
				},
				params: {
					businessId: mockBusinessId,
				},
			};
		});

		test(testNames.updateDoc.success, async () => {
			mockB_findByIdAndUpdate.mockResolvedValue(mockLatestBusiness);

			await updateBusiness(
				mockRequest as Request,
				mockResponse as Response,
				mockNextFunction,
			);

			resMessage = `request to update ${collectionName}-: ${mockBusinessId} is successfull.`;
			resPayload.setSuccess(resMessage, mockLatestBusiness);

			expect(mockResponse.status).toBe(200);
			expect(mockResponse.json).toStrictEqual(resPayload);
			expect(augmentAndForwardError).not.toHaveBeenCalled();
		});

		test(testNames.updateDoc.unsuccess, async () => {
			mockB_findByIdAndUpdate.mockResolvedValue(null);

			await updateBusiness(
				mockRequest as Request,
				mockResponse as Response,
				mockNextFunction,
			);

			resMessage = `request to update ${collectionName}-: ${mockBusinessId} is unsuccessfull.`;
			resPayload.setConflict(resMessage);

			expect(mockResponse.status).toBe(409);
			expect(mockResponse.json).toStrictEqual(resPayload);
			expect(augmentAndForwardError).not.toHaveBeenCalled();
		});

		test(testNames.error, async () => {
			mockB_findByIdAndUpdate.mockImplementation(() => {
				throw new Error("new error");
			});

			await updateBusiness(
				mockRequest as Request,
				mockResponse as Response,
				mockNextFunction,
			);

			expect(augmentAndForwardError).toHaveBeenCalled();
		});
	});
});
