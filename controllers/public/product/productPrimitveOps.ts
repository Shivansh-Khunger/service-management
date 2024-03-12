// Importing types
import type { RequestHandler } from "express";

// Importing necessary modules
import product from "../../../models/product";

import handleCatchError from "../../../utils/catchErrorHandler";
import CustomError from "../../../utils/customError";
import ResponsePayload from "../../../utils/resGenerator";

// Function to creates a new product
export const newProduct: RequestHandler = async (req, res, next) => {
	const funcName = "newProduct";

	// Create a new response payload
	const resPayload = new ResponsePayload();

	// Extract the product from the request body
	const { productData } = req.body;

	try {
		// Attempt to create the new product
		const newProduct = await product.create({
			// Set the product identification details
			name: productData.name,
			brandName: productData.brandName,
			description: productData.description,

			// Set the stock information
			openingStock: productData.openingStock,
			stockType: productData.stockType,

			// Set the pricing details
			unitMrp: productData.unitMrp,
			sellingPrice: productData.sellingPrice,

			// Set the product details
			batchNo: productData.batchNo,
			manufacturingDate: productData.manufacturingDate,
			expiryDate: productData.expiryDate,
			attributes: productData.attributes,

			// Set the product images
			images: productData.images,

			// Set the business and user information
			businessId: productData.businessId,
			userId: productData.userId,

			// Set the country code
			countryCode: productData.countryCode,
		});

		let resMessage = "";
		const resLogMessage = `-> response for ${funcName} controller`;

		if (newProduct) {
			// Set the success response payload
			resMessage = `request to create product-: ${req.body.productData.name} under business-: ${req.body.productData.businessId} is successfull.`;

			resPayload.setSuccess(resMessage, newProduct);

			// Log the response payload
			res.log.info(resPayload, resLogMessage);

			// Send the response with a 201 status code
			return res.status(201).json(resPayload);
		}
		resMessage = `request to create product-: ${req.body.productData.name} under business-: ${req.body.productData.businessId} is not successfull.`;

		resPayload.setConflict(resMessage);

		res.log.info(resPayload, resLogMessage);

		return res.status(409).json(resPayload);
	} catch (err) {
		// Handle the caught error by passing it to the handleCatchError function which will pass it to the error handling middleware
		handleCatchError({ next: next, err: err, funcName: funcName });
	}
};

// Function to delete a product by its ID
export const delProduct: RequestHandler = async (req, res, next) => {
	const funcName = "delProduct";

	// Create a new response payload
	const resPayload = new ResponsePayload();

	const { productId } = req.params;

	try {
		// Attempt to find and delete the product by its Id
		const deletedProduct = await product.findByIdAndDelete(productId);

		const resLogMessage = `-> response for ${funcName} controller`;

		// If the product was successfully deleted
		if (deletedProduct?._id.toString() === productId) {
			// Create a success message
			const resMessage = `request to delete product-: ${productId} is successfull.`;

			// Set the success response payload
			resPayload.setSuccess(resMessage);

			// Log the response payload
			res.log.info(resPayload, resLogMessage);

			return res.status(200).json(resPayload);
		}
		// If the product could not be deleted, create an error
		const err = new CustomError(
			`request to delete product-: ${productId} is not successfull.`,
		);

		// Set the function name on the error
		err.funcName = "delProduct";

		// Set response code
		err.status = 409;

		// Pass the error to the next middleware
		next(err);
	} catch (err) {
		handleCatchError({ next: next, err: err, funcName: funcName });
	}
};
