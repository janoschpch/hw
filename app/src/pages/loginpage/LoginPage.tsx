import React from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/input/Input";
import Background from "../../components/background/Background";
import './LoginPage.css';

export default function LoginPage() {
    const navigate = useNavigate();

    return (
        <div className="LoginPage">
            <Background />
            <div className="login-container">
                <div className="login-header">
                    <p>Login</p>
                </div>
                <div className="login-body">
                    <Input type="text" placeholder="E-Mail Address" onChange={() => {}} key="email-address"/>
                    <Input type="text" placeholder="Password" onChange={() => {}} key="password"/>

                    <div className="login-button">
                        <button>Login</button>
                        <p>- or -</p>
                        <button onClick={() => {
                            navigate("/register");
                        }}>Register</button>
                    </div>
                </div>
            </div>
        </div>
    );
}