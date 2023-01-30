class JsonApiResponse {
	constructor(data) {
		this.response = data;
		this.status_code = data.status;
	}

	/**
	 * Retrieve a specific attributes value into the HTTP Response Object
	 * @param  { String } value Name of a specific input value
	 * @return { String } Value of an attribute
	 */
	data(value) {
		return this.response.data.data.attributes[value];
	}

	/**
	 * Retrieve the global Object into the HTTP Response Object
	 * @return { Object } Data of the HTTP Response Object
	 */
	responseObject() {
		return this.response.data;
	}

	/**
	 * Return the meta object from the response
	 * @returns { Object } Meta of the HTTP Response Object
	 */
	responseMeta() {
		let object = this.responseObject();
		return object && object.meta ? object.meta : null;
	}

	/**
	 * Get the pagination object from the response
	 * @returns { Object } Pagination of the HTTP Response Object
	 */
	getPagination() {
		let meta = this.responseMeta();
		return meta && meta.pagination ? meta.pagination : null;
	}

	/**
	 * Retrieve the global Object data into the HTTP Response Object
	 * @return { Object } Data of the HTTP Response Object
	 */
	dataObject() {
		let response = this.responseObject();

		if (typeof response["data"] === "undefined") {
			response["data"] = new Object();
		}

		if (typeof response["included"] !== "undefined") {
			response.data["included"] = response.included;
		}

		return response.data;
	}

	/**
	 * Retrieve the global Object errors into the HTTP Response Object
	 * @return { Object } Errors of the HTTP Response Object
	 */
	errorObject() {
		return typeof this.response.response !== "undefined"
			? this.response.response.data
			: this.response;
	}
}

export default JsonApiResponse;
