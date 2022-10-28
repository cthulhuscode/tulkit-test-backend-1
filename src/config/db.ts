import { connect } from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

async function dbConnnect(): Promise<void> {
  const mongodb = await MongoMemoryServer.create();

  await connect(mongodb.getUri());
}

export default dbConnnect;
