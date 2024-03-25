// Import types
import type { NextFunction, Request, Response } from "express";

// Import function to be tested
import handleError from "@middlewares/errorHandler";

// Import necessary modules
import { logger } from "@logger";
import CustomError from "@utils/customError";

const funcName = "handleError";
describe(`middleware -> ${funcName} tests`, () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    let mockError: any;

    const mockNextFunction: NextFunction = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    beforeEach(() => {
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

    test("if Sends response with input values when given", () => {
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

        expect(mockResponse.status).toBe(401);
        expect(mockResponse.json).toStrictEqual({
            data: null,
            isSuccess: false,
            hasError: true,
            message: "error message",
        });
        expect(mockNextFunction).not.toHaveBeenCalled();
    });

    test("if Sends default response when input not given", () => {
        handleError(
            mockError,
            mockRequest as Request,
            mockResponse as Response,
            mockNextFunction,
        );

        expect(mockResponse.status).toBe(500);
        expect(mockResponse.json).toStrictEqual({
            data: null,
            isSuccess: false,
            hasError: true,
            message: "server error",
        });
        expect(mockNextFunction).not.toHaveBeenCalled();
    });
});
