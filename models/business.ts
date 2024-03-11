import mongoose from "mongoose";

const businessSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},

		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "user",
			required: true,
		},

		openingTime: {
			type: Date,
			required: true,
		},
		closingTime: {
			type: Date,
			required: true,
		},

		phoneNumber: {
			type: String,
			required: true,
		},
		landLine: {
			type: String,
		},
		email: {
			type: String,
			required: true,
		},
		website: {
			type: String,
			default: null,
		},
		imageUrls: {
			type: [String],
			default: [],
		},
		geoLocation: {
			type: [Number],
			index: "2d", // 0 index long, 1 index lat
			required: true,
		},
		upiId: { type: String, required: true },

		managerContact: {
			managerPhoneNumber: {
				type: String,
				default: null,
			},
			managerEmail: {
				type: String,
				default: null,
			},
		},

		// model yet to be made.

		// businessType: {
		// 	type: mongoose.Schema.Types.ObjectId,
		// 	ref: "businessTypeMaster",
		// },
		// businessCategory: {
		// 	type: mongoose.Schema.Types.ObjectId,
		// 	ref: "categoryMaster",
		// },
		// businessSubCategory: {
		// 	type: mongoose.Schema.Types.ObjectId,
		// 	ref: "subCategoryMaster",
		// },

		brands: {
			type: [String],
			default: [],
		},
	},
	{
		timestamp: true,
		autoIndex: true,
	},
);

const business = mongoose.model("Business", businessSchema);
export default business;
