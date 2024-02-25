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

		res.log.info(resPayload, "-> response for newBusiness function");
		return res.status(201).json(resPayload);
	} catch (err) {
		err.funcName = `newBusiness`;

		next(err);
	}
}

// TODO -> implement delBusiness.

export async function delBusiness(req, res, next) {
	const resPayload = new ResponsePayload();

	try {
		const deletedBusiness = await business.findByIdAndDelete(req.params.id);

		if (deletedBusiness.deletedCount === 1) {
			const resMessage = `business with id-: ${req.params.id} has been successfully deleted.`;

			resPayload.setSuccess(resMessage);

			res.log.info(resPayload, `-> response for delBusiness function`);
			return res.status(200).json(resPayload);
		} else {
			const err = new Error(
				`business with id-: ${req.params.id} could not be deleted.`,
			);
			err.funcName = `delBusiness`;

			next(err);
		}
	} catch (err) {
		err.funcName = `delBusiness`;

		next(err);
	}
}
