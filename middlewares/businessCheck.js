import business from "../models/business.js";

async function checkForBusiness(req, res, next) {
	try {
		const ifBusiness = await business.findOne(req.params.businessId);

		if (ifBusiness) {
			next();
		} else {
			const err = new Error(
				`business with id-: ${req.params.id} does not exist.`,
			);
			err.status = 404;
			err.funcName = `checkForBusiness`;

			next(err);
		}
	} catch (err) {
		err.funcName = `checkForBusiness`;

		next(err);
	}
}

export default checkForBusiness;
