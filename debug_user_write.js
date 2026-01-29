const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function main() {
    const email = process.argv[2];
    const user = await prisma.user.findUnique({
        where: { email },
    });
    fs.writeFileSync('user_debug.json', JSON.stringify(user, null, 2), 'utf8');
    console.log('DONE');
}

main().catch(console.error).finally(() => prisma.$disconnect());
