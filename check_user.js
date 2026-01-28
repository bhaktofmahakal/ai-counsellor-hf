const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const email = process.argv[2];
    if (!email) {
        console.error('Usage: node check_user.js <email>');
        process.exit(1);
    }
    const user = await prisma.user.findUnique({
        where: { email },
    });
    console.log('USER_INFO:', JSON.stringify(user, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
