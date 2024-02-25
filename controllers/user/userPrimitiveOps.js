import user from "../../models/user.js";

import hashPassword from "../../helpers/hashPassword.js";
import ifUserExists from "../../helpers/userExists.js";

import generateReferal from "../../utils/referalGenerator.js";
import ResponsePayload from "../../utils/resGenerator.js";

// TODO -> implement schema validation with JOI.
// TODO -> think & implement auth soln.

export async function registerNewUser(req, res, next) {
	const resPayload = new ResponsePayload();

	try {
		if (!req.body.email) {
			resPayload.message = "Email missing.";
			return res.json(resPayload);
		}

		if (!req.body.firstName) {
			resPayload.message = "First Name missing.";
			return res.json(resPayload);
		}

		if (!req.body.password) {
			resPayload.message = "Password missing.";
			return res.json(resPayload);
		}

		if (!req.body.phoneNumber) {
			resPayload.message = "PhoneNumber missing.";
			return res.json(resPayload);
		}

		const ifUser = await ifUserExists(req.body.email, req.body.phoneNumber);

		if (ifUser) {
			// get referal code.
			let referalCode = req.body.referalCode;

			// update bounty of the user whoose referal code was provided.
			if (referalCode != "") {
				const userWithReferalCode = user.updateOne(
					{
						referalCode: referalCode,
					},
					{ $inc: { bounty: 1 } },
				);
			}

			// generate referal code for the user itself.
			referalCode = generateReferal();

			// hash password
			const hashedPassword = await hashPassword(req.body.password);

			const newUser = await user.create({
				firstName: req.body.firstName,

				lastName: req.body.lastName,

				email: req.body.email,

				phoneNumber: req.body.phoneNumber,

				password: hashedPassword,

				referalCode: referalCode,

				countryCode: req.body.countryCode,

				pushToken: req.body.pushToken,

				profilePic: req.body.profilePic,

				imeiNumber: req.body.imeiNumber,

				geoLocation: [
					req.body.geoLocation.longi || 0,
					req.body.geoLocation.lati || 0,
				],
			});

			// unable to understand from here ->

			// let phoneNum = req.body.phoneNumber;

			// if (phoneNum.length > 10) {
			// 	phoneNum = phoneNum.substr(phoneNum.length - 10); // => "Tabs1"
			// }

			// let regex = new RegExp([phoneNum].join(""), "i");

			// let usrFoundWithContactList = await MyContactList.find({
			// 	phone: {
			// 		$regex: phoneNum,
			// 	},
			// });

			// console.log(usrFoundWithContactList);

			// usrFoundWithContactList.forEach((element) => {
			// 	element.ijujuId = newUser._id;
			// 	element.save();
			// });

			//find user from contact sync

			// -> to here

			// TODO -> make a serverless function for sending emails

			// send email here

			// let mailObj = {
			//   to: createdUser.email,
			//   from: process.env.TRANSACTIONS_FROM_EMAIL,
			//   subject: "Welcome to ijuju.",
			//   templateId: "c55194be-622d-48b2-bdc3-ffbdd4e5796b",
			//   // await emailTemplates.getTemplateIdFromName(
			//   //   "register-user"
			//   // ),
			//   text: ".",
			//   substitutions: {
			//     userName: createdUser.email,
			//     firstName: createdUser.firstName,
			//   },
			// };

			// commonController.sendEmail(mailObj);

			const resMessage = "user registered succesfully.";

			resPayload.setSuccess(resMessage, newUser);

			res.log.info(
				resPayload,
				"-> response payload for registerNewUser function",
			);
			return res.status(201).json(resPayload);
		} else {
			const resMessage = `user already exists with given eMail or phoneNumber.`;

			resPayload.setConflict(resMessage);

			res.log.info(
				resPayload,
				"-> response payload for registerNewUser function",
			);
			return res.status(409).json(resPayload);
		}
	} catch (err) {
		err.funcName = `registerNewUser`;

		next(err);
	}
}

export async function deleteUser(req, res, next) {
	const resPayload = new ResponsePayload();

	try {
		const userId = mongoose.Types.ObjectId(req.params.id);

		// TODO -> all models are not implemented yet.

		// await Promise.all([
		// 	Banner.remove({ user: userId }),
		// 	Broadcast.remove({ user: userId }),
		// 	ImAvailable.remove({ user: userId }),
		// 	Imoccupiedby.remove({ user: userId }),
		// 	ProductDeal.remove({ user: userId }),
		// 	ProductMaster.remove({ user: userId }),
		// 	UserBusiness.remove({ user: userId }),
		// ]);

		const messageFromDb = await user.findByIdAndDelete({ _id: userId });

		if (messageFromDb.acknowledged == true && messageFromDb.deletedCount == 1) {
			const resMessage = "user deleted successfully";

			resPayload.setSuccess(resMessage);

			res.log.info(resPayload, "-> response payload for deleteUser function");
			res.status(200).json(resPayload);
		} else {
			resPayload.setConflict(resMessage);

			res.log.info(resPayload, "-> response payload for deleteUser function");
			res.status(401).json(resPayload);
		}
	} catch (err) {
		err.funcName = `deleteUser`;

		next(err);
	}
}
