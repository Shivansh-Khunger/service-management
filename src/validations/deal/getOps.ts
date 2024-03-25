import Joi from "joi";

export const getDealsParams = Joi.object({
    userId: Joi.string().length(24).required(),
});

export const getDealsBody = Joi.object({
    currentLocation: Joi.array().items(Joi.number()).length(2).required(),
    preferedDistanceInKm: Joi.number().required(),
});
