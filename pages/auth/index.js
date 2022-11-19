import { useState, useRef } from 'react';
import { useRouter } from "next/router";
import {signIn} from 'next-auth/react';
import classes from './auth-form.module.scss';

const createUser = async (email, password) => {
    const response = await fetch('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({email, password}),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong!');
    }

    return data;
}

const AuthForm = () => {
    const emailInputRef = useRef();
    const passwordInputRef = useRef();

    const [isLogin, setIsLogin] = useState(true);

    const router = useRouter()

    const switchAuthModeHandler = () => {
        setIsLogin((prevState) => !prevState);
    }

    const submitHandler = async (event) => {
        event.preventDefault();

        const enteredEmail = emailInputRef.current.value;
        const enteredPassword = passwordInputRef.current.value;

        // optional: Add validation. We have validation on the api route but we can add here also to not stress the server

        if (isLogin) {
            // log user in
            const result = await signIn('credentials', {
                redirect: false,
                email: enteredEmail,
                password: enteredPassword
            });

            if (result.error === null) {
                router.push('/timeline')
            }

            console.log(result);
        } else {
            try {
                const result = await createUser(enteredEmail, enteredPassword);
                console.log(result);
            } catch (error) {
                console.log(error);
            }
        }
    }

    return (
        <div className="container">
            <div className={`${classes['home-screen']} d-flex-center`}>
                <div className={classes['home-screen-left']}>
                    <h1>Welcome to FamBook.</h1>
                    <h2>The family friendly social media.</h2>
                </div>
                <div className={classes['home-screen-right']}>
                    <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
                    <form onSubmit={submitHandler}>
                        <div className={classes.control}>
                            <label htmlFor='email'>Your Email</label>
                            <input
                                type='email'
                                id='email'
                                required
                                ref={emailInputRef} />
                        </div>
                        <div className={classes.control}>
                            <label htmlFor='password'>Your Password</label>
                            <input
                                type='password'
                                id='password'
                                required
                                ref={passwordInputRef} />
                        </div>
                        <div className={classes.actions}>
                            <button>{isLogin ? 'Login' : 'Create Account'}</button>
                            <button
                                type='button'
                                className={classes.toggle}
                                onClick={switchAuthModeHandler}
                            >
                                {isLogin ? 'Create new account' : 'Login with existing account'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;