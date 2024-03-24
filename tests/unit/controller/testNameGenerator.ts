const error = "if Calls errorAugmenter when error occurs";

export function generateNameforPrimitive(collectionName: string) {
	const newDocTestsName = {
		success: `if Sends appropiate response when ${collectionName} creation is successfull`,
		unsuccess: `if Sends appropiate response when ${collectionName} creation is unsuccessfull`,
	};

	const delDocTestsName = {
		success: `if Sends appropiate response when ${collectionName} deletion is successfull`,
		unsuccess: `if Sends appropiate response when ${collectionName} deletion is unsuccessfull`,
	};

	return {
		newDoc: newDocTestsName,
		delDoc: delDocTestsName,
		error: error,
	};
}

export function generateNameforManagement(collectionName: string) {
	const updateDocTestsName = {
		success: `if Sends appropiate response when ${collectionName} updation is successfull`,
		unsuccess: `if Sends appropiate response when ${collectionName} updation is unsuccessfull`,
	};

	return {
		updateDoc: updateDocTestsName,
		error: error,
	};
}
