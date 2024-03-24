// Import types
import type { T_idDeal } from "@models/deal";
import type { NextFunction, Request, Response } from "express";
import type mongoose from "mongoose";

// Import necessary modules
import ifDealExists from "@helpers/models/dealExists";
import validateDocumentExistence from "./helpers/valDocExistence";

import augmentAndForwardError from "@utils/errorAugmenter";

export type DealCheckOptions =
    | {
          checkIn: "body";
          bodyEntity: string;
          entity: string;
          passIfExists: boolean;
          key: keyof T_idDeal;
      }
    | {
          checkIn: "query" | "params";
          bodyEntity: undefined | null;
          entity: string;
          passIfExists: boolean;
          key: keyof T_idDeal;
      };

// Middleware function to check if a deal exists

const checkForDeal = ({
    checkIn,
    bodyEntity,
    entity,
    passIfExists,
    key = "name",
}: DealCheckOptions) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // Define the function name for error handling
        const collectionName = "Deal";
        const funcName = "checkForDeal";

        let valToKey: string;
        let dealExists: { _id: mongoose.Types.ObjectId } | null | undefined;

        let errMessage: string;
        try {
            switch (checkIn) {
                case "body":
                    valToKey = req.body[bodyEntity][entity];
                    dealExists = await ifDealExists(next, {
                        [key]: valToKey,
                    });

                    validateDocumentExistence({
                        nextFunction: next,
                        docExists: dealExists,
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
                    dealExists = await ifDealExists(next, {
                        [key]: valToKey,
                    });

                    validateDocumentExistence({
                        nextFunction: next,
                        docExists: dealExists,
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

// Export the middleware function
export default checkForDeal;
