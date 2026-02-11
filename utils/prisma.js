// import { PrismaClient } from '@prisma/client';

// declare global {
//     var prisma: PrismaClient | undefined
// }

// const prisma = globalThis.prisma || new PrismaClient({
//     log: ['query', 'info', 'warn', 'error'],
// })

// if (process.env.NODE_ENV === 'development') {
//     globalThis.prisma = prisma
// }

// export default prisma

// import { Pool } from 'pg';
// import { PrismaPg } from '@prisma/adapter-pg';
// import { PrismaClient } from '@prisma/client'; // Import from your custom output

// const connectionString = process.env.DATABASE_URL;
// const pool = new Pool({ connectionString });
// const adapter = new PrismaPg(pool);
// export const prisma = new PrismaClient({ adapter }); // This satisfies the 'adapter' requirement


import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
// Import from your specific generated path
// import { PrismaClient } from '@prisma/client';

import pkg from '@prisma/client';

const { PrismaClient } = pkg;


// 1. Get your connection string
const connectionString = process.env.DATABASE_URL;

// 2. Setup the pg Pool
const pool = new Pool({
    connectionString,
    // Add SSL if needed (common for cloud DBs like Supabase/Neon)
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// 3. Create the Prisma Adapter
const adapter = new PrismaPg(pool);

/**
 * 4. Instantiate Prisma Client correctly for Version 7.
 * DO NOT use 'datasources: { db: { url } }' here.
 */
export const prisma = new PrismaClient({
    adapter
});


// import { Pool } from 'pg';
// import { PrismaPg } from '@prisma/adapter-pg';
// import { PrismaClient } from '@prisma/client'; // Import from your custom output

// const connectionString = process.env.DATABASE_URL;
// const pool = new Pool({ connectionString });
// const adapter = new PrismaPg(pool);
// export const db = new PrismaClient({ adapter }); // This satisfies the 'adapter' requirement

