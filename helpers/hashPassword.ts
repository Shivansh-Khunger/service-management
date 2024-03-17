import bcrypt from "bcrypt";

// This function takes a non-hashed password as a parameter
async function hashPassword(nonHashedPassword: string) {
	// Initialize an empty string for the hashed password
	let hashedPassword = "";

	// Use bcrypt to hash the password with a salt round of 13
	bcrypt.hash(nonHashedPassword, 13).then((hash) => {
		// Once the password is hashed, assign the hashed password to the variable
		hashedPassword = hash;
	});

	// Return the hashed password
	return hashedPassword;
}

export default hashPassword;
