import { useRouter } from "next/router";
import { useEffect } from "react";
import UploadedImage from "../../components/images/uploaded.component";
import Avatar from "../../components/images/avatar.component";

const Profile = ({dataCurrUser}) => {


    console.log(dataCurrUser);

    const router = useRouter();

    useEffect(() => {
        // Always do navigations after the first render
        //router.push('/user-profile/?user=' + userAuthNickname, undefined, { shallow: true });

        //console.log('changed 1');
    }, []);

    useEffect(() => {
        // The counter changed!
        //console.log('changed 2');
    }, [router.query.user]);

    //console.log('pathname', router.pathname);
    //console.log('query', router.query);

    return (
        <div className="content">
            <figure className="profile-avatar">
                <Avatar src={dataCurrUser.profilePicture} />
                <figcaption>
                    Hello {dataCurrUser.first_name}
                </figcaption>
            </figure>
            <div className="profile-info">
                <div className="profile-left">
                    1. About
                    2. User's photos
                </div>
                <div className="profile-right">
                    User posts
                </div>
            </div>
        </div>
    )
};



// This function runs only on the server side
export async function getServerSideProps(context) {

    const pid = context.query.profileId;

    const response = await fetch(`http://localhost:3000/api/user/${pid}`, {
        headers: {
            cookie: context.req.headers.cookie
        }
    });

    const data = await response.json();

    const dataCurrUser = data.currentUser[0];

    console.log('data', data);

    // Props returned will be passed to the page component
    return {
        props: {
            dataCurrUser
        }
    }
}

export default Profile;
