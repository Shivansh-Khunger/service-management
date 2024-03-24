import type reqFlags from "../../src/utils/requestFlags";

declare global {
    namespace Express {
        export interface Request {
            flags: reqFlags;
        }
    }
}
