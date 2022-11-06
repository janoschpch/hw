import React, { useState } from "react";
import { useUser } from "../../../hooks/useUser";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './Header.css';
import { useNavigate } from "react-router-dom";

export default function Header() {
    const { user, logout } = useUser();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();


    return (
        <div className="Header">
            <div className="Header-username">
                <span>{user.name}</span>
            </div>
            <div className="Header-logout">
                <button onClick={() => {
                    logout();
                    navigate("/");
                }}>
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
}
