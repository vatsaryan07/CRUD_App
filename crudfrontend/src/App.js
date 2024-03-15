import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navigation } from './components/navigation'
import { Login } from './components/login'
import {Home} from './components/home'
import { Register } from './components/register';
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router'; 

function App() {

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const isAuthenticated = checkAuthentication(); 
        setIsAuthenticated(isAuthenticated);
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
                    <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
                    <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />} />
                    <Route path ="/register" element={<Register/>}/>
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App;
