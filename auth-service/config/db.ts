import { MongoClient } from "mongodb";


// mongodb client
const client = new MongoClient(process.env.MONGO_URI!);
export const db = client.db('auth');