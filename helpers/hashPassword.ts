// Import necessary modules
import bcrypt from "bcrypt";
import CustomError from "../utils/customError";

// This function takes a non-hashed password as a parameter
async function hashPassword(nonHashedPassword: string) {
	const funcName = "hashPassword";
	if (nonHashedPassword === "") {
		const err = new CustomError(
			"the request could not be processed cause the provided password is empty",
		);

		err.status = 422;
		err.funcName = funcName;

		throw err;
	}

	// Initialize an empty string for the hashed password
	let hashedPassword = "";

	// Use bcrypt to hash the password with a salt round of 13
	await bcrypt.hash(nonHashedPassword, 13).then((hash) => {
		// Once the password is hashed, assign the hashed password to the variable
		hashedPassword = hash;
	});

	// Return the hashed password
	return hashedPassword;
}

export default hashPassword;
