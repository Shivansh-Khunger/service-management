import Joi from "joi";

export const updateProductPramasSchema = Joi.object({
	productId: Joi.string().required(),
});

export const updateProductBodySchema = Joi.object({
	// Product identification
	name: Joi.string(),
	brandName: Joi.string(),
	description: Joi.string(),

	// Stock information
	openingStock: Joi.number(),
	stockType: Joi.string(),

	// Product details
	batchNo: Joi.string(),
	manufacturingDate: Joi.date(),
	expiryDate: Joi.date(),

	// Pricing
	unitMrp: Joi.number(),
	sellingPrice: Joi.number(),

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
	countryCode: Joi.string(),

	// Business and user information
	businessId: Joi.string(),
	userId: Joi.string(),
});
