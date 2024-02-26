import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
	{
		// Product identification
		name: {
			type: String,
			required: true,
		},
		brandName: {
			type: String,
			required: true,
		},
		description: { type: String, default: null },

		// Stock information
		openingStock: {
			type: String,
			required: true,
		},
		stockType: { type: String, required: true },

		// Product details
		batchNo: { type: String, default: null },
		manufacturingDate: { type: Date, default: null },
		expiryDate: { type: Date, default: null },

		// Pricing
		unitMrp: { type: Number, required: true },
		sellingPrice: { type: Number, required: true },

		// Images
		images: { type: [String], default: [] },

		// Flexible attributes
		attributes: [
			{
				// The name of the attribute. This could be anything like 'color', 'size', 'weight', etc.
				name: { type: String, required: true },

				// The value of the attribute. This could be any type of data, hence mongoose.Schema.Types.Mixed is used.
				// For example, if the attribute name is 'color', the value could be 'red'.
				// If the attribute name is 'size', the value could be 'M'.
				value: { type: mongoose.Schema.Types.Mixed, required: true },
			},
		],

		// Country code
		countryCode: { type: String, required: true },

		// Business and user information
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
