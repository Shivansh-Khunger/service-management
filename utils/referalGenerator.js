import { v4 as uuidv4 } from "uuid";

function generateReferal(tempUserFirstName) {
  let referalCode;
  let randomStr = uuidv4();

  referalCode = "ijuju-" + tempUserFirstName + "-" + randomStr;

  return referalCode;
}

export default generateReferal;
