import mongoose from "mongoose";

type Quantity = {
    no: number;
    billNo?: number;
    firmName?: string;
    createdAt: Date;
};

type QuantityHistory = {
    quantity: Quantity;
    updatedAt?: Date;
};

type Attribute = {
    name: string;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    value: any;
};

type TProduct = {
    name: string;
    brandName: string;
    description?: string;
    openingStock: number;
    stockType: string;
    quantity: Quantity;
    quantityHistory?: QuantityHistory[];
    batchNo?: string;
    manufacturingDate?: Date;
    expiryDate?: Date;
    unitMrp: number;
    images?: string[];
    attributes?: Attribute[];
    countryCode: string;
    businessId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
};

export type T_idProduct = TProduct & { _id: string | mongoose.ObjectId };

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
            type: Number,
            required: true,
        },
        stockType: { type: String, required: true },

        // Quantity information
        quantity: {
            no: {
                type: Number,
                required: true,
            },

            billNo: { type: Number, default: null },
            firmName: {
                type: String,
                default: null,
            },

            createdAt: { type: Date, default: Date.now() },
        },

        quantityHistory: {
            type: [
                {
                    quantity: {
                        no: {
                            type: Number,
                            required: true,
                        },

                        billNo: { type: Number, default: null },

                        firmName: {
                            type: String,
                            default: null,
                        },

                        createdAt: { type: Date, required: true },
                    },
                    updatedAt: { type: Date, default: Date.now() },
                },
            ],
            default: [],
        },

        // Product details
        batchNo: { type: String, default: null },
        manufacturingDate: { type: Date, default: null },
        expiryDate: { type: Date, default: null },

        // Pricing
        unitMrp: { type: Number, required: true },

        // Images
        images: { type: [String], default: [] },

        // Flexible attributes
        attributes: [
            {
                _id: false, // This will prevent MongoDB from automatically assigning an _id

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

const Product = mongoose.model<TProduct>("Product", productSchema);
export default Product;
