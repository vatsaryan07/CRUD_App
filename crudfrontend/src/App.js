import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navigation } from './components/navigation'
import { Login } from './components/login'
import {Home} from './components/home'
import { Register } from './components/register';
import React, { useState, useEffect } from 'react';
import { View } from './components/view';
import {jwtDecode} from 'jwt-decode';

function App() {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const isTokenValid = (token) => {
        try {
            const decodedToken = jwtDecode(token);
            // Check if the 'exp' claim exists and if it's in the past
            if (decodedToken.exp < Date.now() / 1000) {
                return false;  // Token is expired
            } else {
                return true;  // Token is not expired
            }
        } catch (error) {
            // Handle decoding errors
            console.error('Error decoding token:', error);
            return true;  // Token is considered expired if decoding fails
        }
    };
    useEffect(() => {
        const isAuthenticated = checkAuthentication();
        setIsAuthenticated(isAuthenticated&&isTokenValid(localStorage.getItem('access_token')));
    }, []);

    const checkAuthentication = () => {
        return localStorage.getItem('access_token') !== null;
    };
    

    return (
        <>
            <BrowserRouter>
                <Navigation></Navigation>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={isAuthenticated ? <Home /> : <Login/>} />
                    <Route path="/home" element={isAuthenticated ? <Home /> : <Login/>} />
                    <Route path ="/register" element={<Register/>}/>
                    <Route path ="/view" element={<View/>}/>
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App;
