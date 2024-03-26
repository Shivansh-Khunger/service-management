import Joi from "joi";

import { USER_PASS_REGEX } from "./primitveOps";

export const loginUser = Joi.object({
    email: Joi.string().email(),
    phoneNumber: Joi.string().min(10).max(15),
    password: Joi.string().pattern(USER_PASS_REGEX).required(),
}).or("email", "phoneNumber");
