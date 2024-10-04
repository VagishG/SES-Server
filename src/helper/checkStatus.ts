import { prisma } from "../db";

const checkStatus = async (email: string) => {
  try {
    const user = await prisma.email.findUnique({
      where: { email: email },
    });
    return user?.status;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const canSendMail = async (email: string) => {
  const status = await checkStatus(email);
  if (!status) {
    return true;
  }
  if (status === "DELIVERED") {
    return true;
  } else {
    return false;
  }
};

const addEmail = async (email: string) => {
  try {
    // Check if the email already exists
    const existingEmail = await prisma.email.findUnique({
      where: { email: email },
    });

    if (!existingEmail) {
      // If email does not exist, add a new entry
      await prisma.email.create({
        data: {
          email: email,
          status: "DELIVERED",
        },
      });
      console.log(`Email ${email} added to the database.`);
    } else {
      console.log(`Email ${email} already exists in the database.`);
    }
  } catch (e) {
    console.log(e);
    return;
  }
};

export { checkStatus, canSendMail, addEmail };
