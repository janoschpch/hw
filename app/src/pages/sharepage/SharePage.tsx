import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../../components/input/Input";
import Background from "../../components/background/Background";
import './SharePage.css';

async function sharedData(token: string): Promise<any> {
    let response = await fetch('/api/v1/homework/shared', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token })
    });

    return response.json();
}

export default function SharePage() {
    const params = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState({ created: "", subject: "", description: "", user: "" });
    
    useEffect(() => {
        sharedData(params.token as string).then((data) => {
            if (data.status === "success") {
                setData(data.data);
            } else {
                navigate('/dashboard');
            }
        });
    }, []);

    return (
        <div className="SharePage">
            <h2>{data.subject}</h2>
            <p>{data.description}</p>
            <p>{data.created}</p>
            <p>Created by <strong>{data.user}</strong></p>
        </div>
    );
}