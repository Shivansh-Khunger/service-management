class ResponsePayload {
	constructor() {
		this.isSuccess = false;
		this.hasError = false;
		this.message = "";
		this.data = null;
	}

	setSuccess(message, data = null) {
		this.isSuccess = true;
		this.message = message;
		this.data = data;
	}

	setError(message) {
		this.hasError = true;
		this.message = message;
	}
}

export default ResponsePayload;
