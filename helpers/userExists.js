import user from "../models/user";

export async function ifUserExistsByEmail(userEmail, userPhoneNumber) {
	const user = await user.findOne(
		{
			$or: [
				{
					email: userEmail,
				},
				{
					phoneNumber: userPhoneNumber,
				},
			],
		},
		{ _id: true },
	);

	if (user) {
		return true;
	}

	return false;
}

export async function ifUserExistsById(userId) {
	const user = await user.findById(
		{
			userId,
		},
		{ _id: true },
	);

	if (user) {
		return true;
	}

	return false;
}

export async function getUserImei(userId) {
	const user = await user.findById(
		{
			userId,
		},
		{ _id: true, imeiNumber: true },
	);

	if (user) {
		return user;
	}

	return null;
}
