// Importing types
import type { NextFunction } from "express";
import type CustomError from "./customError";

interface augmentAndForwardErrorParams {
	next: NextFunction;
	// biome-ignore lint/suspicious/noExplicitAny: <error in express is of type any>
	err: any;
	funcName: string;
	errMessage?: string;
	errLogMessage?: string;
	errStatus?: number;
}

const augmentAndForwardError = ({
	next,
	err,
	funcName,
	errMessage,
	errLogMessage,
	errStatus,
}: augmentAndForwardErrorParams) => {
	// Cast the error object to CustomError type
	const customErr = err as CustomError;
	// Set the function name property of the error
	customErr.funcName = funcName;

	// If a custom error message was provided, set it on the error
	if (errMessage) {
		customErr.message = errMessage;
	}

	// If a custom log message was provided, set it on the error
	if (errLogMessage) {
		customErr.logMessage = errLogMessage;
	}

	// If a custom status code was provided, set it on the error
	if (errStatus) {
		customErr.status = errStatus;
	}

	// Pass the error to the error handling middleware
	next(customErr);
};

export default augmentAndForwardError;
