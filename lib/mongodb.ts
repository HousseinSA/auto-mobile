import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_LINK;
if (!uri) {
    throw new Error("MONGODB_LINK environment variable is not defined");
}
const client = new MongoClient(uri);
const dbName = "automobile";

let db: Db | undefined;

async function connectDB() {
    if (!db) {
        await client.connect();
        db = client.db(dbName);
    }
    return db;
}

export async function createUser({ name, password }: { name: string; password: string }) {
    const database = await connectDB();
    const usersCollection = database.collection('users');

    const existingUser = await usersCollection.findOne({ name });
    if (existingUser) {
        return {
            success: false,
            message: `L'utilisateur "${name}" existe déjà. Veuillez choisir un autre nom.`
        };
    }

    const result = await usersCollection.insertOne({ name, password });
    return {
        success: true,
        message: `Votre compte a été créé avec succès.`,
        result
    };
}

export async function findUserByName(name: string) {
    const database = await connectDB();
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