const { MongoDb } = require('mongodb');
require('dotenv').config();

const { MONGO_USER, MONGO_PASS, MONGO_CLUSTER, MONGO_DB } = process.env;
const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_CLUSTER}/${MONGO_DB}?retryWrites=true&w=majority`;

const client = new MongoClient(uri);

let db;
let dbName = MONGO_DB;

const connectDB = async () => {
    try {
        if (!uri) {
            throw new Error('MONGO_URI not defined in .env');
        }
        await client.connect();
        db = client.db(dbName);

        console.log(`connection successful (Database: ${dbName})`);
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