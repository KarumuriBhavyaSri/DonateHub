import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Phone, Lock, Mail, User } from 'lucide-react';

const Signup = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        role: 'DONOR',
        phone: '',
        houseNumber: '',
        streetLandmark: '',
        areaLocality: '',
        city: '',
        district: '',
        state: '',
        pincode: '',
        country: '',
        govtCertificationId: '',
        organizationName: '',
        runnerName: ''
    });
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const { register } = useAuth();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSendOtp = async () => {
        if (!formData.email || !formData.email.includes('@')) {
            alert('Please enter a valid email address');
            return;
        }
        try {
            await api.post('/auth/send-otp', { email: formData.email });
            setOtpSent(true);
            alert('OTP sent to your email (Check backend console)');
        } catch (error) {
            alert('Failed to send OTP: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/register', { 
                ...formData, 
                email: formData.email.trim(),
                password: formData.password.trim(),
                otp 
            });
            alert('Registration successful! Please login.');
            navigate('/login');
        } catch (error) {
            alert('Registration failed. ' + (error.response?.data?.message || 'Invalid OTP or details'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-bg p-6">
            <div className="max-w-md w-full glass-morphism p-8 rounded-lg shadow-xl my-10">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Account</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                className="mt-1 block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white/20 backdrop-blur-sm"
                                required
                            />
                            <User size={16} className="absolute left-3 top-3.5 text-gray-500" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <div className="relative">
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="mt-1 block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white/20 backdrop-blur-sm"
                                required
                            />
                            <Phone size={16} className="absolute left-3 top-3.5 text-gray-500" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <div className="relative flex gap-2">
                            <div className="relative flex-grow">
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="mt-1 block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white/20 backdrop-blur-sm"
                                    required
                                    disabled={otpSent}
                                />
                                <Mail size={16} className="absolute left-3 top-3.5 text-gray-500" />
                            </div>
                            {!otpSent && (
                                <button
                                    type="button"
                                    onClick={handleSendOtp}
                                    className="mt-1 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition shadow-md"
                                >
                                    Send OTP
                                </button>
                            )}
                        </div>
                    </div>

                    {otpSent && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Enter Email OTP</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white/20 backdrop-blur-sm"
                                required
                                placeholder="Enter 6-digit OTP"
                            />
                        </div>
                    )}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Address Details</h3>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">House Number</label>
                            <input
                                type="text"
                                value={formData.houseNumber}
                                onChange={(e) => setFormData({ ...formData, houseNumber: e.target.value })}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white/20 backdrop-blur-sm"
                                placeholder="e.g., 123, Flat No. 4B"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Street/Landmark</label>
                            <input
                                type="text"
                                value={formData.streetLandmark}
                                onChange={(e) => setFormData({ ...formData, streetLandmark: e.target.value })}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white/20 backdrop-blur-sm"
                                placeholder="e.g., Near City Hospital, Main Road"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Area/Locality</label>
                            <input
                                type="text"
                                value={formData.areaLocality}
                                onChange={(e) => setFormData({ ...formData, areaLocality: e.target.value })}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white/20 backdrop-blur-sm"
                                placeholder="e.g., Begumpet, Ameerpet"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">City</label>
                                <input
                                    type="text"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white/20 backdrop-blur-sm"
                                    placeholder="e.g., Hyderabad"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">District</label>
                                <input
                                    type="text"
                                    value={formData.district}
                                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white/20 backdrop-blur-sm"
                                    placeholder="e.g., Hyderabad"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">State</label>
                                <input
                                    type="text"
                                    value={formData.state}
                                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white/20 backdrop-blur-sm"
                                    placeholder="e.g., Telangana"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Pincode</label>
                                <input
                                    type="text"
                                    value={formData.pincode}
                                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white/20 backdrop-blur-sm"
                                    placeholder="e.g., 500016"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Country</label>
                            <input
                                type="text"
                                value={formData.country}
                                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white/20 backdrop-blur-sm"
                                placeholder="e.g., India"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <div className="relative">
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="mt-1 block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white/20 backdrop-blur-sm"
                                required
                            />
                            <Lock size={16} className="absolute left-3 top-3.5 text-gray-500" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">I am a...</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white/20 backdrop-blur-sm"
                        >
                            <option value="DONOR">Donor (I want to help)</option>
                            <option value="RECEIVER">Receiver (I need help)</option>
                        </select>
                    </div>

                    {formData.role === 'RECEIVER' && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Receiver Details</h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Organization Name (Optional)</label>
                                <input
                                    type="text"
                                    value={formData.organizationName}
                                    onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white/20 backdrop-blur-sm"
                                    placeholder="e.g., Hope Foundation"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Govt Certification ID (Optional)</label>
                                <input
                                    type="text"
                                    value={formData.govtCertificationId}
                                    onChange={(e) => setFormData({ ...formData, govtCertificationId: e.target.value })}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white/20 backdrop-blur-sm"
                                    placeholder="e.g., NGO-12345"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Runner Name (Optional)</label>
                                <input
                                    type="text"
                                    value={formData.runnerName}
                                    onChange={(e) => setFormData({ ...formData, runnerName: e.target.value })}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white/20 backdrop-blur-sm"
                                    placeholder="e.g., John Doe"
                                />
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !otpSent}
                        className="w-full py-2.5 px-4 bg-primary text-white rounded-md hover:bg-opacity-90 transition disabled:opacity-50 font-semibold shadow-lg mt-4"
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
