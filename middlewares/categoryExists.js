import {
	ifCategoryExistsByName,
	ifCategoryExistsById,
} from "../helpers/categoryExists.js";

export async function ifCategoryExistsByNameMdlwre(req, res, next) {
	const funcName = `ifCategoryExistsByName`;

	const { categoryName } = req.body.categoryData;

	try {
		const categoryExists = await ifCategoryExistsByName(categoryName);

		if (categoryExists) {
			const errMessage = `the request could not be completed because the category-: ${categoryName} already exists.`;
			const error = new Error(errMessage);

			error.statusCode = 400;

			throw error;
		} else {
			next();
		}
	} catch (err) {
		// Add the function name to the error object
		err.funcName = funcName;

		// Throw the error to be caught in the controller catch block
		next(err);
	}
}

export async function ifCategoryExistsByIdMdlwre(req, res, next) {
	const funcName = `ifCategoryExistsById`;

	const { categoryId } = req.params;

	try {
		const categoryExists = await ifCategoryExistsById(categoryId);

		if (!categoryExists) {
			const errMessage = `the request could not be completed because the category-: ${categoryId} does not exist.`;
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
