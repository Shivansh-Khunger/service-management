import Joi from "joi";
import category from "../../models/category";

export const newSubCategory = Joi.object({
	name: Joi.string().required(), // The name of the category is required and must be a string
	image: Joi.string(), // The image associated with the category must be a string
	description: Joi.string(), // The description of the category must be a string
	categoryId: Joi.string().length(24).required(), // The category to which the sub-category belongs is required and must be a string
});

export const delSubCategory = Joi.object({
	subCategoryName: Joi.string().required(),
});
