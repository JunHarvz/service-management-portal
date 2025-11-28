import { PrismaClient } from 'generated/prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DIRECT_URL });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

const password = 'admin123';
const saltOrRounds = 10;

async function main() {
  const hashPassword = await bcrypt.hash(password, saltOrRounds);
  const user = await prisma.account.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashPassword,
      email: 'admin@email.com',
    },
  });

  console.log(user);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
