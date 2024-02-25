import Joi from "joi";

export const newBusinessSchema = Joi.object({
	businessName: Joi.string().required(),
	businessOwner: Joi.string().required(),

	businessOpeningTime: Joi.date().required(),
	businessClosingTime: Joi.date().required(),

	businessPhoneNumber: Joi.string().required(),
	businessLandline: Joi.string(),
	businessEmail: Joi.string().email().required(),
	businessWebsite: Joi.string().uri(),
	businessImageUrls: Joi.array().items(Joi.string().uri()),
	businessGeoLocation: Joi.array().items(Joi.number()).length(2).required(),
	businessUpiId: Joi.string().required(),

	managerPhoneNumber: Joi.string(),
	managerEmail: Joi.string().email(),
	businessType: Joi.string(),
	businessCategory: Joi.string(),
	businessSubCategory: Joi.string(),

	businessBrands: Joi.array().items(Joi.string()),
});

export const delBusinessSchema = Joi.object({
	businessId: Joi.string().required(),
});
