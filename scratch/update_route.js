const fs = require('fs');
const path = 'app/api/[[...path]]/route.js';
let content = fs.readFileSync(path, 'utf8');

const target = `async function getDb() {
  if (!cachedClient) {
    cachedClient = new MongoClient(MONGO_URL)
    await cachedClient.connect()
  }
  return cachedClient.db(DB_NAME)
}`;

const replacement = `async function getDb() {
  try {
    if (!cachedClient) {
      cachedClient = new MongoClient(MONGO_URL, { serverSelectionTimeoutMS: 5000 })
      await cachedClient.connect()
    }
    return cachedClient.db(DB_NAME)
  } catch (e) {
    console.error('Database connection error', e)
    throw new Error('Database connection failed. Check your MONGO_URL in .env')
  }
}`;

content = content.replace(target, replacement);
fs.writeFileSync(path, content);
console.log('File updated successfully');
