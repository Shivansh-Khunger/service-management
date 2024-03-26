import Joi from "joi";

export const updateUserBody = Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    phoneNumber: Joi.string().min(10).max(15),
});
