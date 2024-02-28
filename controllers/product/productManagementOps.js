import product from "../../models/product.js";

import ResponsePayload from "../../utils/resGenerator.js";

// This function updates a product.
// It takes a request object, a response object, and a next middleware function as parameters.
export async function updateProduct(req, res, next) {
	const funcName = `updateProduct`;

	// Create a new response payload
	const resPayload = new ResponsePayload();

	// Extract the updated product data from the request body
	const latestProduct = req.body;

	try {
		// Attempt to find the product by its ID and update it
		const updatedProduct = await product.findByIdAndUpdate(
			req.params.id,
			latestProduct,
			{ new: true },
		);

		let resMessage = ``;

		// If the product was successfully updated
		if (updatedProduct) {
			// Create a success message
			resMessage = `product with id-: ${req.params.id} is updated.`;

			// Set the success response payload
			resPayload.setSuccess(resMessage, updatedProduct);

			// Log the response payload
			res.log.info(resPayload, `-> response for ${funcName} controller`);

			// Send the response with a 200 status code
			return res.status(200).json(resPayload);
		} else {
			// If the product could not be updated, create a conflict message
			resMessage = `product with id-: ${req.params.id} is not updated.`;

			// Set the conflict response payload
			resPayload.setConflict(resMessage);

			// Log the response payload
			res.log.info(resPayload, `-> response for ${funcName} controller`);

			// Send the response with a 409 status code
			return res.status(409).json(resPayload);
		}
	} catch (err) {
		// If an error occurs, set the function name on the error and pass it to the next middleware
		err.funcName = funcName;

		next(err);
	}
}
