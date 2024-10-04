import { prisma } from "../db";
import type { Request, Response } from "express";

const handleBounce = async (req: Request, res: Response): Promise<void> => {
  const { eventType, bounce } = req.body;

  if (!eventType || !bounce || eventType !== "Bounce") {
    res.status(400).json({ message: "Invalid or missing event type" });
    return;
  }

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
