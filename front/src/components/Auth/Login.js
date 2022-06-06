import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import axios from "axios";
import { Link } from "react-router-dom";

const Login = (props) => {
    let navigate = useNavigate();
    const emailRef = React.createRef();
    const passwordRef = React.createRef();

    const loginUser = () => {
        
        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        axios
            .post("http://localhost:8000/user/login", {
                email,
                password,
            })
            .then((response) => {
                // alert("success");
                localStorage.setItem("CC_Token", response.data.token);
                localStorage.setItem("CC_Userid", response.data.userid);
                navigate("/chatRoom");
                props.setupSocket();
            })
            .catch((err) => {
                // console.log(err);
                if (
                    err &&
                    err.response &&
                    err.response.data &&
                    err.response.data.message
                )
                alert(err.response.data.message);
            });
    };

    return (
        <div className="joinOuterContainer">
            <div className="joinInnerContainer">
                <h1 className="heading">Join</h1>
                <div>
                    <input placeholder="Email" className="joinInput" type="text" ref={emailRef} />
                </div>
                <div>
                    <input placeholder="password" className="joinInput mt-20" type="password" ref={passwordRef} />
                </div>

                <button className={'button mt-20'} onClick={loginUser}>Login</button>

            </div>

        </div>
    )
}

export default Login;