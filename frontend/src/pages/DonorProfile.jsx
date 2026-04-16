import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { User, Mail, Phone, MapPin, Shield, Bell, Key, LogOut, Package, X, Eye, EyeOff, Check, AlertCircle, ArrowLeft, HeartHandshake, Clock, CheckCircle, XCircle } from 'lucide-react';

const DonorProfile = () => {
    const { user, logout, updateUser } = useAuth();
    const navigate = useNavigate();

    const [activeSettings, setActiveSettings] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isViewingDp, setIsViewingDp] = useState(false);
    const [editForm, setEditForm] = useState({
        fullName: '',
        phone: '',
        address: ''
    });
    const [successMessage, setSuccessMessage] = useState('');

    // Helper function to format address
    const formatAddress = (userData) => {
        if (userData?.houseNumber || userData?.city) {
            let addressParts = [];
            if (userData.houseNumber) addressParts.push(userData.houseNumber);
            if (userData.streetLandmark) addressParts.push(userData.streetLandmark);
            if (userData.areaLocality) addressParts.push(userData.areaLocality);
            if (userData.city) addressParts.push(userData.city);
            if (userData.district) addressParts.push(userData.district);
            if (userData.state) addressParts.push(userData.state);
            if (userData.pincode) addressParts.push(userData.pincode);
            if (userData.country) addressParts.push(userData.country);
            return addressParts.join(', ');
        }
        return userData?.address || 'N/A';
    };

    const fileInputRef = React.useRef(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        const baseUrl = api.defaults.baseURL.replace('/api', '');
        return `${baseUrl}${path}`;
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        try {
            setUploadingImage(true);
            const response = await api.post(`/users/${user.id}/profile-picture`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const newUrl = response.data.data;
            setProfile(prev => ({ ...prev, profileImageUrl: newUrl }));
            updateUser({ profileImageUrl: newUrl });
            setSuccessMessage('Profile picture updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to upload image');
        } finally {
            setUploadingImage(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState(false);

    const [profile, setProfile] = useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
        donationCount: user?.donationCount || 0,
        joinedDate: '',
        profileImageUrl: user?.profileImageUrl || null
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Claims state for donation claims
    const [claims, setClaims] = useState([]);
    const [claimsLoading, setClaimsLoading] = useState(false);
    const [claimMessage, setClaimMessage] = useState({ type: '', text: '' });

    const [donations, setDonations] = useState([]);
    const [selectedReceiver, setSelectedReceiver] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [profileRes, donationsRes, claimsRes] = await Promise.all([
                api.get(`/users/${user.id}`),
                api.get(`/requests/donor/${user.id}/fulfillments`),
                api.get(`/donations/claims/donor/${user.id}`)
            ]);

            const userData = profileRes.data.data;
            const formattedAddr = formatAddress(userData);
            const profileData = {
                fullName: userData.fullName || '',
                email: userData.email || '',
                phone: userData.phone || '',
                address: formattedAddr !== 'N/A' ? formattedAddr : '',
                donationCount: userData.donationCount || 0,
                joinedDate: userData.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Feb 2026',
                profileImageUrl: userData.profileImageUrl || null
            };
            setProfile(profileData);
            setEditForm({
                fullName: userData.fullName || '',
                phone: userData.phone || '',
                address: formattedAddr !== 'N/A' ? formattedAddr : ''
            });

            // Format fulfillments (past donations from request side)
            const fulfillments = donationsRes.data.data || [];
            const formattedDonations = fulfillments.map(f => {
                const receiver = f.requestItem?.request?.receiver;
                const receiverName = receiver?.fullName ||
                    f.requestItem?.request?.receiverName ||
                    'Anonymous Receiver';

                return {
                    id: f.id,
                    item: f.requestItem?.itemName || 'Unknown Item',
                    quantity: f.quantity,
                    date: f.fulfilledAt ? new Date(f.fulfilledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently',
                    status: f.status || 'Delivered',
                    receiver: receiverName,
                    receiverDetails: receiver
                };
            });
            setDonations(formattedDonations);

            // Format claims (donation side - when receivers claim donor's posts)
            const rawClaims = claimsRes.data.data || [];
            const formattedClaims = rawClaims.map(claim => {
                const donationItem = claim.donationItem;
                const donationPost = donationItem?.donationPost;
                return {
                    id: claim.id,
                    item: donationItem?.itemName || 'Unknown Item',
                    quantity: claim.quantity,
                    availableQuantity: donationItem?.quantity - donationItem?.claimedQuantity,
                    date: claim.claimedAt ? new Date(claim.claimedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently',
                    status: claim.status,
                    receiver: claim.receiver,
                    postTitle: donationPost?.title || 'Donation Post'
                };
            });
            setClaims(formattedClaims);

        } catch (err) {
            console.error('Failed to load donor data:', err);
            const errorMessage = err.response?.data?.message || '';
            if (err.response?.status === 404 || err.response?.status === 500 || errorMessage.includes('User not found')) {
                logout();
                navigate('/login');
                return;
            }
            setError('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.id) {
            fetchData();
        }
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm(prev => ({ ...prev, [name]: value }));
        setPasswordError('');
        setPasswordSuccess(false);
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            setError('');
            setSuccessMessage('');
            const response = await api.put(`/users/${user.id}`, editForm);
            const userData = response.data.data;
            setProfile(prev => ({
                ...prev,
                fullName: userData.fullName,
                phone: userData.phone,
                address: userData.address
            }));
            updateUser({
                fullName: userData.fullName,
                phone: userData.phone,
                address: userData.address
            });
            setIsEditing(false);
            setSuccessMessage('Profile updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordError('New passwords do not match');
            return;
        }
        if (passwordForm.newPassword.length < 8) {
            setPasswordError('Password must be at least 8 characters');
            return;
        }

        try {
            setPasswordError('');
            await api.post(`/users/${user.id}/change-password`, {
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            });
            setPasswordSuccess(true);
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setPasswordError(err.response?.data?.message || 'Failed to change password');
        }
    };

    // Handle claim acceptance
    const handleAcceptClaim = async (claimId) => {
        try {
            setClaimsLoading(true);
            setClaimMessage({ type: '', text: '' });
            await api.put(`/donations/claims/${claimId}/status?status=APPROVED`);
            setClaimMessage({ type: 'success', text: 'Claim accepted successfully!' });
            fetchData();
            setTimeout(() => setClaimMessage({ type: '', text: '' }), 3000);
        } catch (err) {
            setClaimMessage({ type: 'error', text: err.response?.data?.message || 'Failed to accept claim' });
        } finally {
            setClaimsLoading(false);
        }
    };

    // Handle claim rejection
    const handleRejectClaim = async (claimId) => {
        try {
            setClaimsLoading(true);
            setClaimMessage({ type: '', text: '' });
            await api.put(`/donations/claims/${claimId}/status?status=REJECTED`);
            setClaimMessage({ type: 'success', text: 'Claim rejected successfully!' });
            fetchData();
            setTimeout(() => setClaimMessage({ type: '', text: '' }), 3000);
        } catch (err) {
            setClaimMessage({ type: 'error', text: err.response?.data?.message || 'Failed to reject claim' });
        } finally {
            setClaimsLoading(false);
        }
    };

    const closeSettings = () => {
        setActiveSettings(null);
        setPasswordError('');
        setPasswordSuccess(false);
    };

    // Helper function to get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'APPROVED':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'REJECTED':
                return 'bg-red-100 text-red-700 border-red-200';
            case 'COMPLETED':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getUserTypeInfo = (count) => {
        if (count < 5) return { type: 'Elite User', color: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-200' };
        if (count >= 5 && count < 10) return { type: 'Bronze User', color: 'text-amber-700', bg: 'bg-amber-100', border: 'border-amber-200' };
        if (count >= 10 && count < 20) return { type: 'Silver User', color: 'text-gray-500', bg: 'bg-gray-100', border: 'border-gray-200' };
        if (count >= 20 && count < 30) return { type: 'Gold User', color: 'text-yellow-600', bg: 'bg-yellow-100', border: 'border-yellow-200' };
        if (count >= 30 && count < 40) return { type: 'Platinum User', color: 'text-cyan-600', bg: 'bg-cyan-100', border: 'border-cyan-200' };
        return { type: 'Premium User', color: 'text-purple-600', bg: 'bg-purple-100', border: 'border-purple-200' };
    };

    const userTypeInfo = getUserTypeInfo(profile.donationCount);

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8">
            {/* Back Button */}
            <button
                onClick={() => navigate('/donor')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
            >
                <ArrowLeft size={20} />
                Back to Dashboard
            </button>

            {/* Header Section */}
            <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 text-white relative overflow-hidden shadow-lg">
                <div className="relative shrink-0 z-10">
                    <div
                        className="w-32 h-32 bg-white/20 backdrop-blur-sm shadow-xl border-4 border-white/40 rounded-full flex items-center justify-center overflow-hidden transition-all duration-300 hover:scale-105 hover:border-white cursor-pointer group"
                        onClick={() => {
                            if (profile.profileImageUrl) setIsViewingDp(true);
                            else fileInputRef.current?.click();
                        }}
                        title={profile.profileImageUrl ? "View profile picture" : "Upload profile picture"}
                    >
                        {profile.profileImageUrl ? (
                            <img src={getImageUrl(profile.profileImageUrl)} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <User size={64} className="text-white/80 transition-transform hover:scale-110 duration-500" />
                        )}
                        {profile.profileImageUrl && (
                            <div className="absolute inset-0 bg-black/30 invisible opacity-0 group-hover:visible group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                                <Eye className="text-white" size={24} />
                            </div>
                        )}
                    </div>
                    
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-1 right-1 bg-white text-primary p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors border border-gray-200 z-20"
                        title="Change profile picture"
                    >
                        <User size={16} />
                    </button>

                    {uploadingImage && (
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center z-30">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        </div>
                    )}
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                </div>
                <div className="flex-1 text-center md:text-left z-10">
                    <h1 className="text-3xl font-bold">{profile.fullName}</h1>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-3">
                        <span className={`px-4 py-1.5 rounded-full text-sm font-bold border shadow-sm backdrop-blur-md bg-white/10 border-white/30 text-white`}>
                            {userTypeInfo.type}
                        </span>
                        <span className="text-white bg-black/20 px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm border border-black/10">
                            <HeartHandshake size={14} className="inline mr-1" />
                            {profile.donationCount} Donations Made
                        </span>
                    </div>
                    <p className="text-white/90 flex items-center justify-center md:justify-start gap-2 mt-3 font-medium">
                        <Mail size={16} /> {profile.email}
                    </p>
                    <p className="text-white/80 text-sm mt-3 opacity-90 inline-block px-3 py-1 bg-white/10 rounded-full border border-white/5">Member since {profile.joinedDate}</p>
                </div>

                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                <div className="absolute bottom-0 right-32 w-48 h-48 bg-black/10 rounded-full translate-y-1/3 blur-2xl"></div>
            </div>

            {/* Claim Message */}
            {claimMessage.text && (
                <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-lg ${claimMessage.type === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                    {claimMessage.type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
                    <span className="font-medium">{claimMessage.text}</span>
                </div>
            )}

            <div className="max-w-2xl mx-auto">
                {/* Details & Settings */}
                <div className="space-y-8">
                    {/* Contact Details */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 relative">
                        {successMessage && (
                            <div className="absolute top-0 left-0 right-0 -mt-12 flex justify-center">
                                <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium shadow-sm flex items-center gap-2">
                                    <Check size={16} /> {successMessage}
                                </div>
                            </div>
                        )}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <User size={20} className="text-primary" />
                                Personal Details
                            </h2>
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="text-primary hover:text-primary-dark text-sm font-medium"
                                >
                                    Edit
                                </button>
                            ) : (
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleProfileUpdate}
                                        className="text-primary hover:text-primary-dark text-sm font-bold"
                                    >
                                        Save
                                    </button>
                                </div>
                            )}
                        </div>

                        {!isEditing ? (
                            <div className="space-y-4">
                                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-5 h-5 flex items-center justify-center text-gray-400 mt-1">
                                        <User size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Full Name</p>
                                        <p className="font-medium">{profile.fullName}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                    <Phone size={20} className="text-gray-400 mt-1" />
                                    <div>
                                        <p className="text-sm text-gray-500">Phone</p>
                                        <p className="font-medium">{profile.phone || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                    <MapPin size={20} className="text-gray-400 mt-1" />
                                    <div>
                                        <p className="text-sm text-gray-500">Address</p>
                                        <p className="font-medium">{profile.address || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <form className="space-y-4">
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block px-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={editForm.fullName}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, fullName: e.target.value }))}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block px-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={editForm.phone}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block px-1">Address</label>
                                    <textarea
                                        value={editForm.address}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary text-sm h-20"
                                        placeholder="Enter the full address eg: name of City/village, area, pincode"
                                    />
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Account Settings */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Shield size={20} className="text-primary" />
                            Account Settings
                        </h2>
                        <div className="space-y-2">
                            <button
                                onClick={() => setActiveSettings('password')}
                                className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-left group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100">
                                        <Key size={18} />
                                    </div>
                                    <span className="font-medium text-gray-700">Change Password</span>
                                </div>
                                <span className="text-gray-400">→</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Full Screen DP Modal */}
            {isViewingDp && profile.profileImageUrl && (
                <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
                    <button
                        onClick={() => setIsViewingDp(false)}
                        className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
                    >
                        <X size={24} />
                    </button>
                    <img
                        src={getImageUrl(profile.profileImageUrl)}
                        alt="Profile"
                        className="max-w-full max-h-[90vh] object-contain shadow-2xl rounded-sm"
                    />
                </div>
            )}

            {/* Password Settings Modal */}
            {activeSettings === 'password' && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <Key size={20} className="text-blue-600" />
                                    Change Password
                                </h2>
                                <button onClick={closeSettings} className="p-2 hover:bg-gray-100 rounded-lg">
                                    <X size={20} className="text-gray-500" />
                                </button>
                            </div>
                            <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword.current ? "text" : "password"}
                                            name="currentPassword"
                                            value={passwordForm.currentPassword}
                                            onChange={handlePasswordChange}
                                            className="w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:border-blue-500"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
                                            className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword.new ? "text" : "password"}
                                            name="newPassword"
                                            value={passwordForm.newPassword}
                                            onChange={handlePasswordChange}
                                            className="w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:border-blue-500"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                                            className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword.confirm ? "text" : "password"}
                                            name="confirmPassword"
                                            value={passwordForm.confirmPassword}
                                            onChange={handlePasswordChange}
                                            className="w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:border-blue-500"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                                            className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                                {passwordError && (
                                    <div className="flex items-center gap-2 text-red-600 text-sm">
                                        <AlertCircle size={16} />
                                        {passwordError}
                                    </div>
                                )}
                                {passwordSuccess && (
                                    <div className="flex items-center gap-2 text-green-600 text-sm">
                                        <Check size={16} />
                                        Password changed successfully!
                                    </div>
                                )}
                                <button
                                    type="submit"
                                    className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                    Update Password
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Receiver Details Modal */}
            {selectedReceiver && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <User size={20} className="text-primary" />
                                Receiver Details
                            </h2>
                            <button onClick={() => setSelectedReceiver(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <p className="text-sm text-gray-500 mb-1">Full Name</p>
                                <p className="font-bold text-gray-900 text-lg">{selectedReceiver.fullName}</p>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                                    <Phone size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500">Phone</p>
                                    <p className="font-bold text-gray-900">{selectedReceiver.phone || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                                    <Mail size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-bold text-gray-900">{selectedReceiver.email}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center shrink-0">
                                    <MapPin size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500">Address</p>
                                    <p className="font-bold text-gray-900 leading-tight">
                                        {formatAddress(selectedReceiver)}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setSelectedReceiver(null)}
                            className="w-full mt-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DonorProfile;
