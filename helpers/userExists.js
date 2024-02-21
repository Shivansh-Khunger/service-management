import user from "../models/user";

async function ifUserExists(tempUserEmail, tempUserPhoneNum) {
  const ifUser = await user.findOne(
    {
      $or: [
        {
          email: tempUserEmail,
        },
        {
          phoneNumber: tempUserPhoneNum,
        },
      ],
    },
    { _id: true }
  );

  if (ifUser) {
    return true;
  }

  return false;
}

export default ifUserExists;
