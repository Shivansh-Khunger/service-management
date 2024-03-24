import Joi from "joi";

// Import UPI id regex
import { UPI_ID_REGEX } from "./primitiveOps";

// Define a schema for the parameters
export const updatedBusinessParams = Joi.object({
    businessId: Joi.string().length(24).required(),
});

// Define a schema for the body
export const updatedBusinessBody = Joi.object({
    // Basic details
    name: Joi.string(),
    user: Joi.string().length(24),

    // Operation timings
    openingTime: Joi.date(),
    closingTime: Joi.date(),

    // Contact details
    phoneNumber: Joi.string(),
    landline: Joi.string(),
    email: Joi.string().email(),

    // Online presence
    website: Joi.string().uri(),
    imageUrls: Joi.array().items(Joi.string().uri()),

    // Location and payment details
    geoLocation: Joi.object({
        type: Joi.string().valid("Point").default("Point"),
        coordinates: Joi.array().items(Joi.number()).length(2),
    }),
    upiId: Joi.string().pattern(UPI_ID_REGEX),

    // Manager contact details
    managerPhoneNumber: Joi.string(),
    managerEmail: Joi.string().email(),

    // Type and category
    type: Joi.string(),
    category: Joi.string(),
    subCategory: Joi.string(),

    // Brands
    brands: Joi.array().items(Joi.string()),
});
