import Joi from "joi";

export const newProductSchema = Joi.object({
	// Product identification
	name: Joi.string().required(),
	brandName: Joi.string().required(),
	description: Joi.string(),

	// Stock information
	openingStock: Joi.number().required(),
	stockType: Joi.string().required(),

	// Product details
	batchNo: Joi.string(),
	manufacturingDate: Joi.date(),
	expiryDate: Joi.date(),

	// Pricing
	unitMrp: Joi.number().required(),
	sellingPrice: Joi.number().required(),

	// Images
	images: Joi.array().items(Joi.string().uri()),

	// Flexible attributes
	attributes: Joi.array().items(
		Joi.object({
			name: Joi.string().required(),
			value: Joi.any().required(),
		}),
	),

	// Country code
	countryCode: Joi.string().required(),

	// Business and user information
	businessId: Joi.string().required(),
	userId: Joi.string().required(),
});

export const delProductSchema = Joi.object({
	productId: Joi.string().required(),
});
