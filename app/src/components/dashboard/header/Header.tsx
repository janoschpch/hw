import React, { useState } from "react";
import { useUser } from "../../../hooks/useUser";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExitIcon from '@mui/icons-material/ExitToApp'
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import './Header.css';
import { useNavigate } from "react-router-dom";

export default function Header(props: {
    tab: string;
}) {
    const { user, logout } = useUser();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="Header">
            <div className="Header-username">
                <span>{user.name}</span>
            </div>
            <div className="Header-tabs">
                <div className={"Header-tab" + (props.tab === "home" ? " Header-tab-selected" : "")}>
                    <button onClick={() => navigate("/dashboard")}>
                        <HomeIcon />
                    </button>
                </div>
                <div className={"Header-tab" + (props.tab === "settings" ? " Header-tab-selected" : "")}>
                    <button onClick={() => navigate("/settings")}>
                        <SettingsIcon />
                    </button>
                </div>
                <div className="Header-logout">
                    <button onClick={() => {
                        logout();
                        navigate("/");
                    }}>
                        <ExitIcon />
                    </button>
                </div>
            </div>
        </div>
    );
}
