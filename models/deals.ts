import mongoose from "mongoose";

type TDeal = {
	name: string;
	startDate: Date;
	endDate: Date;
	description?: string;
	stockType?: string;
	videoUrl?: string;
	images?: string[];
	upiAddress?: string;
	paymentMode?: string;
	ifReturn?: boolean;
	deliveryType?: string;
	returnPolicyDescription?: string;
	marketPrice?: number;
	offerPrice?: number;
	quantity?: number;
	ifHomeDelivery?: boolean;
	freeHomeDeliveryKm?: number;
	costPerKm?: number;
	ifPublicPhone?: boolean;
	ifSellingOnline?: boolean;
	productId: mongoose.Types.ObjectId;
	businessId: mongoose.Types.ObjectId;
	userId: mongoose.Types.ObjectId;
};

export type T_idDeal = TDeal & { _id: string | mongoose.ObjectId };

const dealSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},

		startDate: {
			type: Date,
			required: true,
		},

		endDate: {
			type: Date,
			required: true,
		},

		description: String,

		stockType: String,
		videoUrl: String,
		images: [String],

		upiAddress: String,
		paymentMode: String,

		ifReturn: Boolean,
		deliveryType: String,
		returnPolicyDescription: String,

		marketPrice: Number,
		offerPrice: Number,
		quantity: Number,

		ifHomeDelivery: Boolean,
		freeHomeDeliveryKm: Number,
		costPerKm: Number,

		ifPublicPhone: Boolean,
		ifSellingOnline: Boolean,

		productId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Product",
		},

		businessId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Business",
		},

		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{ timestamp: true, autoIndex: true },
);

const Deal = mongoose.model<TDeal>("deal", dealSchema);

export default Deal;
