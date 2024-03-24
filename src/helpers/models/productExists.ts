// Import types
import type { T_idProduct } from "@models/product";
import type { NextFunction } from "express";

// Import necessary modules
import Product from "@models/product";

import augmentAndForwardError from "@utils/errorAugmenter";

// Function to check if a product exists by the criteria
async function ifProductExists(
    next: NextFunction,
    criteria: Partial<T_idProduct>,
) {
    const funcName = "ifProductExists";
    try {
        // Try to find the product
        const productExists = await Product.exists(criteria);

        return productExists;
    } catch (err) {
        augmentAndForwardError({
            next: next,
            err: err,
            funcName: funcName,
        });
    }
}

export default ifProductExists;
