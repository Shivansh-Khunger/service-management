import mongoose from "mongoose";

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
const category = mongoose.model("Category", categorySchema);

// Export the Category model
export default category;
