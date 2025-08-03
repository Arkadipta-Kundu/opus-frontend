import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import RegisterPage from './components/RegisterPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import { authService } from './services/authService';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const userName = localStorage.getItem('userName');
            const password = localStorage.getItem('password');
            const authToken = localStorage.getItem('authToken');

            if (userName && password && authToken) {
                // Verify if the user is verified
                const isVerified = await authService.isEmailVerified();
                setIsAuthenticated(isVerified);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            localStorage.removeItem('authToken');
            localStorage.removeItem('userName');
            localStorage.removeItem('password');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userName');
        localStorage.removeItem('password');
        setIsAuthenticated(false);
    };

    if (isLoading) {
        return (
            <div className="container">
                <div className="card">
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <p>Loading...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route
                        path="/login"
                        element={
                            isAuthenticated ?
                                <Navigate to="/dashboard" replace /> :
                                <LoginPage onLogin={handleLogin} />
                        }
                    />
                    <Route
                        path="/register"
                        element={
                            isAuthenticated ?
                                <Navigate to="/dashboard" replace /> :
                                <RegisterPage />
                        }
                    />
                    <Route
                        path="/forgot-password"
                        element={
                            isAuthenticated ?
                                <Navigate to="/dashboard" replace /> :
                                <ForgotPasswordPage />
                        }
                    />
                    <Route
                        path="/reset-password"
                        element={
                            isAuthenticated ?
                                <Navigate to="/dashboard" replace /> :
                                <ResetPasswordPage />
                        }
                    />
                    <Route
                        path="/auth/user-varification/reset-password"
                        element={
                            isAuthenticated ?
                                <Navigate to="/dashboard" replace /> :
                                <ResetPasswordPage />
                        }
                    />
                    <Route
                        path="/dashboard"
                        element={
                            isAuthenticated ?
                                <Dashboard onLogout={handleLogout} /> :
                                <Navigate to="/login" replace />
                        }
                    />
                    <Route
                        path="/"
                        element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
