// Importing types
import type { RequestHandler } from "express";

// Importing necessary modules
import product from "../../../models/product";

import handleCatchError from "../../../utils/catchErrorHandler";
import ResponsePayload from "../../../utils/resGenerator";

// Function to update a product
export const updateProduct: RequestHandler = async (req, res, next) => {
	const funcName = "updateProduct";

	// Create a new response payload
	const resPayload = new ResponsePayload();

	// Extract the updated product data from the request body
	const { latestProduct } = req.body;

	const { productId } = req.params;
	try {
		// Attempt to find the product by its ID and update it
		const updatedProduct = await product.findByIdAndUpdate(
			productId,
			latestProduct,
			{ new: true },
		);

		let resMessage: string;
		const resLogMessage = `-> response for ${funcName} controller`;

		// If the product was successfully updated
		if (updatedProduct) {
			// Create a success message
			resMessage = `product with id-: ${productId} is updated.`;

			// Set the success response payload
			resPayload.setSuccess(resMessage, updatedProduct);

			// Log the response payload
			res.log.info(resPayload, resLogMessage);

			// Send the response with a 200 status code
			return res.status(200).json(resPayload);
		}
		// If the product could not be updated, create a conflict message
		resMessage = `product with id-: ${productId} is not updated.`;

		resPayload.setConflict(resMessage);

		res.log.info(resPayload, resLogMessage);

		return res.status(409).json(resPayload);
	} catch (err) {
		// Handle the caught error by passing it to the handleCatchError function which will pass it to the error handling middleware
		handleCatchError({ next: next, err: err, funcName: funcName });
	}
};
