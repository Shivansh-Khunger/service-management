import Joi from "joi";

import business from "../../models/business.js";
import generateRes from "../../utils/resGenerator.js";

const schema = Joi.object({
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

export async function newBusiness(req, res) {
	const resPayload = generateRes();
	const { err } = schema.validate(req.body);

	if (err) {
		resPayload.message = err.details[0].message;
		resPayload.hasError = true;

		res.log.error(
			err,
			"-> input validation error has occured in the newBusiness function",
		);
		return res.status(400).json(resPayload);
	}

	try {
		const newBusiness = await business.create({
			name: req.body.businessName,
			owner: req.body.businessOwner,

			openingTime: req.body.businessOpeningTime,
			closingTime: req.body.businessClosingTime,

			phoneNumber: req.body.businessPhoneNumber,
			landline: req.body.businessLandline,
			email: req.body.businessEmail,
			website: req.body.businessWebsite,
			imageUrls: req.body.businessImageUrls,
			geoLocation: req.body.businessGeoLocation,
			upiId: req.body.businessUpiId,

			managerContact: {
				managerPhoneNumber: req.body.managerPhoneNumber,
				managerEmail: req.body.managerEmail,
			},

			businessType: req.body.businessType,
			businessCategory: req.body.businessCategory,
			businessSubCategory: req.body.businessSubCategory,

			brands: req.body.businessBrands,
		});

		resPayload.message = `-> business with name -:${req.body.businessName} created by user with id -: ${req.body.businessOwner}`;
		resPayload.isSuccess = true;

		res.log.info(resPayload, "-> response payload for newBusiness function");

		return res.status(201).json(resPayload);
	} catch (err) {
		resPayload.message = "server error.";
		resPayload.hasError = true;

		res.log.error(
			err,
			"-> server error has occured in the newBusiness function",
		);
		return res.status(500).json(resPayload);
	}
}
