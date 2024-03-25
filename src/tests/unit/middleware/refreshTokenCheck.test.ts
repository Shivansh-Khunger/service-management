// Import types
import type { NextFunction, Request, Response } from "express";

// Import function to be tested
import checkForRefreshToken from "@middlewares/refreshTokenCheck";

// Import necessary modules
import isRefreshTokenValid from "@helpers/validRefreshToken";
import CustomError from "@utils/customError";
import augmentAndForwardError from "@utils/errorAugmenter";

jest.mock("@helpers/validRefreshToken", () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock("@utils/errorAugmenter", () => ({
    __esModule: true,
    default: jest.fn(),
}));

const funcName = "checkForRefreshToken";
describe(`middleware -> ${funcName} tests`, () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    const mockNextFunction: NextFunction = jest.fn();

    const mockJWTDecode = {
        sub: "userId",
    };
    const mockisRefreshTokenValid = isRefreshTokenValid as jest.Mock;

    beforeEach(() => {
        mockRequest = {
            signedCookies: {
                refreshToken: "mockRefreshToken",
            },
        };
        mockResponse = {
            json: jest.fn(),
        };
    });

    test("if Calls nextFunction when refresh token is valid", () => {
        mockisRefreshTokenValid.mockReturnValue(mockJWTDecode);

        checkForRefreshToken(
            mockRequest as Request,
            mockResponse as Response,
            mockNextFunction,
        );

        expect(mockNextFunction).toHaveBeenCalled();
        expect(augmentAndForwardError).not.toHaveBeenCalled();
    });

    test("if Calls augmentAndForwardError when refresh token is not present", () => {
        mockRequest.signedCookies = {
            refreshToken: undefined,
        };

        const mockErr = new CustomError("Request could not be authenticated.");
        mockErr.status = 401;

        checkForRefreshToken(
            mockRequest as Request,
            mockResponse as Response,
            mockNextFunction,
        );

        expect(augmentAndForwardError).toHaveBeenCalledWith({
            next: mockNextFunction,
            err: mockErr,
            funcName: funcName,
        });
    });

    test("if Calls augmentAndForwardError when isRefreshTokenValid throws", () => {
        const mockErr = new CustomError(
            "Request could not be authenticated due to expired refresh token.",
        );
        mockErr.status = 403;

        mockisRefreshTokenValid.mockImplementation(() => {
            throw mockErr;
        });

        checkForRefreshToken(
            mockRequest as Request,
            mockResponse as Response,
            mockNextFunction,
        );

        expect(augmentAndForwardError).toHaveBeenCalledWith({
            next: mockNextFunction,
            err: mockErr,
            funcName: funcName,
        });
    });
});
