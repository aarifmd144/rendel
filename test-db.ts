import { prisma } from './src/lib/prisma';

async function main() {
  try {
    const count = await prisma.user.count();
    console.log('User count:', count);
  } catch (error) {
    console.error('Error connecting to DB:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
