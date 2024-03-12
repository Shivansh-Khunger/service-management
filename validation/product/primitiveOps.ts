import Joi from "joi";

// Input Validation schemas for productPrimitveOps.
// Create the schema for newProduct controller.
export const newProduct = Joi.object({
	// Product identification
	name: Joi.string().required(),
	brandName: Joi.string().required(),
	description: Joi.string(),

	// Stock information
	openingStock: Joi.number().required(),
	stockType: Joi.string().required(),

	// Quantity information
	quantity: Joi.object({
		no: Joi.number().required(),
		billNo: Joi.number(),
		firmName: Joi.string(),
	}).required(),

	quantityHistory: Joi.array().items(
		Joi.object({
			quantity: Joi.object({
				no: Joi.number().required(),
				billNo: Joi.number(),
				firmName: Joi.string(),
				createdAt: Joi.date().required(),
			}),
			updatedAt: Joi.date().required(),
		}),
	),

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
	attributes: Joi.array()
		.items(
			Joi.object({
				name: Joi.string().required(),
				value: Joi.any().required(),
			}),
		)
		.required(),

	// Country code
	countryCode: Joi.string().required(),

	// Business and user information
	businessId: Joi.string().length(24).required(),
	userId: Joi.string().length(24).required(),
});

// Create the schema for delProduct controller.
export const delProduct = Joi.object({
	//Product Id
	productId: Joi.string().length(24).required(),
});
