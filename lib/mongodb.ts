// lib/mongodb.ts
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_LINK;
const client = new MongoClient(uri);
const dbName = "automobile";

let db;

async function connectDb() {
    if (!db) {
        await client.connect();
        db = client.db(dbName);
    }
    return db;
}

export async function createUser({ name, password }: { name: string; password: string }) {
    const database = await connectDb();
    const usersCollection = database.collection('users');

    const existingUser = await usersCollection.findOne({ name });
    if (existingUser) {
        throw new Error('User already exists');
    }

    const result = await usersCollection.insertOne({ name, password });
    return result;
}

export async function findUserByName(name: string) {
    const database = await connectDb();
    const usersCollection = database.collection('users');

    const user = await usersCollection.findOne({ name });
    return user; 
}

export async function verifyUserPassword(name: string, password: string) {
    const user = await findUserByName(name);
    if (user && user.password === password) {
        return user;
    }
    return null;
}