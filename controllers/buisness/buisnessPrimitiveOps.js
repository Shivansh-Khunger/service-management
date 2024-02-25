import business from "../../models/business.js";

import generateRes from "../../utils/resGenerator.js";

export async function newBusiness(req, res) {
	const resPayload = generateRes();

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

// TODO -> implement delBusiness.

export async function delBusiness(req, res) {
	const resPayload = generateRes();
}
