const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.user.findFirst().then(u => console.log(u ? u.email : 'no user')).finally(() => prisma.$disconnect())  
