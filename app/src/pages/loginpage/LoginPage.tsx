import React, { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Input from "../../components/input/Input";
import Background from "../../components/background/Background";
import './LoginPage.css';

interface Props {
    setToken: (token: string) => void;
}

async function loginUser(credentials: { email: string, password: string }) {
    return fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(data => data.json());
}

export default function LoginPage({ setToken }: Props) {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async () => {
        setSubmitted(true);
        const session = await loginUser({
            email,
            password
        });
        if (session.status == "success") {
            setToken(session.data.token);
            navigate("/dashboard");
        } else {
            setError("Invalid credentials");
        }
    }

    return (
        <div className="LoginPage">
            <Background />
            <div className="login-container">
                <div className="login-header">
                    <p>Login</p>
                </div>
                <div className="login-body">
                    <Input type="text" placeholder="E-Mail Address" onChange={(email) => {
                        setEmail((email.target as HTMLInputElement).value as string);
                    }} key="email-address"/>
                    <Input type="password" placeholder="Password" onChange={(password) => {
                        setPassword((password.target as HTMLInputElement).value as string);
                    }} key="password"/>

                    <div className="login-button">
                        <button onClick={handleSubmit}>Login</button>
                        <p>- or -</p>
                        <button onClick={() => {
                            navigate("/register");
                        }}>Register</button>
                    </div>
                </div>
            </div>
            {error &&
                <div className="login-error">
                    <span>{error}</span>
                </div>
            }
        </div>
    );
}

LoginPage.propTypes = {
    setToken: PropTypes.func.isRequired
}