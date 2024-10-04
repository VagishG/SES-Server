import ses from "../helper/ses";
import type { Request, Response } from "express"; // Importing as type-only
import { addEmail, canSendMail } from "../helper/checkStatus";

const sendTemplateMail = async (req: Request, res: Response): Promise<void> => {
  const { email, template } = req.body;
  const allowedEmails: { email: string; company_name: string; person_name: string }[] = [];

  try {
    for (const data of email) {
      const { email: userEmail, company_name, person_name } = data;

      const canSend = await canSendMail(userEmail); // Check if mail can be sent
      if (canSend) {
        await addEmail(userEmail); // Add email to DB if it doesn't exist
        allowedEmails.push({
          email: userEmail,
          company_name,
          person_name,
        });
      }
    }

    const destinations = allowedEmails.map((data) => ({
      Destination: {
        ToAddresses: [data.email],
      },
      ReplacementTemplateData: JSON.stringify({
        company_name: data.company_name,
        person_name: data.person_name,
      }),
    }));

    const params = {
      Source: "Prachi <sales@avyuktsolutions.com>",
      Template: template,
      Destinations: destinations,
      DefaultTemplateData: JSON.stringify({
        company_name: "Default Company",
        person_name: "Default Name",
      }),
    };

    const sendEmail = () =>
      new Promise((resolve, reject) => {
        ses.sendBulkTemplatedEmail(params, (err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      });

    const result = await sendEmail();
    console.log(result);
    res.status(200).json({
      message: "Emails sent successfully",
      allowedEmails,
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { sendTemplateMail };
