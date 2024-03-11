import type { Request, Response, NextFunction } from "express";

// Import the UAParser library for parsing User-Agent strings
import UAParser from "ua-parser-js";

// Middleware function to check the device type
function checkForDevice(req: Request, res: Response, next: NextFunction) {
	// Create a new UAParser instance and parse the User-Agent string from the request headers
	const uap = new UAParser(req.headers["user-agent"]);

	// Get the device information from the parsed User-Agent string
	const reqDevice = uap.getDevice();

	// If the device type is not "mobile" or "tablet", set the "checkImei" property of the request to false
	if (reqDevice.type !== "mobile" && reqDevice.type !== "tablet") {
		req.flags.checkImei = false;
	}

	// Proceed to the next middleware function
	next();
}

// Export the middleware function
export default checkForDevice;
