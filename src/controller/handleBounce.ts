import { prisma } from "../db";
import type { Request, Response } from "express";
import ses from "../helper/ses"; // Ensure this import is correctly set up for your SES helper

const handleBounce = async (req: Request, res: Response): Promise<void> => {
  const b = req.body;
  const body = JSON.parse(b);

  try {
    if (body.eventType === "Open") {
      const { mail } = body;
      const { destination } = mail;

      destination.map(async (email: string) => {
        const data = await prisma.email.findUnique({ where: { email: email } });
        console.log(data?.id);

        if (data?.id) {
          await prisma.tracking.upsert({
            where: { emailId: data.id },
            update: {
              open: true, // Set open to true
              openCount: { increment: 1 }, // Increment the open count
              openedAt: new Date(), // Set the opened timestamp
            },
            create: {
              emailId: data.id,
              open: true,
              openCount: 1, // Start with 1 open
              openedAt: new Date(), // Set the opened timestamp
              createdAt: new Date(), // Set the created timestamp
            },
          });
        }
      });
    } 
    else if (body.eventType === "Click") {
      const { mail } = body;
      const { destination } = mail;

      destination.map(async (email: string) => {
        const data = await prisma.email.findUnique({ where: { email: email } });
        console.log(data?.id);

        if (data?.id) {
          await prisma.tracking.upsert({
            where: { emailId: data.id },
            update: {
              clicked: true, // Set clicked to true
              clickCount: { increment: 1 }, // Increment the click count
              clickedAt: new Date(), // Set the clicked timestamp
            },
            create: {
              emailId: data.id,
              clicked: true,
              clickCount: 1, // Start with 1 click
              clickedAt: new Date(), // Set the clicked timestamp
              createdAt: new Date(), // Set the created timestamp
            },
          });
        }
      });
    } 
    else if (body.eventType === "Bounce" && body.bounce) {
      const { bouncedRecipients } = body.bounce;

      for (const recipient of bouncedRecipients) {
        const { emailAddress } = recipient;

        await prisma.email.upsert({
          where: { email: emailAddress },
          update: { status: "BOUNCED" }, // Update status to bounced
          create: {
            email: emailAddress,
            status: "BOUNCED", // Create email entry with bounced status
          },
        });
      }
    } else {
      res.status(400).json({ message: "Invalid event type or missing data" });
      return;
    }

    res.status(200).json({ message: "Event handled successfully" });
  } catch (error) {
    console.error("Error handling event:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { handleBounce };
