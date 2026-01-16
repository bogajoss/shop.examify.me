import { Client, Databases, ID, Permission, Role } from 'node-appwrite';
import dotenv from 'dotenv';
import fs from 'fs';

if (fs.existsSync('.env.local')) {
  dotenv.config({ path: '.env.local' });
} else {
  dotenv.config({ path: '.env' });
}

const {
  NEXT_PUBLIC_APPWRITE_ENDPOINT,
  NEXT_PUBLIC_APPWRITE_PROJECT_ID,
  APPWRITE_API_KEY,
  NEXT_PUBLIC_APPWRITE_DATABASE_ID,
  NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID,
} = process.env;

if (!APPWRITE_API_KEY) {
  console.error('Error: APPWRITE_API_KEY is missing in .env.local');
  process.exit(1);
}

const client = new Client()
  .setEndpoint(NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(APPWRITE_API_KEY);

const databases = new Databases(client);

async function setup() {
  console.log('🚀 Starting Appwrite Migration...');

  // 1. Setup Database
  try {
    await databases.get(NEXT_PUBLIC_APPWRITE_DATABASE_ID);
    console.log(`✅ Database "${NEXT_PUBLIC_APPWRITE_DATABASE_ID}" already exists.`);
  } catch (e) {
    console.log(`⏳ Creating Database "${NEXT_PUBLIC_APPWRITE_DATABASE_ID}"...`);
    await databases.create(NEXT_PUBLIC_APPWRITE_DATABASE_ID, 'Examify DB');
  }

  // 2. Setup Users Collection
  try {
    await databases.getCollection(NEXT_PUBLIC_APPWRITE_DATABASE_ID, NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID);
    console.log(`✅ Collection "${NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID}" already exists.`);
  } catch (e) {
    console.log(`⏳ Creating Collection "${NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID}"...`);
    await databases.createCollection(
      NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID,
      'Users',
      [
        Permission.read(Role.any()),
        Permission.write(Role.users()), // Authenticated users can write
      ],
      false // documentSecurity disabled for simplicity, using collection level perms
    );
  }

  // 3. Setup Attributes for Users
  const attributes = [
    { key: 'userId', type: 'string', size: 255, required: true },
    { key: 'name', type: 'string', size: 255, required: false },
    { key: 'roll', type: 'string', size: 100, required: true },
    { key: 'phone', type: 'string', size: 20, required: false },
    { key: 'enrolled_batches', type: 'string', size: 255, required: false, array: true },
    { key: 'created_at', type: 'datetime', required: false },
    { key: 'updated_at', type: 'datetime', required: false },
  ];

  for (const attr of attributes) {
    try {
      await databases.getAttribute(NEXT_PUBLIC_APPWRITE_DATABASE_ID, NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID, attr.key);
      console.log(`✅ Attribute "${attr.key}" already exists.`);
    } catch (e) {
      console.log(`⏳ Creating Attribute "${attr.key}"...`);
      if (attr.type === 'string') {
        await databases.createStringAttribute(
          NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID,
          attr.key,
          attr.size,
          attr.required,
          undefined,
          attr.array
        );
      } else if (attr.type === 'datetime') {
        await databases.createDatetimeAttribute(
          NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID,
          attr.key,
          attr.required
        );
      }
      // Wait a bit for attribute to be created before next one (Appwrite requirement)
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // 4. Setup Indexes
  try {
    await databases.getIndex(NEXT_PUBLIC_APPWRITE_DATABASE_ID, NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID, 'idx_roll_unique');
    console.log('✅ Index "idx_roll_unique" already exists.');
  } catch (e) {
    console.log('⏳ Creating Unique Index for "roll"...');
    // Wait for attributes to be "available"
    await new Promise(resolve => setTimeout(resolve, 2000));
    try {
        await databases.createIndex(
          NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID,
          'idx_roll_unique',
          'unique',
          ['roll']
        );
    } catch (idxError) {
        console.warn('⚠️ Could not create index (it might still be processing attributes). Please run again later.');
    }
  }

  console.log('🏁 Migration Finished!');
}

setup().catch(console.error);
