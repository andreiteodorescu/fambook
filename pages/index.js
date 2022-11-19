import { useRouter } from "next/router";
import { useSession } from 'next-auth/react';
import Navbar from "../components/navbar/navbar.component";
import Timeline from "../components/timeline/timeline.component";

const Home = () => {
    const router = useRouter();

    const { status } = useSession({
        required: true,
        onUnauthenticated() {
            router.replace("/auth");
        },
    });

    if (status === "loading") {
        return "Loading or not authenticated..."
    }

    return <Timeline />
}

export default Home;