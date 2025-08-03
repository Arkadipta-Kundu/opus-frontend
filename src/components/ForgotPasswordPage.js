import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { authService } from '../services/authService';

const ForgotPasswordPage = () => {
    const [input, setInput] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        if (!input.trim()) {
            setError('Please enter your email address or username');
            setIsLoading(false);
            return;
        }

        try {
            await authService.forgetPassword(input);
            setSuccess('Password reset link has been sent to your email address. Please check your inbox and follow the instructions.');
        } catch (error) {
            console.error('Forgot password failed:', error);
            setError(error.response?.data?.message || 'Failed to send reset instructions. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="card">
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <Mail size={48} style={{ color: '#667eea', marginBottom: '1rem' }} />
                    <h1 style={{ marginBottom: '0.5rem', color: '#111827' }}>Forgot Password</h1>
                    <p style={{ color: '#6b7280' }}>
                        Enter your email address or username and we'll send you a link to reset your password
                    </p>
                </div>

                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="alert alert-success">
                        {success}
                    </div>
                )}

                {!success && (
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="input">Email Address or Username</label>
                            <input
                                type="text"
                                id="input"
                                value={input}
                                onChange={(e) => {
                                    setInput(e.target.value);
                                    setError('');
                                }}
                                placeholder="Enter your email address or username"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', marginBottom: '1rem' }}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>
                )}

                <div style={{ textAlign: 'center', color: '#6b7280' }}>
                    <p>
                        Remember your password?{' '}
                        <Link
                            to="/login"
                            style={{ color: '#667eea', textDecoration: 'none', fontWeight: '600' }}
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;