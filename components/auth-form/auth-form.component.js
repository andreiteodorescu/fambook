import { useState, useRef } from 'react';
import { useRouter } from "next/router";
import {signIn} from 'next-auth/react';
import classes from './auth-form.module.scss';

const createUser = async (firstname, lastname, email, password) => {
    const response = await fetch('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({firstname, lastname, email, password}),
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
    const firstnameInputRef = useRef();
    const lastnameInputRef = useRef();
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
            // Log user in
            const result = await signIn('credentials', {
                redirect: false,
                email: enteredEmail,
                password: enteredPassword
            });

            if (result.error === null) {
                router.push('/');
            }

            console.log(result);
        } else {
            // Create user
            const enteredFirstname = firstnameInputRef.current.value;
            const enteredLastname = lastnameInputRef.current.value;

            try {
                const result = await createUser(enteredFirstname, enteredLastname, enteredEmail, enteredPassword);
                console.log(result);
            } catch (error) {
                console.log(error);
            }
        }
    }

    console.log();

    return (
        <div className={`${classes['screen']} d-flex-center`}>
            <div className={classes['screen-left']}>
                <h1 className={classes['screen-title']}>Welcome to <span className="brand-half-first">Fam</span><span className="brand-half-second">Book</span>.</h1>
                <h2 className={classes['screen-subtitle']}>The family friendly social media.</h2>
            </div>
            <div className={classes['screen-right']}>
                <div className={classes['screen-right-content']}>
                    <h4>{isLogin ? 'Login' : 'Sign Up'}</h4>
                    <form onSubmit={submitHandler}>

                        {!isLogin &&
                            <>
                                <div className="form-control">
                                    <label htmlFor='firstname'>First name</label>
                                    <input
                                        className="form-control-field"
                                        type='text'
                                        id='firstname'
                                        required
                                        ref={firstnameInputRef} />
                                </div>
                                <div className="form-control">
                                    <label htmlFor='lastname'>Last name</label>
                                    <input
                                        className="form-control-field"
                                        type='text'
                                        id='lastname'
                                        required
                                        ref={lastnameInputRef} />
                                </div>
                            </>
                        }

                        <div className="form-control form-control-animate-up">
                            <label htmlFor='email'>Your Email</label>
                            <input
                                className="form-control-field"
                                type='email'
                                id='email'
                                required
                                ref={emailInputRef} />
                        </div>
                        <div className="form-control form-control-animate-up">
                            <label htmlFor='password'>Your Password</label>
                            <input
                                className="form-control-field"
                                type='password'
                                id='password'
                                required
                                ref={passwordInputRef} />
                        </div>
                        <div className="text-center">
                            <button className="btn btn-primary">{isLogin ? 'Login' : 'Create Account'}</button>
                            <button
                                type='button'
                                className="btn btn-text mt-15"
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