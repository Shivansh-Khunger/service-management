import Joi from "joi";

export const USER_NAME_REGEX = /^[a-zA-Z][a-zA-Zs]{0,20}[a-zA-Z]$/;

export const USER_PASS_REGEX =
    /^(?=.*?[0-9])(?=.*?[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/? ])(?=.*?[A-Z])(?=.*?[a-z]).{8,16}$/;

// User Information
const userInfo = {
	name: Joi.string().pattern(USER_NAME_REGEX).required(),
	email: Joi.string().email().required(),
	phoneNumber: Joi.string().min(10).max(15).required(),
	profilePic: Joi.string(),
	referalCode: Joi.string(),
	countryCode: Joi.string(),
	imeiNumber: Joi.string().default(""),
	isActive: Joi.boolean(),
};

// Security Information
const securityInfo = {
	password: Joi.string().pattern(USER_PASS_REGEX).required(),
};

// User Preferences
const userPreferences = {
	interestArray: Joi.array().items(Joi.string()),
	geoLocation: Joi.array().items(Joi.number()).length(2),
	mailSent: Joi.boolean().default(false),
	postDealMail: Joi.boolean().default(false),
};

// Push Notification Settings
const pushNotificationSettings = {
	pushToken: Joi.string(),
	pushTokenActivate: Joi.boolean().default(true),
	dealbookpushTokenActivate: Joi.boolean().default(true),
	addbusinesstpfavpushTokenActivate: Joi.boolean().default(true),
	dealstatuschangepushTokenActivate: Joi.boolean().default(true),
	manageraddedpushTokenActivate: Joi.boolean().default(true),
	sendinvitepushTokenActivate: Joi.boolean().default(true),
	newdealpostedpushTokenActivate: Joi.boolean().default(true),
	broadcastpushTokenActivate: Joi.boolean().default(true),
	messagesendpushTokenActivate: Joi.boolean().default(true),
};

// Location info
const locationInfo = {
	gpsTracking: Joi.boolean().default(true),
};

// Bounty info
const bountyInfo = {
	bounty: Joi.number().default(0),
};

// Combine all the categories into one schema
export const newUser = Joi.object({
	...userInfo,
	...securityInfo,
	...userPreferences,
	...pushNotificationSettings,
	...locationInfo,
	...bountyInfo,
});

export const delUser = Joi.object({
	userId: Joi.string().length(24).required(),
});
