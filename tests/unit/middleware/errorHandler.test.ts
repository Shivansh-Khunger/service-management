// Import types
import type { NextFunction, Request, Response } from "express";

// Import function to be tested
import handleError from "../../../middlewares/errorHandler";

// Import necessary modules
import { logger } from "../../../logger";
import CustomError from "../../../utils/customError";

const funcName = "handleError";
describe("", () => {
	let mockRequest: Partial<Request>;
	let mockResponse: Partial<Response>;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	let mockError: any;

	const mockNextFunction: NextFunction = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();

		mockResponse = {
			status: jest.fn().mockImplementation((statusCode) => {
				mockResponse.status = statusCode;
				return mockResponse;
			}),
			json: jest.fn().mockImplementation((resPayload) => {
				mockResponse.json = {
					...resPayload,
				};
				return mockResponse;
			}),
			log: logger,
		};

		mockError = {};
	});

	test("x", () => {
		mockError = new CustomError("error message");
		mockError.status = 401;
		mockError.logMessage = "error log message";
		mockError.funcName = funcName;

		handleError(
			mockError as CustomError,
			mockRequest as Request,
			mockResponse as Response,
			mockNextFunction,
		);

		expect(mockResponse.json).toStrictEqual({
			data: null,
			isSuccess: false,
			hasError: true,
			message: "error message",
		});
		expect(mockNextFunction).not.toHaveBeenCalled();
	});

	test("y", () => {
		handleError(
			mockError,
			mockRequest as Request,
			mockResponse as Response,
			mockNextFunction,
		);

		expect(mockResponse.json).toStrictEqual({
			data: null,
			isSuccess: false,
			hasError: true,
			message: "server error",
		});
		expect(mockNextFunction).not.toHaveBeenCalled();
	});
});
