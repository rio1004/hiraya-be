import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

let prisma: PrismaClient;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set. Please ensure your .env file is configured correctly and loaded.');
}

try {
  const adapter = new PrismaPg({ connectionString });
  prisma = new PrismaClient({ adapter });
} catch (error) {
  console.error("Failed to initialize PrismaClient:", error);
  throw new Error("PrismaClient initialization failed: " + (error instanceof Error ? error.message : String(error)));
}

export default prisma;


