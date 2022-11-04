import React from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/input/Input";
import Background from "../../components/background/Background";
import './RegisterPage.css';

export default function RegisterPage() {
    const navigate = useNavigate();

    return (
        <div className="registerPage">
            <Background />
            <div className="register-container">
                <div className="register-header">
                    <p>Register</p>
                </div>
                <div className="register-body">
                    <Input type="text" placeholder="E-Mail Address" onChange={() => {}} key="email-address"/>
                    <Input type="text" placeholder="Username" onChange={() => {}} key="username"/>
                    <Input type="text" placeholder="Password" onChange={() => {}} key="password"/>

                    <div className="register-button">
                        <button>Register</button>
                        <p>- or -</p>
                        <button onClick={() => {
                            navigate("/login");
                        }}>Login</button>
                    </div>
                </div>
            </div>
        </div>
    );
}