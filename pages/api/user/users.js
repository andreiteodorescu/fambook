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

    const data = req.body;

    let client;

    // we try to make the connection to the db but if it fails we show the error message
    try {
        client = await connectToDatabase();
    } catch (error) {
        res.status(500).json({message: 'Connecting to the database failed!'});
        return;
    }

    const db = client.db();

    if (req.method === 'POST') {
        // in 'edit-profile-form.component.js' when we submit the form we have to make sure we add teh desired values to the request which we'll send to the api route when we want to update a user/profile
        const { profilePic, bio, city, birthdate, relationship, uploadedPhotos } = data;

        // server side validation
        if (!profilePic && !bio && !city && relationship === '' && !uploadedPhotos.length) {
            res.status(422).json({message: 'All fields are empty'});
            return;
        }

        try {
            // here we create a new document/user in the "users" collection
            await db.collection('users').updateOne({"email": session.user.email}, {
                $set: {
                    profilePicture: profilePic,
                    bio: bio,
                    city: city,
                    birthdate: birthdate,
                    relationship_status: relationship,
                    uploadedPhotos: uploadedPhotos
                }
            });

        } catch (error) {
            res.status(500).json({message: 'Inserting data failed!'});
            return;
        }

        res.status(201).json({message: 'Profile updated'});
    }

    if (req.method === 'GET') {
        try {
            const allUsers = await db.collection('users').find().toArray();
            const authenticatedUser = await db.collection('users').find({"email": session.user.email}).toArray();

            res.status(200).json({
                users: allUsers,
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