import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navigation } from './components/navigation'
import { Login } from './components/login'
import {Home} from './components/home'
import { Register } from './components/register';
import React, { useState, useEffect } from 'react';
import { View } from './components/view';

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
                    <Route path="/" element={isAuthenticated ? <Home /> : <Login/>} />
                    <Route path="/home" element={<Home/>} />
                    <Route path ="/register" element={<Register/>}/>
                    <Route path ="/view" element={<View/>}/>
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App;
