import Link from "next/link";
import { useSession, signOut } from 'next-auth/react';
import classes from "./navbar.module.scss";

const Navbar = () => {
    const { data: session } = useSession();

    console.log('navbar', session);

    const logoutHandler = () => {
        signOut();
    };

    return (
        <header className={classes.header + ' ' + ( session ? classes['header-auth'] : '' )}>
            <div className="container">
                <div className={classes['header-in']}>
                    {!session && (<div className={classes.logo}><span>Fam</span>Book</div>)}

                    {session && (
                        <>
                            <Link href='/'><a className={classes.logo}><span>Fam</span>Book</a></Link>
                            <input className={`${classes['search-field']} form-control-field`} type='search'/>
                            <button className="btn btn-text" onClick={logoutHandler}>Logout</button>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
};

export default Navbar;