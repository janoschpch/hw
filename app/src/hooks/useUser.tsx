import { useState, createContext, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const fetchUserdata = async (token: string) => {
    const response = await fetch('/api/v1/user/userInfo', {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `${token}`
        }
    });

    if (response.status == 401) {
        localStorage.removeItem('token');
        return { data: {} };
    }
    
    return response.json();
}

const initialState = {
    user: {} as any,
    setUser: (user: any) => {},
    token: null as string | null,
    setToken: (token: string) => {},
    logout: () => {}
}

const UserContext = createContext(initialState);

export function UserProvider({ children }: any) {
    const [token, setAccessToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState({});

    function handleFetchUserdata() {
        if (token) {
            fetchUserdata(token).then((data) => {
                if (localStorage.getItem('token') != null) {
                    setUser(data.data);
                } else {
                    setAccessToken(null);
                    setUser({});
                }
            });
        } else {
            localStorage.removeItem('token');
            setUser({});
        }
    }

    useEffect(() => {
        handleFetchUserdata();
    }, [token]);

    const setToken = (token: string) => {
        localStorage.setItem('token', token);
        setAccessToken(token);
    }

    const logout = () => {
        localStorage.removeItem('token');
        fetch('/api/v1/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ session: token })
        });
        setAccessToken(null);
    }

    return (
        <UserContext.Provider value={{ user, setUser, token, setToken, logout }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => useContext(UserContext);