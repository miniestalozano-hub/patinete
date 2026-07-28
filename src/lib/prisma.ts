import { PrismaClient } from "@prisma/client";

// En desarrollo, Next.js recarga los modulos en caliente (HMR), lo que
// crearia una nueva instancia de PrismaClient en cada recarga si no la
// guardamos en el objeto global. Este patron es el recomendado por Prisma.

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
