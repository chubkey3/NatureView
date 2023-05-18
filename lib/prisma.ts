// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

declare global {
    var prisma: PrismaClient
}

if (process.env.PROD === 'true') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;