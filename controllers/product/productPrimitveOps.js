import product from "../../models/product.js";

import ResponsePayload from "../../utils/resGenerator.js";

export async function newProduct(req, res, next) {
	const resPayload = new ResponsePayload();

	try {
		const newProduct = await product.create({
			// Product identification
			name: req.body.product.name,
			brandName: req.body.product.brandName,
			description: req.body.product.description,

			// Stock information
			openingStock: req.body.product.openingStock,
			stockType: req.body.product.stockType,

			// Pricing
			unitMrp: req.body.product.unitMrp,
			sellingPrice: req.body.product.sellingPrice,

			// Product details
			batchNo: req.body.product.batchNo,
			manufacturingDate: req.body.product.manufacturingDate,
			expiryDate: req.body.product.expiryDate,
			attributes: req.body.product.attributes,

			// Images
			images: req.body.product.images,

			// Business and user information
			businessId: req.body.product.businessId,
			userId: req.body.product.userId,

			// Country code
			countryCode: req.body.product.countryCode,
		});

		resPayload.setSuccess(
			`-> business with name -:${req.body.product.name} created by user with id -: ${eq.body.product.userId} under the business -: ${req.body.product.businessId}`,
			newProduct,
		);

		res.log.info(resPayload, "-> response for newProduct function");
		return res.status(201).json(resPayload);
	} catch (err) {
		err.funcName = `newProduct`;

		next(err);
	}
}

export async function delProduct(req, res, next) {
	const resPayload = new ResponsePayload();

	try {
		const deletedProduct = await product.findByIdAndDelete(req.params.id);

		if (deletedProduct.deletedCount === 1) {
			const resMessage = `product with id-: ${req.params.id} has been successfully deleted.`;

			resPayload.setSuccess(resMessage);

			res.log.info(resPayload, `-> response for delProduct function`);
		} else {
			const err = new Error(
				`business with id-: ${req.params.id} could not be deleted.`,
			);
			err.funcName = `delProduct`;

			next(err);
		}
	} catch (err) {
		err.funcName = `delProduct`;

		next(err);
	}
}
