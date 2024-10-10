import { prisma } from "../db";
import type { Request, Response } from "express";
import ses from "../helper/ses"; // Make sure this import is correctly set up for your SES helper
import { SendEmailCommand } from "@aws-sdk/client-ses";

const handleBounce = async (req: Request, res: Response): Promise<void> => {
  const { eventType, Message } = req.body;

  console.log(req.body);

  try {
    // Parse the Message string to JSON
    const messageData = JSON.parse(Message);

    // Destructure necessary data from the parsed message
    const { eventType: parsedEventType, bounce } = messageData;

    if (parsedEventType === "Bounce" && bounce) {
      const { bouncedRecipients } = bounce;

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
    } else {
      res.status(400).json({ message: "Invalid event type or missing bounce data" });
    }
  } catch (error) {
    console.error("Error handling bounce event:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { handleBounce };
