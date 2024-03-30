import Joi from 'joi';

export const getDealsBody = Joi.object({
    currentLocation: Joi.array().items(Joi.number()).length(2).required(),
    preferedDistanceInKm: Joi.number().required(),
});
