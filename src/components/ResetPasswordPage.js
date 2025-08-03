import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Key, Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/authService';

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [token, setToken] = useState('');

    useEffect(() => {
        const tokenFromUrl = searchParams.get('token');
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        } else {
            setError('Invalid or missing reset token. Please request a new password reset.');
        }
    }, [searchParams]);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        if (formData.newPassword !== formData.confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        if (formData.newPassword.length < 6) {
            setError('Password must be at least 6 characters long');
            setIsLoading(false);
            return;
        }

        if (!token) {
            setError('Invalid reset token. Please request a new password reset.');
            setIsLoading(false);
            return;
        }

        try {
            await authService.resetPassword(token, formData.newPassword);
            setSuccess('Password has been reset successfully! Redirecting to login...');

            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            console.error('Password reset failed:', error);
            setError(error.response?.data?.message || 'Failed to reset password. The token may be expired or invalid.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="card">
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <Key size={48} style={{ color: '#667eea', marginBottom: '1rem' }} />
                    <h1 style={{ marginBottom: '0.5rem', color: '#111827' }}>Reset Your Password</h1>
                    <p style={{ color: '#6b7280' }}>Enter your new password below</p>
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

                {token && !success && (
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="newPassword">New Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="newPassword"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleInputChange}
                                    placeholder="Enter your new password"
                                    required
                                    minLength="6"
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

                        <div className="input-group">
                            <label htmlFor="confirmPassword">Confirm New Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    placeholder="Confirm your new password"
                                    required
                                    style={{ paddingRight: '3rem' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', marginBottom: '1rem' }}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Resetting Password...' : 'Reset Password'}
                        </button>
                    </form>
                )}

                {!token && !success && (
                    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                        <button
                            onClick={() => navigate('/forgot-password')}
                            className="btn btn-secondary"
                        >
                            Request New Reset Link
                        </button>
                    </div>
                )}

                {!success && (
                    <div style={{ textAlign: 'center', color: '#6b7280', marginTop: '1rem' }}>
                        <p>
                            Remember your password?{' '}
                            <button
                                onClick={() => navigate('/login')}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#667eea',
                                    textDecoration: 'underline',
                                    cursor: 'pointer'
                                }}
                            >
                                Sign in
                            </button>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResetPasswordPage;
