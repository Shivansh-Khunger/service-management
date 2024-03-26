import type { reqCredentials, reqFlags } from "../../src/utils/requestFlags";

declare global {
    namespace Express {
        export interface Request {
            flags: reqFlags;
            userCredentials: reqCredentials;
        }
    }
}
