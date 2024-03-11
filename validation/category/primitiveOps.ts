import Joi from "joi";

export const newCategorySchema = Joi.object({
	name: Joi.string().required(), // The name of the category is required and must be a string
	image: Joi.string(), // The image associated with the category must be a string
	description: Joi.string(), // The description of the category must be a string
});

export const delCategorySchema = Joi.object({
	categoryId: Joi.string().length(24).required(),
});
