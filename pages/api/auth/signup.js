import {hashPassword} from "../../../helpers/auth";
import {connectToDatabase} from "../../../helpers/db";

// Function responsible with creating a new user in the db
// We connect the api route to the db and store in it the incoming user data
const handler = async (req, res) => {
    if (req.method !== 'POST') {
        return;
    }

    const data = req.body;
    // in 'auth-form.js' when we submit the form we have to make sure we add 'email' and 'password' to the request which we'll send to the api route when we want to create a user
    const { firstname, lastname, email, password } = data;

    // email and password server side validation
    if (!email || !email.includes('@') || !password || password.trim().length < 7 || firstname.trim().length === 0 || lastname.trim().length === 0) {
        res.status(422).json({message: 'Invalid input'});
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

    try {
        const db = client.db();

        // check if user already exists in the database
        const existingUser = await db.collection('logins').findOne({email: email});
        if (existingUser) {
            client.close();
            res.status(422).json({message: 'User exists already'});
            return;
        }

        const hashedPassword = await hashPassword(password);
        // here we create a new document/user in the "users" collection
        await db.collection('logins').insertOne({
            email: email,
            password: hashedPassword
        });

        const user_name_lower = firstname.toLowerCase() + '_' + lastname.toLowerCase();
        const user_name_final = user_name_lower.replace(/\s/g, "_")

        await db.collection('users').insertOne({
            profileId: user_name_final,
            user_name: user_name_final,
            first_name: firstname,
            last_name: lastname,
            email: email
        });
    } catch (error) {
        res.status(500).json({message: 'Inserting data failed!'});
        return;
    }

    res.status(201).json({message: 'User created'});
    client.close();
};

export default handler;