// Import Types
import type { NextFunction, Request, Response } from "express";

// Import function(s) to be tested
import { updateUser } from "../../../../../controllers/public/user";

// Import necessary modules
import { ObjectId } from "mongodb";
import { logger } from "../../../../../logger";
import user from "../../../../../models/user";
import augmentAndForwardError from "../../../../../utils/errorAugmenter";
import ResponsePayload from "../../../../../utils/resGenerator";
import { generateNameforManagement } from "../../testNameGenerator";

jest.mock("../../../../../models/user", () => ({
	findByIdAndUpdate: jest.fn(),
}));

jest.mock("../../../../../utils/errorAugmenter", () => ({
	__esModule: true,
	default: jest.fn(),
}));

const mockUserData = {
	name: "Rahul",
	email: "rahul@gmail.com",
	phoneNumber: "2589631470",
};

const collectionName = "User";
const testNames = generateNameforManagement(collectionName);
const funcName = "userManagementOps";
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
			findByIdAndUpdate: jest.fn(),
		}));

		jest.mock("../../../../../utils/errorAugmenter", () => ({
			__esModule: true,
			default: jest.fn(),
		}));
	});

	const funcName_1 = "updateUser";
	describe(`${funcName} -> ${funcName_1}`, () => {
		const mockU_findByIdAndUpdate = user.findByIdAndUpdate as jest.Mock;

		const mockUserId = new ObjectId().toString();

		const mockLatestUser = {
			...mockUserData,
			name: "Business My",
			_id: mockUserId,
		};

		beforeEach(() => {
			mockRequest = {
				body: {
					latestUser: mockLatestUser,
				},
				params: {
					userId: mockUserId,
				},
			};
		});

		test(testNames.updateDoc.success, async () => {
			mockU_findByIdAndUpdate.mockResolvedValue(mockLatestUser);

			await updateUser(
				mockRequest as Request,
				mockResponse as Response,
				mockNextFunction,
			);

			resMessage = `Request to update ${collectionName}-: ${mockUserId} is successfull.`;
			resPayload.setSuccess(resMessage, mockLatestUser);

			expect(mockResponse.status).toBe(200);
			expect(mockResponse.json).toStrictEqual(resPayload);
			expect(augmentAndForwardError).not.toHaveBeenCalled();
		});

		test(testNames.updateDoc.unsuccess, async () => {
			mockU_findByIdAndUpdate.mockResolvedValue(null);

			await updateUser(
				mockRequest as Request,
				mockResponse as Response,
				mockNextFunction,
			);

			resMessage = `Request to update ${collectionName}-: ${mockUserId} is unsuccessfull.`;
			resPayload.setConflict(resMessage);

			expect(mockResponse.status).toBe(409);
			expect(mockResponse.json).toStrictEqual(resPayload);
			expect(augmentAndForwardError).not.toHaveBeenCalled();
		});

		test(testNames.error, async () => {
			mockU_findByIdAndUpdate.mockImplementation(() => {
				throw new Error("new error");
			});

			await updateUser(
				mockRequest as Request,
				mockResponse as Response,
				mockNextFunction,
			);

			expect(augmentAndForwardError).toHaveBeenCalled();
		});
	});
});
