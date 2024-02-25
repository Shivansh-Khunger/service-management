import business from "../../models/business.js";

import ResponsePayload from "../../utils/resGenerator.js";

export async function newBusiness(req, res, next) {
	const resPayload = new ResponsePayload();

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

		resPayload.setSuccess(
			`-> business with name -:${req.body.businessName} created by user with id -: ${req.body.businessOwner}`,
			newBusiness,
		);
		res.log.info(resPayload, "-> response payload for newBusiness function");

		return res.status(201).json(resPayload);
	} catch (err) {
		err.funcName = `newBusiness`;
		
		next(err);
	}
}

// TODO -> implement delBusiness.

export async function delBusiness(req, res) {
	const resPayload = generateRes();
}
