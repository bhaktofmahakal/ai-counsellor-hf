
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const email = 'utsavmishraa005@gmail.com';
        console.log(`Testing query with relations for: ${email}`);
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                shortlists: {
                    include: {
                        university: true,
                    },
                },
                tasks: true,
            },
        });
        console.log('Result:', JSON.stringify(user, null, 2));
    } catch (e) {
        console.error('FAILED:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
