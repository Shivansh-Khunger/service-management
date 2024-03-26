import mongoose from "mongoose";

type TCategory = {
    name: string;
    image?: string;
    description?: string;
};

export type T_idCategory = TCategory & { _id: string | mongoose.ObjectId };

// Define the schema for a category
const categorySchema = new mongoose.Schema(
    {
        // The name of the category
        name: {
            type: String,
            required: true, // This field is required
        },

        // The image associated with the category
        image: {
            type: String,
        },

        // The description of the category
        description: {
            type: String,
        },
    },
    // Options: enable timestamps and automatic index creation
    { timestamp: true, autoIndex: true },
);

// Create the Category model using the schema
const Category = mongoose.model<TCategory>("Category", categorySchema);

// Export the Category model
export default Category;
