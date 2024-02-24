import mongoose from "mongoose";

const userSchema = mongoose.Schema(
	{
		firstName: {
			type: String,
			required: [true, "First Name is required."],
		},

		lastName: {
			type: String,
			required: [true, "Last Name is required."],
		},

		email: {
			type: String,
			required: [true, "Email is required."],
			unique: true,
		},

		phoneNumber: {
			type: String,
			required: [true, "Phone Number is required."],
			unique: true,
		},

		password: {
			type: String,
			required: [true, "Password is required"],
		},

		referalCode: {
			type: String,
		},

		profilePic: {
			type: String,
		},

		countryCode: {
			type: String,
		},

		imeiNumber: {
			type: String,
			default: "",
		},

		isActive: Boolean,

		interestArray: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "subCategoryMaster",
			},
		],

		geoLocation: {
			type: [Number],
			index: "2d", // 0 index longi, 1 index lati
		},

		mailSent: {
			type: Boolean,
			default: false,
		},

		postDealMail: {
			type: Boolean,
			default: false,
		},

		pushToken: String,

		pushTokenActivate: {
			type: Boolean,
			default: true,
		},

		dealbookpushTokenActivate: {
			type: Boolean,
			default: true,
		},

		addbusinesstpfavpushTokenActivate: {
			type: Boolean,
			default: true,
		},

		dealstatuschangepushTokenActivate: {
			type: Boolean,
			default: true,
		},

		manageraddedpushTokenActivate: {
			type: Boolean,
			default: true,
		},

		sendinvitepushTokenActivate: {
			type: Boolean,
			default: true,
		},

		newdealpostedpushTokenActivate: {
			type: Boolean,
			default: true,
		},

		broadcastpushTokenActivate: {
			type: Boolean,
			default: true,
		},

		messagesendpushTokenActivate: {
			type: Boolean,
			default: true,
		},

		gpsTracking: {
			type: Boolean,
			default: true,
		},

		bounty: {
			type: Number,
			default: 0,
		},

		createdOn: {
			type: Date,
			default: Date.now(),
		},
	},
	{
		timestamp: true,
		autoIndex: true,
	},
);

// TODO -> Relocate these functions

// compare input passwod with stored database

// UserSchema.methods.comparedPassword = function (pw, cb) {
//   bcrypt.compare(pw, this.password, function (err, isMatch) {
//     if (err) {
//       return cb(err);
//     }
//     cb(null, isMatch);
//   });
// };

// UserSchema.methods.changePassword = function (password) {
//   // let user = this;
//   console.log("inside changePassword ######## ");
//   bcrypt.genSalt(10, function (err, salt) {
//     if (err) {
//       return err;
//     }
//     bcrypt.hash(password, salt, function (err, hash) {
//       if (err) {
//         return err;
//       }
//       password = hash;
//       console.log("has pass ", password);
//       return password;
//     });
//     return password;
//   });
// };

// UserSchema.pre("save", function (next) {
//   let user = this;
//   if (this.isModified("password") || this.isNew) {
//     bcrypt.genSalt(10, function (err, salt) {
//       if (err) {
//         return next(err);
//       }
//       bcrypt.hash(user.password, salt, function (err, hash) {
//         console.log(hash);
//         if (err) {
//           return next(err);
//         }
//         user.password = hash;
//         next();
//       });
//     });
//   } else {
//     return next();
//   }
// });

const user = model("User", userSchema);
export default user;
