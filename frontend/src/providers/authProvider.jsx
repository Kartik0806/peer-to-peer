import { useState, useEffect, createContext, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import axios from 'axios';
const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// console.log('API_URL:', API_URL);
export const AuthProvider = ({ children }) => {

    const [isAuth, setIsAuth] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        const checkAuth = async () => {
            try {

                const response = await axios.get(`${API_URL}/verifyUser`, {
                    withCredentials:true,
                });
                const data = response.data;
                setUser(data.user);
                setIsAuth(true);

            }
            catch (error) {
                console.log('authprovider: not authorized', error);
                // setIsAuth(false);
                // setUser(null);
            } finally {
                setLoading(false);
            }
        };
        console.log('location:', location.pathname);
        checkAuth();
    }, [location.pathname]);

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
