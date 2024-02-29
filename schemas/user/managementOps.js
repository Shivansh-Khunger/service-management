import Joi from "joi";

export const updateUserParamsSchema = Joi.object({
	userId: Joi.string().required(),
});

export const updateUserBodySchema = Joi.object({
	name: Joi.string(),
	email: Joi.string().email(),
	phoneNumber: Joi.string(),
});
