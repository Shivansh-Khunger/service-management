import Joi from "joi";

export const updateUserParamsSchema = Joi.object({
	userId: Joi.string().length(24).required(),
});

export const updateUserBodySchema = Joi.object({
	name: Joi.string(),
	email: Joi.string().email(),
	phoneNumber: Joi.string().min(10).max(15),
});