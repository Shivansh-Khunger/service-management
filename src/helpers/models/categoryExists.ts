// Import types
import type { T_idCategory } from "@models/category";
import type { NextFunction } from "express";

// Import necessary modules
import category from "@models/category";

import augmentAndForwardError from "@utils/errorAugmenter";

// Function to check if a ategory exists by a criteria
export async function ifCategoryExists(
    next: NextFunction,
    criteria: Partial<T_idCategory>,
) {
    const funcName = "ifCategoryExists";
    try {
        // Check if subCategory exists with given criteria
        const categoryExists = await category.exists(criteria);

        // Return the result
        return categoryExists;
    } catch (err) {
        augmentAndForwardError({
            next: next,
            err: err,
            funcName: funcName,
        });
    }
}

export default ifCategoryExists;
