import { SendEmailCommand } from "@aws-sdk/client-ses";
import bcrypt from "bcryptjs";
import type { Request, Response } from "express"; // Importing as type-only
import { addEmail, canSendMail } from "../helper/checkStatus";
import ses from "../helper/ses";

// Generate OTP
const generateOTP = (length: number): string => {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  return otp;
};

// Hash a string using bcrypt
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    // Perform some arbitrary operations on the charCode
    hash = (hash << 5) - hash + charCode;
    hash |= 0; // Force it to be a 32-bit integer
  }

  // Convert the final hash number to a hexadecimal string
  return hash.toString(16);
}

// Send OTP via email
const sendOtp = async (req: Request, res: Response) => {
  const { email, subject, length } = req.body;

  // Validate input
  if (!email || !subject || !length) {
    res.status(400).send({ message: "Missing required fields" });
    return;
  }

  // Check if email can receive OTP
  const status = await canSendMail(email);
  if (!status) {
    res.status(400).send({ message: "Email is blocked" });
    return;
  }

  await addEmail(email);

  const otp = generateOTP(length);

  const params = {
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Body: {
        Text: {
          Charset: "UTF-8",
          Data: `Your OTP is ${otp}`,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    ReplyToAddresses: ["support@avyuktsolutions.com"],
    Source: "sales@avyuktsolutions.com",
  };

  try {
    // await ses.sendEmail(params).promise();
    const command = new SendEmailCommand(params);
    await ses.send(command);

    const hashedOtp = await simpleHash(otp);
    // console.log(hashedOtp);
    res.status(200).send({ otp: hashedOtp });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

export { sendOtp };
