import Joi from "joi";

export const newSubCategory = Joi.object({
	name: Joi.string().required(), // The name of the category is required and must be a string
	image: Joi.string(), // The image associated with the category must be a string
	description: Joi.string(), // The description of the category must be a string
});

export const delSubCategory = Joi.object({
	subCategoryName: Joi.string().required(),
});
