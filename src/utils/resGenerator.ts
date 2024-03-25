// Define a class for the response payload
class ResponsePayload {
    // A flag indicating whether the operation was successful
    isSuccess: boolean;
    // A flag indicating whether there was an error
    hasError: boolean;
    // A message providing more information about the operation
    message: string;
    // The data returned by the operation, if any
    data?: undefined | null | unknown;

    // The constructor initializes the response payload with default values
    constructor() {
        this.isSuccess = false;
        this.hasError = false;
        this.message = "";
        this.data = null;
    }

    // setSuccess is used to mark the operation as successful and set the message and data
    setSuccess(message: string, data?: unknown) {
        this.isSuccess = true;
        this.message = message;
        this.data = data;
    }

    // setError is used to mark the operation as having an error and set the error message
    setError(message: string) {
        this.hasError = true;
        this.message = message;
    }

    // setConflict is used to set a conflict message without changing the success or error flags
    setConflict(message: string) {
        this.message = message;
    }
}

// Export the ResponsePayload class so it can be used in other modules
export default ResponsePayload;
