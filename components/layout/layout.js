import {Fragment} from "react";
import Navbar from "../navbar/navbar.component";

const Layout = (props) => {
    return <Fragment>
        <Navbar />
        <main>
            <div className="container">
                {props.children}
            </div>
        </main>
    </Fragment>
};

export default Layout;