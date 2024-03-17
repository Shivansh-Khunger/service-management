// Import the nanoid function from the nanoid module
import { nanoid } from "nanoid";

// Define a function to generate a referral code
function generateReferal(userName: string) {
	// Generate a random string using the uuidv4 function
	const randomStr = nanoid(13);

	// Construct the referral code by concatenating "ijuju-", the user's name, and the random string
	const referalCode = `ijuju-${userName}-${randomStr}`;

	// Return the referral code
	return referalCode;
}

// Export the generateReferal function as the default export of this module
export default generateReferal;
