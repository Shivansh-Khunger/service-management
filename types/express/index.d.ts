import type reqFlags from "../../utils/requestFlags";

declare global {
	namespace Express {
		export interface Request {
			flags: reqFlags;
		}
	}
}
