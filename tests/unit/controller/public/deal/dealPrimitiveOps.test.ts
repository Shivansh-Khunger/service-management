// Import Types
import type { NextFunction, Request, Response } from "express";

// Import function(s) to be tested
import { delDeal, newDeal } from "../../../../../controllers/public/deals";

// Import necessary modules
import { ObjectId } from "mongodb";
import { logger } from "../../../../../logger";
import deal from "../../../../../models/deal";
import augmentAndForwardError from "../../../../../utils/errorAugmenter";
import ResponsePayload from "../../../../../utils/resGenerator";
import { generateNameforPrimitive } from "../../testNameGenerator";

const mockNewDealData = {
	name: "Sample Deal",
	startDate: new Date(),
	endDate: new Date(),
	description: "This is a sample deal",
	stockType: "In Stock",
	videoUrl: "https://sample.com/video",
	images: ["https://sample.com/image1", "https://sample.com/image2"],
	upiAddress: "sample@upi",
	paymentMode: "UPI",
	ifReturn: true,
	deliveryType: "Home Delivery",
	returnPolicyDescription: "Return within 10 days",
	marketPrice: 1000,
	offerPrice: 800,
	quantity: 10,
	ifHomeDelivery: true,
	freeHomeDeliveryKm: 5,
	costPerKm: 10,
	ifPublicPhone: true,
	ifSellingOnline: true,
	productId: new ObjectId(),
	businessId: new ObjectId(),
	userId: new ObjectId(),
};

jest.mock("../../../../../models/deal", () => ({
	create: jest.fn(),
	findByIdAndDelete: jest.fn(),
}));

jest.mock("../../../../../utils/errorAugmenter", () => ({
	__esModule: true,
	default: jest.fn(),
}));

const collectionName = "Deal";
const testNames = generateNameforPrimitive(collectionName);
const funcName = "dealPrimitiveOps";
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

		jest.mock("../../../../../models/deal", () => ({
			create: jest.fn(),
			findByIdAndDelete: jest.fn(),
		}));

		jest.mock("../../../../../utils/errorAugmenter", () => ({
			__esModule: true,
			default: jest.fn(),
		}));
	});

	const funcName_1 = "newDeal";
	describe(`${funcName} -> ${funcName_1} tests`, () => {
		const mockD_Create = deal.create as jest.Mock;

		beforeEach(() => {
			mockRequest = {
				body: {
					dealData: {
						...mockNewDealData,
					},
				},
			};
		});

		test(testNames.newDoc.success, async () => {
			mockD_Create.mockResolvedValue(mockNewDealData);

			await newDeal(
				mockRequest as Request,
				mockResponse as Response,
				mockNextFunction,
			);

			resMessage = `Request to create deal-: ${mockNewDealData.name} by user -:${mockNewDealData.userId} is successfull.`;
			resPayload.setSuccess(resMessage, mockNewDealData);

			expect(mockResponse.status).toBe(201);
			expect(mockResponse.json).toStrictEqual(resPayload);
			expect(augmentAndForwardError).not.toHaveBeenCalled();
		});

		test(testNames.newDoc.unsuccess, async () => {
			mockD_Create.mockResolvedValue(null);

			await newDeal(
				mockRequest as Request,
				mockResponse as Response,
				mockNextFunction,
			);

			resMessage = `Request to create deal-: ${mockNewDealData.name} is unsuccessfull.`;
			resPayload.setConflict(resMessage);

			expect(mockResponse.status).toBe(409);
			expect(mockResponse.json).toStrictEqual(resPayload);
			expect(augmentAndForwardError).not.toHaveBeenCalled();
		});

		test(testNames.error, async () => {
			mockD_Create.mockImplementation(() => {
				throw new Error("new error");
			});

			await newDeal(
				mockRequest as Request,
				mockResponse as Response,
				mockNextFunction,
			);

			expect(augmentAndForwardError).toHaveBeenCalled();
		});
	});

	const funcName_2 = "delBusiness";
	describe(`${funcName} -> ${funcName_2} tests`, () => {
		const mockDealId = new ObjectId().toString();

		beforeEach(() => {
			mockRequest = {
				params: {
					dealId: mockDealId,
				},
			};
		});

		const mockD_FindByIdAndDelete = deal.findByIdAndDelete as jest.Mock;

		test(testNames.delDoc.success, async () => {
			const mockRecievedDealData = {
				...mockNewDealData,
				_id: mockDealId,
			};
			mockD_FindByIdAndDelete.mockResolvedValue(mockRecievedDealData);

			await delDeal(
				mockRequest as Request,
				mockResponse as Response,
				mockNextFunction,
			);

			resMessage = `Request to delete deal-: ${mockDealId} is successfull.`;
			resPayload.setSuccess(resMessage);

			expect(mockResponse.status).toBe(200);
			expect(mockResponse.json).toStrictEqual(resPayload);
			expect(augmentAndForwardError).not.toHaveBeenCalled();
		});

		test(testNames.delDoc.unsuccess, async () => {
			mockD_FindByIdAndDelete.mockResolvedValue(null);

			await delDeal(
				mockRequest as Request,
				mockResponse as Response,
				mockNextFunction,
			);

			resMessage = `Request to delete deal-: ${mockDealId} is unsuccessfull.`;
			resPayload.setConflict(resMessage);

			expect(mockResponse.status).toBe(409);
			expect(mockResponse.json).toStrictEqual(resPayload);
			expect(augmentAndForwardError).not.toHaveBeenCalled();
		});

		test(testNames.error, async () => {
			mockD_FindByIdAndDelete.mockImplementation(() => {
				throw new Error("new error");
			});
			await delDeal(
				mockRequest as Request,
				mockResponse as Response,
				mockNextFunction,
			);

			expect(augmentAndForwardError).toHaveBeenCalled();
		});
	});
});
