import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		brandName: {
			type: String,
			required: true,
		},

		openingStock: {
			type: String,
			required: true,
		},

		specification: { type: String, default: null },
		description: { type: String, default: null },

		batchNo: { type: String, default: null },

		manufacturingDate: { type: Date, default: null },
		expiryDate: { type: Date, default: null },

		unitMrp: { type: Number, required: true },
		sellingPrice: { type: Number, required: true },

		images: { type: [String], default: [] },

		// TODO -> adminstrative descison pending for sizes.
		// sizes: { type: [], default: null },

		colors: { type: [String], default: null },

		weight: { type: Number, default: null },
		weightUnit: { type: String, default: "kg" }, // 'kg', 'lb', etc.

		volume: { type: Number, default: null },
		volumeUnit: { type: String, required: true, default: "liters" }, // 'liters', 'gallons', etc.

		stockType: { type: [String], default: [], required: true },

		countryCode: { type: String, required: true },

		businessId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "business",
		},

		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "user",
		},
	},
	{ timestamp: true, autoIndex: true },
);

const product = mongoose.model("Product", productSchema);
export default product;
