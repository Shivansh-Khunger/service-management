import mongoose from "mongoose";

type TSubCategory = {
    name?: string;
    subCategoryImage?: string;
    description?: string;
    categoryId: mongoose.Types.ObjectId;
};

export type T_idSubCategory = TSubCategory & {
    _id: string | mongoose.ObjectId;
};

// Define the schema for a subcategory
const subCategorySchema = new mongoose.Schema(
    {
        // The name of the subcategory
        name: {
            type: String,
        },

        // The image associated with the subcategory
        subCategoryImage: {
            type: String,
        },

        // The description of the subcategory
        description: {
            type: String,
        },

        // The ID of the category that this subcategory belongs to
        // This creates a relationship between the Category and SubCategory models
        // Each subcategory is associated with a category
        categoryId: {
            type: mongoose.Schema.Types.ObjectId, // The type is an ObjectId
            ref: "Category", // The reference is the Category model
            required: true, // This field is required
        },
    },
    // Options: enable timestamps and automatic index creation
    { timestamp: true, autoIndex: true },
);

// Create the SubCategory model using the schema
const SubCategory = mongoose.model<TSubCategory>(
    "SubCategory",
    subCategorySchema,
);

// Export the SubCategory model
export default SubCategory;
