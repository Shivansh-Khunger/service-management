// Import types
import type { T_idSubCategory } from "@models/subCategory";
import type { NextFunction, Request, Response } from "express";
import type mongoose from "mongoose";

// Import necessary modules
import ifSubCategoryExists from "@helpers/models/subCategoryExists";
import validateDocumentExistence from "./helpers/valDocExistence";

import augmentAndForwardError from "@utils/errorAugmenter";

export type SubCategoryCheckOptions =
    | {
          checkIn: "body";
          bodyEntity: string;
          entity: string;
          passIfExists: boolean;
          key: keyof T_idSubCategory;
      }
    | {
          checkIn: "query" | "params";
          bodyEntity: undefined | null;
          entity: string;
          passIfExists: boolean;
          key: keyof T_idSubCategory;
      };

export const checkForSubCategory = ({
    checkIn,
    bodyEntity,
    entity,
    passIfExists,
    key = "name",
}: SubCategoryCheckOptions) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const collectionName = "SubCategory";
        const funcName = "checkForSubCategory";

        let valToKey: string;
        let subCategoryExists:
            | { _id: mongoose.Types.ObjectId }
            | null
            | undefined;

        let errMessage: string;
        try {
            switch (checkIn) {
                case "body":
                    valToKey = req.body[bodyEntity][entity];
                    subCategoryExists = await ifSubCategoryExists(next, {
                        [key]: valToKey,
                    });

                    validateDocumentExistence({
                        nextFunction: next,
                        docExists: subCategoryExists,
                        passIfExists: passIfExists,
                        collection: collectionName,
                        collectionAttr: valToKey,
                    });
                    break;

                case "query":
                    // added for future use
                    break;

                case "params":
                    valToKey = req.params[entity];
                    subCategoryExists = await ifSubCategoryExists(next, {
                        [key]: valToKey,
                    });

                    validateDocumentExistence({
                        nextFunction: next,
                        docExists: subCategoryExists,
                        passIfExists: passIfExists,
                        collection: collectionName,
                        collectionAttr: valToKey,
                    });
                    break;
            }
        } catch (err) {
            // Handle the caught error by passing it to the augmentAndForwardError function which will pass it to the error handling middleware
            augmentAndForwardError({
                next: next,
                err: err,
                funcName: funcName,
                errStatus: 400,
            });
        }
    };
};

export default checkForSubCategory;
