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
// async function hashString(str: string) {
//   const saltRounds = 10;
//   const hashedString = await bcrypt.hash(str, saltRounds);
//   return hashedString;
// }

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

    // const hashedOtp = await hashString(otp);
    // console.log(hashedOtp);
    res.status(200).send({ otp: otp });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

export { sendOtp };
