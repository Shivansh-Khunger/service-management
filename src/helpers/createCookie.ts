// Importing the Response type from express
import type { Response } from "express";

// Defining the options for the insertJWT function
type insertJWTOptions = {
    res: Response; // The response object to set the cookie on
    field: string; // The name of the cookie
    fieldValue: string; // The value of the cookie
    maxAge: number; // The maximum age of the cookie in milliseconds
};

// Function to set a JWT as a cookie on a response object
export function insertJWT({
    res,
    field,
    fieldValue,
    maxAge,
}: insertJWTOptions) {
    // Set the cookie on the response object
    res.cookie(field, fieldValue, {
        secure: true, // The cookie will only be sent over HTTPS
        httpOnly: true, // The cookie cannot be accessed or modified by client-side JavaScript
        signed: true, // The cookie is signed to verify its integrity
        maxAge: maxAge, // The maximum age of the cookie in milliseconds
    });
}
