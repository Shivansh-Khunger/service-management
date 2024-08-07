// Import types
import type { RequestHandler } from "express";
import type { PipelineStage } from "mongoose";

// Import necessary modules
import Business from "@models/business";
import User from "@models/user";
import augmentAndForwardError from "@utils/errorAugmenter";
import ResponsePayload from "@utils/resGenerator";

const collectionName = "Deals"
export const getDeals: RequestHandler = async (req, res, next) => {
    const funcName = "getDeals";

    const resPayload = new ResponsePayload();

    const { userId } = req.userCredentials;
    const { userData } = req.body;

    try {
        const prefferedCategories = await User.findById(userId, {
            interestArray: true,
        });

        if (prefferedCategories?.interestArray) {
            const pipeline: PipelineStage[] = [
                {
                    $geoNear: {
                        near: {
                            type: "Point",
                            coordinates: userData.currentLocation,
                        },
                        distanceField: "distance",
                        minDistance: 150,
                        maxDistance: userData.preferedDistanceInKm * 1000,
                        spherical: true,
                    },
                },
                {
                    $match: {
                        subCategory: { $in: prefferedCategories.interestArray },
                    },
                },
                {
                    $lookup: {
                        from: "deals",
                        localField: "_id",
                        foreignField: "businessId",
                        as: "deal",
                    },
                },
                {
                    $unwind: "$deal",
                },
                {
                    $lookup: {
                        from: "products",
                        localField: "deal.productId",
                        foreignField: "_id",
                        as: "deal.product",
                    },
                },
            ];

            const deals = await Business.aggregate(pipeline);

            let resMessage = "";
            if (deals) {
                resMessage = `Request to get ${collectionName} for user -:${userId} is successfull.`;

                resPayload.setSuccess(resMessage, deals);

                res.log.info(
                    resPayload,
                    `-> response for ${funcName} function`,
                );

                return res.status(200).json(resPayload);
            }
            resMessage = `Request to get ${collectionName} for user -:${userId} is not successfull.`;

            resPayload.setConflict(resMessage);

            return res.status(409).json(resPayload);
        }
        const resMessage = `Request to get ${collectionName} for user -:${userId} is not successfull beacause unable to get intrests for the user.`;

        resPayload.setError(resMessage);

        return res.status(409).json(resPayload);
    } catch (err) {
        // Handle the caught error by passing it to the augmentAndForwardError function which will pass it to the error handling middleware
        augmentAndForwardError({ next: next, err: err, funcName: funcName });
    }
};
