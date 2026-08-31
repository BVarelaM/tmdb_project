const { MongoClient } = require('mongodb');
require('dotenv').config({ override: true });

let client;
let db;

const connectDB = async () => {
    try {
        const { MONGO_USER, MONGO_PASS, MONGO_HOST, MONGO_PORT, MONGO_DB, MONGO_URI, MONGODB_URI } = process.env;

        const dbName = MONGO_DB || 'MovieDB';

        const finalUri = MONGO_URI || MONGODB_URI || 
            `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST || 'mongodb'}:${MONGO_PORT || 27017}/${dbName}?authSource=admin`;

        client = new MongoClient(finalUri);
        await client.connect();
        db = client.db(dbName);

        console.log(`Connection successful (Database: ${dbName})`);
    } catch (error) {
        console.error('Something went wrong connecting:', error.message);
        throw error;
    }
};

const getDB = () => { 
    if (!db) {
        throw new Error('The database is not initialized. Run connectDB() first.');
    }
    return db;
};

const closeDB = async () => {
    if (client) {
        await client.close();
        console.log('Connection to MongoDB closed.');
    }
};

module.exports = {
    connectDB,
    getDB,
    closeDB
};