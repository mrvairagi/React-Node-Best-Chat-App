import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import axios from "axios";
import { Link } from "react-router-dom";

const Register = (props) => {
    const nameRef = React.createRef();
    const emailRef = React.createRef();
    const passwordRef = React.createRef();



    const registerUser = (props) => {
        const name = nameRef.current.value;
        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        axios
            .post("http://localhost:8000/user/register", {
                name,
                email,
                password,
            })
            .then((response) => {
                alert("success", response.data.message);
                props.history.push("/login");
            })
            .catch((err) => {
                // console.log(err);
                if (
                    err &&
                    err.response &&
                    err.response.data &&
                    err.response.data.message
                )
                alert("error", err.response.data.message);
            });
    };


    return (
        <div className="joinOuterContainer">
            <div className="joinInnerContainer">
                <h1 className="heading">Register</h1>
                <div>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Name"
                        className="joinInput"
                        ref={nameRef}
                    />
                </div>
                <div>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="abc@example.com"
                        className="joinInput"
                        ref={emailRef}
                    />
                </div>

                <div>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Your Password"
                        className="joinInput"
                        ref={passwordRef}
                    />
                </div>

                <button className={'button mt-20'} onClick={registerUser}>Register</button>

            </div>

        </div>
    )
}

export default Register;