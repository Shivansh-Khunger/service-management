import product from "../../models/product.js";

import ResponsePayload from "../../utils/resGenerator.js";

export async function newProduct(req, res, next) {
	const { product } = req.body;
	const resPayload = new ResponsePayload();

	try {
		const newProduct = await product.create({
			// Product identification
			name: product.name,
			brandName: product.brandName,
			description: product.description,

			// Stock information
			openingStock: product.openingStock,
			stockType: product.stockType,

			// Pricing
			unitMrp: product.unitMrp,
			sellingPrice: product.sellingPrice,

			// Product details
			batchNo: product.batchNo,
			manufacturingDate: product.manufacturingDate,
			expiryDate: product.expiryDate,
			attributes: product.attributes,

			// Images
			images: product.images,

			// Business and user information
			businessId: product.businessId,
			userId: product.userId,

			// Country code
			countryCode: product.countryCode,
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
