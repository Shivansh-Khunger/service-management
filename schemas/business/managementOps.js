import Joi from "joi";

// Define a schema for the parameters
export const updatedBusinessParamsSchema = Joi.object({
	businessId: Joi.string().required(),
});

// Define a schema for the body
export const updatedBusinessBodySchema = Joi.object({
	// Business basic details
	businessName: Joi.string(),
	businessOwner: Joi.string(),

	// Business operation timings
	businessOpeningTime: Joi.date(),
	businessClosingTime: Joi.date(),

	// Business contact details
	businessPhoneNumber: Joi.string(),
	businessLandline: Joi.string(),
	businessEmail: Joi.string().email(),

	// Business online presence
	businessWebsite: Joi.string().uri(),
	businessImageUrls: Joi.array().items(Joi.string().uri()),

	// Business location and payment details
	businessGeoLocation: Joi.array().items(Joi.number()).length(2),
	businessUpiId: Joi.string(),

	// Manager contact details
	managerPhoneNumber: Joi.string(),
	managerEmail: Joi.string().email(),

	// Business type and category
	businessType: Joi.string(),
	businessCategory: Joi.string(),
	businessSubCategory: Joi.string(),

	// Brands
	businessBrands: Joi.array().items(Joi.string()),
});
