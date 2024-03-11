import mongoose from "mongoose";

// User Information
const userInfo = {
	name: {
		type: String,
		required: [true, "Name is required."],
	},

	profilePic: {
		type: String,
	},

	referalCode: {
		type: String,
	},

	countryCode: {
		type: String,
	},

	imeiNumber: {
		type: String,
		default: "",
	},

	isActive: Boolean,
};

// Security Information
const securityInfo = {
	password: {
		type: String,
		required: [true, "Password is required"],
	},
};

// User Preferences
const userPreferences = {
	interestArray: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "subCategoryMaster",
		},
	],

	geoLocation: {
		type: [Number],
		index: "2d", // 0 index longi, 1 index lati
	},

	mailSent: {
		type: Boolean,
		default: false,
	},

	postDealMail: {
		type: Boolean,
		default: false,
	},
};

// Push Notification Settings
const pushNotificationSettings = {
	pushToken: String,

	pushTokenActivate: {
		type: Boolean,
		default: true,
	},

	dealbookpushTokenActivate: {
		type: Boolean,
		default: true,
	},

	addbusinesstpfavpushTokenActivate: {
		type: Boolean,
		default: true,
	},

	dealstatuschangepushTokenActivate: {
		type: Boolean,
		default: true,
	},

	manageraddedpushTokenActivate: {
		type: Boolean,
		default: true,
	},

	sendinvitepushTokenActivate: {
		type: Boolean,
		default: true,
	},

	newdealpostedpushTokenActivate: {
		type: Boolean,
		default: true,
	},

	broadcastpushTokenActivate: {
		type: Boolean,
		default: true,
	},

	messagesendpushTokenActivate: {
		type: Boolean,
		default: true,
	},
};

// Location info
const location = {
	gpsTracking: {
		type: Boolean,
		default: true,
	},
};

// Bounty info
const bounty = {
	bounty: {
		type: Number,
		default: 0,
	},
};

const userSchema = new mongoose.Schema(
	{
		...userInfo,

		// These fields were orignally in userInfo but due to a certain error with unique:true these were shifted here
		email: {
			type: String,
			required: [true, "Email is required."],
			unique: true,
		},

		phoneNumber: {
			type: String,
			required: [true, "Phone Number is required."],
			unique: true,
		},

		...securityInfo,
		...userPreferences,
		...pushNotificationSettings,
		...location,
		...bounty,
	},
	{
		timestamp: true,
		autoIndex: true,
	}
);

const user = mongoose.model("User", userSchema);
export default user;
