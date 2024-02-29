import product from "../../models/product.js";

import ResponsePayload from "../../utils/resGenerator.js";

// Function to creates a new product
export async function newProduct(req, res, next) {
	const funcName = `newProduct`;

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

		let resMessage = ``;
		let resLogMessage = `-> response for ${funcName} controller`;

		if (newProduct) {
			// Set the success response payload
			resMessage = `request to create product-: ${req.body.productData.name} under business-: ${req.body.productData.businessId} is successfull.`;

			resPayload.setSuccess(resMessage, newProduct);

			// Log the response payload
			res.log.info(resPayload, resLogMessage);

			// Send the response with a 201 status code
			return res.status(201).json(resPayload);
		} else {
			resMessage = `request to create product-: ${req.body.productData.name} under business-: ${req.body.productData.businessId} is not successfull.`;

			resPayload.setConflict(resMessage);

			res.log.info(resPayload, resLogMessage);

			return res.status(409).json(resPayload);
		}
	} catch (err) {
		// If an error occurs, set the function name on the error and pass it to the next middleware
		err.funcName = funcName;

		next(err);
	}
}

// Function to delete a product by its ID
export async function delProduct(req, res, next) {
	const funcName = `delProduct`;

	// Create a new response payload
	const resPayload = new ResponsePayload();

	const { productId } = req.params;

	try {
		// Attempt to find and delete the product by its Id
		const deletedProduct = await product.findByIdAndDelete(productId);

		const resLogMessage = `-> response for ${funcName} controller`;

		// If the product was successfully deleted
		if (deletedProduct.deletedCount === 1) {
			// Create a success message
			const resMessage = `request to delete product-: ${productId} is successfull.`;

			// Set the success response payload
			resPayload.setSuccess(resMessage);

			// Log the response payload
			res.log.info(resPayload, resLogMessage);
		} else {
			// If the product could not be deleted, create an error
			const err = new Error(
				`request to delete product-: ${productId} is not successfull.`,
			);

			// Set the function name on the error
			err.funcName = `delProduct`;

			// Set response code
			err.staus = 409;

			// Pass the error to the next middleware
			next(err);
		}
	} catch (err) {
		// If an error occurs, set the function name on the error and pass it to the next middleware
		err.funcName = funcName;

		next(err);
	}
}
