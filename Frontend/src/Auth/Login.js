import React, { useState, useRef } from 'react';
import { Redirect } from 'react-router-dom';
import { useAlert } from "react-alert";
import './form.css';

function Login() {
    const [redirectToSignup, setRedirectToSignup] = useState(false);
    const passwordRef = useRef();
    const [inputValues, setInputValues] = useState({
        email: "",
        password: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const alert = useAlert();
    const { email, password } = inputValues;

    const handleChange = name => event => {
        setInputValues({ ...inputValues, [name]: event.target.value });
    }

    const setPasswordType = () => {
        if (showPassword) {
            passwordRef.current.type = "password";
            setShowPassword(false);
        }
        else {
            passwordRef.current.type = "text";
            setShowPassword(true);
        }
    }

    const onSubmit = event => {
        event.preventDefault();
        console.log("submit");
        
    }

    const form = () => (
        <form>
            <div className="con">
                <header className="head-form">
                    <h2>Log In</h2>
                    <p>login here using your email and password</p>
                </header>
                <br />
                <div>
                    <span className="input-item">
                        <i className="fa fa-envelope"></i>
                    </span>
                    <input className="form-input" id="txt-input1" type="email"
                        placeholder="Email" value={email} onChange={handleChange("email")} required />
                    <br />
                    <span className="input-item">
                        <i className="fa fa-key"></i>
                    </span>
                    <input className="form-input" id="pwd" type="password" placeholder="Password" ref={passwordRef}
                        name="password" value={password} onChange={handleChange("password")} required />
                    <span onClick={setPasswordType}>
                        <i className="fa fa-eye" aria-hidden="true" type="button" id="eye"></i>
                    </span>
                    <br />
                    <button className="btn log-in" onClick={onSubmit}> Login </button>
                </div>

                <div>
                    <button type="button" className="btn submits frgt-pass">Forgot Password</button>
                    <button type="button" className="btn submits sign-up" onClick={() => setRedirectToSignup(true)}>
                        Sign Up&nbsp;&nbsp;
                        <i className="fa fa-user-plus" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
        </form>
    )

    return (
        <div className="overlay">
            {form()}
            {redirectToSignup &&
                <Redirect to={{
                    pathname: "/signup"
                }} />}
        </div>
    )
}

export default Login
