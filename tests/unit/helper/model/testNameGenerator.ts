function generateName(funcName: string) {
	const testSuiteName = `helper -> ${funcName} tests`;

	const valDocName = `${funcName}_if Returns valid doc for existing details`;
	const invalDocName = `${funcName}_if Returns null for non-existing details`;
	const throwErrName = `${funcName}_if Calls augmentAndForwardError on error`;

	return {
		testSuite: testSuiteName,
		valDoc: valDocName,
		invalDoc: invalDocName,
		throwErr: throwErrName,
	};
}

export default generateName;
