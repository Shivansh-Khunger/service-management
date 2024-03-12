class ResponsePayload {
	isSuccess: boolean;
	hasError: boolean;
	message: string;
	data: unknown;

	constructor() {
		this.isSuccess = false;
		this.hasError = false;
		this.message = "";
		this.data = null;
	}

	setSuccess(message: string, data?: unknown) {
		this.isSuccess = true;
		this.message = message;
		this.data = data;
	}

	setError(message: string) {
		this.hasError = true;
		this.message = message;
	}

	setConflict(message: string) {
		this.message = message;
	}
}

export default ResponsePayload;
