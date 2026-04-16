import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { Mail, Lock } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const user = await login(email.trim(), password.trim());
            console.log('Login success! User:', user);
            // Redirect to dashboard based on role
            if (user.role === 'RECEIVER') {
                navigate('/receiver');
            } else if (user.role === 'DONOR') {
                navigate('/donor');
            } else {
                navigate('/');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Invalid credentials');
        }
    };

    return (
        <div className="auth-bg p-4">
            <div className="max-w-md w-full glass-morphism p-8 rounded-lg shadow-xl">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
                {error && <div className="bg-red-100/80 backdrop-blur-sm text-red-700 p-3 rounded mb-4">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                        <div className="relative">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                className="mt-1 block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white/20 backdrop-blur-sm"
                                required
                            />
                            <Mail size={16} className="absolute left-3 top-3.5 text-gray-500" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <div className="relative">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white/20 backdrop-blur-sm"
                                required
                            />
                            <Lock size={16} className="absolute left-3 top-3.5 text-gray-500" />
                        </div>
                    </div>
                    <button type="submit" className="w-full py-2.5 px-4 bg-primary text-white rounded-md hover:bg-opacity-90 transition font-semibold shadow-lg">
                        Login
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Don't have an account? <Link to="/signup" className="text-primary font-bold hover:underline">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
