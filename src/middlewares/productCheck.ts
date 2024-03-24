import type { T_idProduct } from "@models/product";
// Import types
import type { NextFunction, Request, Response } from "express";
import type mongoose from "mongoose";

// Import necessary modules
import ifProductExists from "@helpers/models/productExists";
import validateDocumentExistence from "./helpers/valDocExistence";

import augmentAndForwardError from "@utils/errorAugmenter";

export type ProductCheckOptions =
    | {
          checkIn: "body";
          bodyEntity: string;
          entity: string;
          passIfExists: boolean;
          key: keyof T_idProduct;
      }
    | {
          checkIn: "query" | "params";
          bodyEntity: undefined | null;
          entity: string;
          passIfExists: boolean;
          key: keyof T_idProduct;
      };

// Middleware function to check if a product exists
const checkForProduct = ({
    checkIn,
    bodyEntity,
    entity,
    passIfExists,
    key = "name",
}: ProductCheckOptions) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // Define the function name for error handling
        const collectionName = "Product";
        const funcName = "checkForProduct";

        let valToKey: string;
        let productExists: { _id: mongoose.Types.ObjectId } | null | undefined;

        let errMessage: string;
        try {
            switch (checkIn) {
                case "body":
                    valToKey = req.body[bodyEntity][entity];
                    productExists = await ifProductExists(next, {
                        [key]: valToKey,
                    });

                    validateDocumentExistence({
                        nextFunction: next,
                        docExists: productExists,
                        passIfExists: passIfExists,
                        collection: collectionName,
                        collectionAttr: valToKey,
                    });
                    break;
                case "query":
                    // added for future use
                    break;
                case "params":
                    valToKey = req[checkIn][entity];
                    productExists = await ifProductExists(next, {
                        [key]: valToKey,
                    });

                    validateDocumentExistence({
                        nextFunction: next,
                        docExists: productExists,
                        passIfExists: passIfExists,
                        collection: collectionName,
                        collectionAttr: valToKey,
                    });
                    break;
            }
        } catch (err) {
            augmentAndForwardError({
                next: next,
                err: err,
                funcName: funcName,
                errStatus: 400,
            });
        }
    };
};

export default checkForProduct;
