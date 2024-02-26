import product from "../../models/product.js";

import ResponsePayload from "../../utils/resGenerator.js";

// This function creates a new product.
// It takes a request object, a response object, and a next middleware function as parameters.
export async function newProduct(req, res, next) {
    // Extract the product from the request body
    const { product } = req.body;

    // Create a new response payload
    const resPayload = new ResponsePayload();

    try {
        // Attempt to create the new product
        const newProduct = await product.create({
            // Set the product identification details
            name: product.name,
            brandName: product.brandName,
            description: product.description,

            // Set the stock information
            openingStock: product.openingStock,
            stockType: product.stockType,

            // Set the pricing details
            unitMrp: product.unitMrp,
            sellingPrice: product.sellingPrice,

            // Set the product details
            batchNo: product.batchNo,
            manufacturingDate: product.manufacturingDate,
            expiryDate: product.expiryDate,
            attributes: product.attributes,

            // Set the product images
            images: product.images,

            // Set the business and user information
            businessId: product.businessId,
            userId: product.userId,

            // Set the country code
            countryCode: product.countryCode,
        });

        // Set the success response payload
        resPayload.setSuccess(
            `-> business with name -:${req.body.product.name} created by user with id -: ${req.body.product.userId} under the business -: ${req.body.product.businessId}`,
            newProduct,
        );

        // Log the response payload
        res.log.info(resPayload, "-> response for newProduct function");

        // Send the response with a 201 status code
        return res.status(201).json(resPayload);
    } catch (err) {
        // If an error occurs, set the function name on the error and pass it to the next middleware
        err.funcName = `newProduct`;

        next(err);
    }
}

// This function deletes a product by its ID.
// It takes a request object, a response object, and a next middleware function as parameters.
export async function delProduct(req, res, next) {
    // Create a new response payload
    const resPayload = new ResponsePayload();

    try {
        // Attempt to find and delete the product by its Id
        const deletedProduct = await product.findByIdAndDelete(req.params.id);

        // If the product was successfully deleted
        if (deletedProduct.deletedCount === 1) {
            // Create a success message
            const resMessage = `product with id-: ${req.params.id} has been successfully deleted.`;

            // Set the success response payload
            resPayload.setSuccess(resMessage);

            // Log the response payload
            res.log.info(resPayload, `-> response for delProduct function`);
        } else {
            // If the product could not be deleted, create an error
            const err = new Error(
                `business with id-: ${req.params.id} could not be deleted.`,
            );

            // Set the function name on the error
            err.funcName = `delProduct`;

            // Pass the error to the next middleware
            next(err);
        }
    } catch (err) {
        // If an error occurs, set the function name on the error and pass it to the next middleware
        err.funcName = `delProduct`;

        next(err);
    }
}
