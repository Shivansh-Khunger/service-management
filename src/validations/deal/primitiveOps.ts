import Joi from "joi";

export const newDeal = Joi.object({
    name: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    description: Joi.string().allow(""),
    stockType: Joi.string().allow(""),
    videoUrl: Joi.string().allow(""),
    images: Joi.array().items(Joi.string()),
    upiAddress: Joi.string().allow(""),
    paymentMode: Joi.string().allow(""),
    ifReturn: Joi.boolean(),
    deliveryType: Joi.string().allow(""),
    returnPolicyDescription: Joi.string().allow(""),
    marketPrice: Joi.number(),
    offerPrice: Joi.number(),
    quantity: Joi.number(),
    ifHomeDelivery: Joi.boolean(),
    freeHomeDeliveryKm: Joi.number(),
    costPerKm: Joi.number(),
    ifPublicPhone: Joi.boolean(),
    ifSellingOnline: Joi.boolean(),
    productId: Joi.string().length(24).required(),
    businessId: Joi.string().length(24).required(),
    userId: Joi.string().length(24).required(),
});

export const delDeal = Joi.object({
    dealId: Joi.string().length(24).required(),
});
