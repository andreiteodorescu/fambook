import {connectToDatabase} from "../../../helpers/db";
import { getSession } from 'next-auth/react';

// Function responsible with updating a user in the db
// We connect the api route to the db and store in it the incoming user data
const handler = async (req, res) => {
    const session = await getSession({ req: req });

    // this verifies if the user is authenticated. We do this because requests can be made in other ways than just through a form
    if (!session) {
        res.status(401).json({message: "Not authenticated!"});
        return;
    }

    let client;

    // we try to make the connection to the db but if it fails we show the error message
    try {
        client = await connectToDatabase();
    } catch (error) {
        res.status(500).json({message: 'Connecting to the database failed!'});
        return;
    }

    const db = client.db();

    if (req.method === 'GET') {
        try {
            const authenticatedUser = await db.collection('users').find({"email": session.user.email}).toArray();

            res.status(200).json({
                authenticatedUser: authenticatedUser
            });
        } catch (error) {
            res.status(500).json({message: 'Getting data failed!'});
            return;
        }
    }

    client.close();
};

export default handler;