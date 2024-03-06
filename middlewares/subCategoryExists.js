import {
	ifSubCategoryExistsByName,
	ifSubCategoryExistsById,
} from "../helpers/subCategoryExists.js";

export async function ifSubCategoryExistsByNameMdlwre(req, res, next) {
	const funcName = `ifSubCategoryExistsByName`;

	const { subCategoryName } = req.body.subCategoryData;

	try {
		const subCategoryExists = await ifSubCategoryExistsByName(subCategoryName);

		if (subCategoryExists) {
			const errMessage = `the request could not be completed because the sub-category-: ${subCategoryName} already exists.`;
			const error = new Error(errMessage);

			error.statusCode = 400;

			throw error;
		} else {
			next();
		}
	} catch (err) {
		err.funcName = funcName;

		next(err);
	}
}

export async function ifSubCategoryExistsByIdMdlwre(req, res, next) {
	const funcName = `ifSubCategoryExistsById`;

	const { subCategoryId } = req.params;

	try {
		const subCategoryExists = await ifSubCategoryExistsById(subCategoryId);

		if (!subCategoryExists) {
			const errMessage = `the request could not be completed because the sub-category-: ${subCategoryId} does not exist.`;
			const error = new Error(errMessage);

			error.statusCode = 400;

			throw error;
		} else {
			next();
		}
	} catch (err) {
		err.funcName = funcName;

		next(err);
	}
}
