import Joi from "joi";

export const updateProductPramas = Joi.object({
	productId: Joi.string().length(24).required(),
});

export const updateProductBody = Joi.object({
	// Product identification
	name: Joi.string(),
	brandName: Joi.string(),
	description: Joi.string(),

	// Stock information
	stockType: Joi.string(),

	// Quantity information
	quantity: Joi.object({
		no: Joi.number().required(),
		billNo: Joi.number(),
		firmName: Joi.string(),
	}),

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
	businessId: Joi.string().length(24),
	userId: Joi.string().length(24),
});
