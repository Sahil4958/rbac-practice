import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
console.log('seed started');

const main = async () => {
  await prisma.role.createMany({
    data: [
      {
        name: 'Super_Admin',
        code: 'SUPER_ADMIN',
        description: 'FUll system access',
      },
      { name: 'Admin', code: 'ADMIN', description: 'Administrative access' },
      {
        name: 'Operations',
        code: 'OPERATIONS',
        description: 'Operations team',
      },
      { name: 'Marketing', code: 'MARKETING', description: 'Marketing team' },
      { name: 'Finance', code: 'FINANCE', description: 'Finance team' },
      { name: 'Advisor', code: 'ADVISOR', description: 'Business advisor' },
      { name: 'Lawyer', code: 'LAWYER', description: 'Legal advisor' },
      { name: 'CPA', code: 'CPA', description: 'Certified Public Accountant' },
      { name: 'Investor', code: 'INVESTOR', description: 'Platform investor' },
    ],
  });

};
main()
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
