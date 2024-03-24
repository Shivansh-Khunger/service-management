import Joi from "joi";

// Export & initialize UPI id regex
export const UPI_ID_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9_-]+$/;

export const newBusiness = Joi.object({
	name: Joi.string().required(),
	userId: Joi.string().length(24).required(),

	openingTime: Joi.date().required(),
	closingTime: Joi.date().required(),

	phoneNumber: Joi.string().required(),
	landline: Joi.string(),
	email: Joi.string().email().required(),
	website: Joi.string().uri(),
	imageUrls: Joi.array().items(Joi.string().uri()),
	geoLocation: Joi.object({
		type: Joi.string().valid("Point").default("Point"),
		coordinates: Joi.array().items(Joi.number()).length(2),
	}).required(),
	upiId: Joi.string().pattern(UPI_ID_REGEX).required(),

	managerPhoneNumber: Joi.string(),
	managerEmail: Joi.string().email(),
	type: Joi.string(),
	category: Joi.string(),
	subCategory: Joi.string(),

	brands: Joi.array().items(Joi.string()),
});

export const delBusiness = Joi.object({
	businessId: Joi.string().length(24).required(),
});
