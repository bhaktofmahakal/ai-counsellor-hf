
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.university.count();
  console.log('University Count:', count);
  const unis = await prisma.university.findMany({ take: 5 });
  console.log('Sample Universities:', JSON.stringify(unis, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
