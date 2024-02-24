import UAParser from "ua-parser-js";

function checkForDevice(req, res, next) {
	const uap = new UAParser(req.headers["user-agent"]);

	const reqDevice = uap.getDevice();

	if (reqDevice.type !== "mobile" && reqDevice.type !== "tablet") {
		req.checkImei = false;
	}

	next();
}

export default checkForDevice;
