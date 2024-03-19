// Import necessary modules
import bcrypt from "bcrypt";
import hashPassword from "../../../helpers/hashPassword";
import CustomError from "../../../utils/customError";
import generateName from "./model/testNameGenerator";

const funcName = "hashPassword";
const testNames = generateName(funcName);
describe(testNames.testSuite, () => {
	let unhashedString: string;
	let hashedString: string;

	beforeEach(() => {
		unhashedString = "";
	});

	test(`${funcName}_if Returns hashed for non-empty string`, async () => {
		unhashedString = "abhc";
		hashedString = await hashPassword(unhashedString);

		expect(hashedString).not.toBe(unhashedString);
		expect(bcrypt.compare(unhashedString, hashedString)).toBeTruthy();
	});

	test(`${funcName}_if throws error for empty string`, async () => {
		await expect(hashPassword(unhashedString)).rejects.toThrow(CustomError);
	});
});
