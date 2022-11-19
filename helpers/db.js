import { MongoClient } from "mongodb";

// we will talk with the db from multiple api routes so in this file we establish the connection with the mongodb and share it with other api routes
export const connectToDatabase = async () => {
   const client = await MongoClient.connect(
       'mongodb+srv://andrei_teodorescu:MongoDummyPass@cluster0.zt5wkti.mongodb.net/fambook-auth?retryWrites=true&w=majority'
   );

   return client;
};