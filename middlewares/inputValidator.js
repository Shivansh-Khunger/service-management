// Function to validate the request body
export function vaildateBody({ req, res, next, schema, entity = null }) {
    // Initialize a variable to hold any schema validation errors
    let schemaErr;

    // If an entity is provided, validate the entity in the request body
    // Otherwise, validate the entire request body
    if (entity) {
        schemaErr = schema.validate(req.body.entity);
    } else {
        schemaErr = schema.validate(req.body);
    }

    // If there are any schema validation errors
    if (schemaErr) {
        // Get the error message from the first validation error
        const errMessage = schemaErr.details[0].message;

        // Create a new Error with the error message
        const err = new Error(errMessage);
        // Set the HTTP status code for the error
        err.status = 422;

        // Create a log message for the error
        const errLogMessage = `-> req.body could not validate request at route-: ${req.route}`;
        // Set the log message for the error
        err.logMessage = errLogMessage;

        // Pass the error to the next middleware function
        next(err);
    }

    // If there are no schema validation errors, proceed to the next middleware function
    next();
}

// Function to validate the request parameters
export function validateParams({ req, res, next, schema }) {
    // Validate the request parameters against the provided schema
    const schemaErr = schema.validate(req.params);

    // If there are any schema validation errors
    if (schemaErr) {
        // Get the error message from the first validation error
        const errMessage = schemaErr.details[0].message;

        // Create a new Error with the error message
        const err = new Error(errMessage);
        // Set the HTTP status code for the error
        err.status = 422;

        // Create a log message for the error
        const errLogMessage = `-> req.params could not validate request at route-: ${req.route}`;
        // Set the log message for the error
        err.logMessage = errLogMessage;

        // Pass the error to the next middleware function
        next(err);
    }

    // If there are no schema validation errors, proceed to the next middleware function
    next();
}