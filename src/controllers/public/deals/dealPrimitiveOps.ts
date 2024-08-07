// Import types
import type { RequestHandler } from 'express';

// Import necessary modules
import Business from '@models/business';
import Deal from '@models/deal';
import Product from '@models/product';
import augmentAndForwardError from '@utils/errorAugmenter';
import ResponsePayload from '@utils/resGenerator';
import axios from 'axios';

export const newDeal: RequestHandler = async (req, res, next) => {
    const funcName = 'newDeal';

    const resPayload = new ResponsePayload();

    const { dealData } = req.body;
    const { userName, userEmail } = req.userCredentials;

    try {
        const newDeal = await Deal.create({
            ...dealData,
        });

        let resMessage = '';
        const resLogMessage = `-> response for ${funcName} function`;

        if (newDeal) {
            const businessData = await Business.findById(newDeal.businessId, {
                name: true,
            });

            const productData = await Product.findById(newDeal.productId, {
                name: true,
            });

            axios.post(`${process.env.SERVICE_EMAIL_URL}d/new`, {
                recipientEmail: userEmail,
                recipientName: userName,
                businessName: businessData?.name,
                productName: productData?.name,
                dealName: newDeal.name,
                dealEndDate: newDeal.endDate.toString(),
            });

            // Create a success message
            resMessage = `Request to create deal-: ${newDeal.name} by user -:${newDeal.userId} is successfull.`;

            // Set the success response payload
            resPayload.setSuccess(resMessage, newDeal);

            // Log the response payload
            res.log.info(resPayload, resLogMessage);

            // Return the response payload with status 201
            return res.status(201).json(resPayload);
        }
        resMessage = `Request to create deal-: ${dealData.name} is unsuccessfull.`;

        resPayload.setConflict(resMessage);

        res.log.info(resPayload, resLogMessage);

        return res.status(409).json(resPayload);
    } catch (err) {
        // Handle the caught error by passing it to the augmentAndForwardError function which will pass it to the error handling middleware
        augmentAndForwardError({ next: next, err: err, funcName: funcName });
    }
};

export const delDeal: RequestHandler = async (req, res, next) => {
    const funcName = 'delDeal';

    const resPayload = new ResponsePayload();

    const { dealId } = req.params;

    try {
        const deletedDeal = await Deal.findByIdAndDelete(dealId);

        const resLogMessage = `-> response for ${funcName} controller`;

        // If the deal was successfully deleted
        if (deletedDeal?._id.toString() === dealId) {
            // Set the success message
            const resMessage = `Request to delete deal-: ${dealId} is successfull.`;

            // Set the success response payload
            resPayload.setSuccess(resMessage);

            // Log the response payload
            res.log.info(resPayload, resLogMessage);

            // Return the response payload with status 200
            return res.status(200).json(resPayload);
        }
        // If the deal was not deleted
        const resMessage = `Request to delete deal-: ${dealId} is unsuccessfull.`;

        // Set the conflict response payload
        resPayload.setConflict(resMessage);

        // Log the response payload
        res.log.info(resPayload, resLogMessage);

        // Return the response payload with status 409
        return res.status(409).json(resPayload);
    } catch (err) {
        // Handle the caught error by passing it to the augmentAndForwardError function which will pass it to the error handling middleware
        augmentAndForwardError({ next: next, err: err, funcName: funcName });
    }
};
