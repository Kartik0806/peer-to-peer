import { useState, useEffect, createContext, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import axios from 'axios';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [isAuth, setIsAuth] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        const checkAuth = async () => {
            try {

                const response = await axios.get('http://localhost:5000/verifyUser', {
                    withCredentials: true
                });
                const data = response.data;
                setUser(data.user);
                setIsAuth(true);
            }
            catch (error) {
                console.log('authprovider: not authorized');
                setIsAuth(false);
                setUser(null);
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
