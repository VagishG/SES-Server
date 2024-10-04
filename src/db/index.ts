import  app  from '../app.ts';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function connectDB() {
  try {
    await prisma.$connect();
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port ${process.env.PORT || 8000}`);
    });
  } catch (error) {
    console.error(`Unable to connect to database: ${error}`);
  }
}
export {connectDB,prisma}