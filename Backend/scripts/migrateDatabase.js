const mongoose = require('mongoose');

// Source (Old) Cluster
const SOURCE_URI = 'mongodb+srv://dazzlingsky:dazzling123@cluster0.hjdgp6q.mongodb.net/dazzling-sky?appName=Cluster0';

// Destination (New) Cluster
const DEST_URI = 'mongodb+srv://softnovatech24:softnovatech24@cluster0.xz6g4.mongodb.net/Dazzling-sky?retryWrites=true&w=majority&appName=Cluster0';

async function migrate() {
  console.log('========================================');
  console.log('🚀 DAZZLING SKY: DATABASE MIGRATION');
  console.log('========================================');

  console.log('1. Connecting to SOURCE database...');
  const sourceConn = await mongoose.createConnection(SOURCE_URI).asPromise();
  console.log('✅ Connected to Source Cluster');

  console.log('2. Connecting to DESTINATION database...');
  const destConn = await mongoose.createConnection(DEST_URI).asPromise();
  console.log('✅ Connected to Destination Cluster\n');

  const sourceDb = sourceConn.db;
  const destDb = destConn.db;

  const collections = await sourceDb.listCollections().toArray();
  const collectionNames = collections.map(c => c.name).filter(name => !name.startsWith('system.'));

  console.log(`Found ${collectionNames.length} collections to migrate: ${collectionNames.join(', ')}\n`);

  const summary = [];

  for (const colName of collectionNames) {
    console.log(`--- Migrating collection: "${colName}" ---`);
    const sourceCol = sourceDb.collection(colName);
    const destCol = destDb.collection(colName);

    // 1. Fetch all docs from source
    const docs = await sourceCol.find({}).toArray();
    console.log(`  Source documents found: ${docs.length}`);

    // 2. Clear destination collection if it has any leftover data
    await destCol.deleteMany({});

    // 3. Insert documents if any exist
    if (docs.length > 0) {
      const insertResult = await destCol.insertMany(docs, { ordered: true });
      console.log(`  Successfully inserted ${insertResult.insertedCount} documents into Destination`);
    } else {
      console.log('  Collection is empty, created placeholder in Destination');
    }

    // 4. Replicate indexes (exclude '_id_' which MongoDB generates automatically)
    const indexes = await sourceCol.indexes();
    for (const index of indexes) {
      if (index.name === '_id_') continue;
      
      const { key, name, unique, sparse, expireAfterSeconds } = index;
      const options = { name };
      if (unique) options.unique = true;
      if (sparse) options.sparse = true;
      if (expireAfterSeconds !== undefined) options.expireAfterSeconds = expireAfterSeconds;

      try {
        await destCol.createIndex(key, options);
        console.log(`  Created index "${name}" on destination`);
      } catch (idxErr) {
        console.warn(`  Warning creating index "${name}":`, idxErr.message);
      }
    }

    // 5. Verification
    const destCount = await destCol.countDocuments();
    const isMatch = docs.length === destCount;
    summary.push({
      collection: colName,
      sourceCount: docs.length,
      destCount: destCount,
      status: isMatch ? 'VERIFIED ✅' : 'MISMATCH ❌'
    });
    console.log(`  Verification: Source (${docs.length}) === Dest (${destCount}) -> ${isMatch ? 'PASS' : 'FAIL'}\n`);
  }

  console.log('========================================');
  console.log('📊 MIGRATION SUMMARY REPORT');
  console.log('========================================');
  console.table(summary);

  const allPassed = summary.every(s => s.status === 'VERIFIED ✅');
  if (allPassed) {
    console.log('\n🎉 ALL COLLECTIONS & DOCUMENTS MIGRATED AND VERIFIED SUCCESSFULLY!');
  } else {
    console.error('\n⚠️ Some collections failed verification. Please review the table above.');
  }

  await sourceConn.close();
  await destConn.close();
  process.exit(allPassed ? 0 : 1);
}

migrate().catch(err => {
  console.error('Fatal error during migration:', err);
  process.exit(1);
});
