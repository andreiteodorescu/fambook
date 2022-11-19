import { getSession } from "next-auth/react";
import EditProfileForm from "../../components/edit-profile-form/edit-profile-form.component";

const EditProfile = () => {
    return <EditProfileForm />
};

// we do this to not have content flashing when not authenticated
export const getServerSideProps = async (context) => {
    const session = await getSession({req: context.req});

    if (!session) {
        return {
            redirect: {
                destination: '/auth',
                permanent: false
            }
        };
    }

    // if the user is authenticated
    return {
        props: {session}
    }
};

export default EditProfile;