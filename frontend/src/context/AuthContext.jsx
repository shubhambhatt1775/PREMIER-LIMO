import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('luxUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            setUser(response.data);
            localStorage.setItem('luxUser', JSON.stringify(response.data));
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem('luxUser', JSON.stringify(userData));
    };

    const signup = async (userData) => {
        try {
            const response = await api.post('/auth/signup', userData);
            setUser(response.data);
            localStorage.setItem('luxUser', JSON.stringify(response.data));
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Signup failed'
            };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('luxUser');
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading, updateUser }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

