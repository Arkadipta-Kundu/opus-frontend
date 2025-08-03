import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/authService';

const LoginPage = ({ onLogin }) => {
    const [formData, setFormData] = useState({
        userName: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [needsVerification, setNeedsVerification] = useState(false);
    const [otp, setOtp] = useState('');

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const loginSuccess = await authService.login(formData.userName, formData.password);

            if (loginSuccess) {
                // Check if email is verified
                const isVerified = await authService.isEmailVerified();

                if (isVerified) {
                    onLogin();
                } else {
                    setNeedsVerification(true);
                    // Send OTP for verification
                    await authService.sendOtp();
                }
            } else {
                setError('Invalid username or password');
            }
        } catch (error) {
            console.error('Login failed:', error);
            setError(error.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await authService.verifyOtp(otp);
            onLogin();
        } catch (error) {
            console.error('OTP verification failed:', error);
            setError('Invalid OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        try {
            await authService.sendOtp();
            setError('');
            // You could show a success message here
        } catch (error) {
            console.error('Resend OTP failed:', error);
            setError('Failed to resend OTP. Please try again.');
        }
    };

    if (needsVerification) {
        return (
            <div className="container">
                <div className="card">
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <LogIn size={48} style={{ color: '#667eea', marginBottom: '1rem' }} />
                        <h1 style={{ marginBottom: '0.5rem', color: '#111827' }}>Verify Your Email</h1>
                        <p style={{ color: '#6b7280' }}>We've sent an OTP to your email address</p>
                    </div>

                    {error && (
                        <div className="alert alert-error">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleVerifyOtp}>
                        <div className="input-group">
                            <label htmlFor="otp">Enter OTP</label>
                            <input
                                type="text"
                                id="otp"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="Enter the 6-digit code"
                                required
                                maxLength="6"
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', marginBottom: '1rem' }}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Verifying...' : 'Verify Email'}
                        </button>

                        <button
                            type="button"
                            className="btn btn-secondary"
                            style={{ width: '100%' }}
                            onClick={handleResendOtp}
                        >
                            Resend OTP
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="card">
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <LogIn size={48} style={{ color: '#667eea', marginBottom: '1rem' }} />
                    <h1 style={{ marginBottom: '0.5rem', color: '#111827' }}>Welcome Back</h1>
                    <p style={{ color: '#6b7280' }}>Sign in to your account</p>
                </div>

                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label htmlFor="userName">Username</label>
                        <input
                            type="text"
                            id="userName"
                            name="userName"
                            value={formData.userName}
                            onChange={handleInputChange}
                            placeholder="Enter your username"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Enter your password"
                                required
                                style={{ paddingRight: '3rem' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '0.75rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#6b7280'
                                }}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginBottom: '1rem' }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <Link
                        to="/forgot-password"
                        style={{ color: '#667eea', textDecoration: 'none', fontSize: '0.875rem' }}
                    >
                        Forgot your password?
                    </Link>
                </div>

                <div style={{ textAlign: 'center', color: '#6b7280' }}>
                    <p>
                        Don't have an account?{' '}
                        <Link
                            to="/register"
                            style={{ color: '#667eea', textDecoration: 'none', fontWeight: '600' }}
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
