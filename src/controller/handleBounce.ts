import { prisma } from "../db";
import type { Request, Response } from "express";
import ses from "../helper/ses";
import { SendEmailCommand } from "@aws-sdk/client-ses";

const handleBounce = async (req: Request, res: Response): Promise<void> => {
  const { eventType, bounce } = req.body;
  const params = {
    Destination: {
      ToAddresses: ["aayanguptastudent@gmail.com"],
    },
    Message: {
      Body: {
        Text: {
          Charset: "UTF-8",
          Data: `${JSON.stringify(req.body)}`,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "This is sample body",
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
  } catch (err) {
    console.error(err);
  }
  // if (!eventType || !bounce || eventType !== "Bounce") {
  //   res.status(400).json({ message: "Invalid or missing event type" });
  //   return;
  // }

  const { bouncedRecipients } = bounce;

  try {
    for (const recipient of bouncedRecipients) {
      const { emailAddress } = recipient;

      await prisma.email.upsert({
        where: { email: emailAddress },
        update: { status: "BOUNCED" },
        create: {
          email: emailAddress,
          status: "BOUNCED",
        },
      });
    }

    res.status(200).json({ message: "Bounce event handled successfully" });
  } catch (error) {
    console.error("Error handling bounce event:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { handleBounce };
