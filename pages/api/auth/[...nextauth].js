import NextAuth from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import {connectToDatabase} from "../../../helpers/db";
import {verifyPassword} from "../../../helpers/auth";

export default NextAuth({
    session: {
        jwt: true
    },
    providers: [
        CredentialsProvider({
            async authorize(credentials) {
                const client = await connectToDatabase();

                const usersCollection = client.db().collection('logins');

               const user = await usersCollection.findOne({email: credentials.email});

                if (!user) {
                    client.close();
                    throw new Error('User not found');
                }

                const isValid = await verifyPassword(credentials.password, user.password);

                if (!isValid) {
                    client.close();
                    throw new Error('Password incorrect!');
                }

                client.close();
                return {
                    email: user.email
                };
            }
        })
    ]
});