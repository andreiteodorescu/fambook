import {connectToDatabase} from "../../../helpers/db";

// Function responsible with updating a user in the db
// We connect the api route to the db and store in it the incoming user data
const handler = async (req, res) => {
    const {profileId} = req.query;

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
            const currentUser = await db.collection('users').find({"profileId": `${profileId}` }).toArray();

            res.status(200).json({
                currentUser: currentUser
            });
        } catch (error) {
            res.status(500).json({message: 'Getting data failed!'});
            return;
        }
    }

    client.close();
};

export default handler;