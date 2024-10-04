import { SESClient } from "@aws-sdk/client-ses";
import AWS from "aws-sdk";

// const ses = new AWS.SES({
//   region: "ap-south-1",
//   // accessKeyId: "AKIAQ4NXQETGXZDY4W4H",
//   // secretAccessKey: "Id02RZIwsNbZdojclBKoQHPLDxYzA5FYZ1AsHj1",
// });

const ses = new SESClient({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export default ses;
