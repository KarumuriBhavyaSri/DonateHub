import React, { useState } from 'react';
import { Mail, Phone, MapPin, X, User, Eye } from 'lucide-react';
import api from '../api';

const UserDetailsModal = ({ isOpen, onClose, user }) => {
    const [isViewingDp, setIsViewingDp] = useState(false);

    if (!isOpen || !user) return null;

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        const baseUrl = api.defaults.baseURL.replace('/api', '');
        return `${baseUrl}${path}`;
    };

    const formatAddress = (userData) => {
        if (userData?.houseNumber || userData?.city) {
            let parts = [];
            if (userData.houseNumber) parts.push(userData.houseNumber);
            if (userData.streetLandmark) parts.push(userData.streetLandmark);
            if (userData.areaLocality) parts.push(userData.areaLocality);
            if (userData.city) parts.push(userData.city);
            if (userData.district) parts.push(userData.district);
            if (userData.state) parts.push(userData.state);
            if (userData.pincode) parts.push(userData.pincode);
            if (userData.country) parts.push(userData.country);
            return parts.join(', ');
        }
        return userData?.address || 'Address not listed';
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white rounded-2xl shadow-2xl z-10 w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in duration-200">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition z-20"
                >
                    <X size={20} />
                </button>

                {/* Header Profile Card Area */}
                <div className="bg-gradient-to-r from-primary to-primary-dark p-8 pb-12 relative flex flex-col items-center text-center">
                    <div
                        className={`w-28 h-28 bg-white/20 backdrop-blur-sm border-4 border-white/40 shadow-xl rounded-full flex items-center justify-center overflow-hidden mb-4 relative group ${user.profileImageUrl ? 'cursor-pointer hover:scale-105 transition-all' : ''}`}
                        onClick={() => user.profileImageUrl && setIsViewingDp(true)}
                    >
                        {user.profileImageUrl ? (
                            <>
                                <img
                                    src={getImageUrl(user.profileImageUrl)}
                                    alt={user.fullName}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/30 invisible opacity-0 group-hover:visible group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                                    <Eye className="text-white" size={24} />
                                </div>
                            </>
                        ) : (
                            <User size={56} className="text-white/80" />
                        )}
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                        {user.role === 'RECEIVER' 
                            ? (user.organizationName || 'Receiver Organization') 
                            : (user.fullName || user.username)}
                    </h2>
                    <span className="text-white/90 text-sm font-semibold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full border border-white/20 backdrop-blur-sm shadow-sm">
                        {user.role === 'RECEIVER' ? 'Verified Receiver' : 'Donor / User'}
                    </span>

                    {/* Decorative bottom curve */}
                    <div className="absolute bottom-0 left-0 right-0 max-h-8 overflow-hidden transform translate-y-px">
                        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-8 text-white fill-current">
                            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"></path>
                            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"></path>
                            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
                        </svg>
                    </div>
                </div>

                {/* Details Section */}
                <div className="p-8 pt-6 space-y-6">

                    <div className="flex items-center gap-4 group">
                        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition shadow-sm border border-blue-100">
                            <Mail size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-400 tracking-wider">EMAIL ADDRESS</p>
                            <p className="text-gray-800 font-medium">{user.email || 'Not provided'}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 group">
                        <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition shadow-sm border border-green-100">
                            <Phone size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-400 tracking-wider">PHONE NUMBER</p>
                            <p className="text-gray-800 font-medium">{user.phone || 'Not provided'}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 group">
                        <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition shrink-0 shadow-sm border border-red-100 mt-1">
                            <MapPin size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-400 tracking-wider mb-1">LOCATION & ADDRESS</p>
                            <p className="text-gray-800 font-medium leading-relaxed">{formatAddress(user)}</p>
                        </div>
                    </div>

                    {user.role === 'RECEIVER' && (
                        <>
                            {(user.govtCertificationId || user.runnerName) && (
                                <div className="border-t border-gray-100 pt-6">
                                    <p className="text-xs font-bold text-gray-400 tracking-[0.2em] mb-4 uppercase">Verification Details</p>
                                    <div className="grid grid-cols-1 gap-4">
                                        {user.govtCertificationId && (
                                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                                <p className="text-[10px] font-bold text-primary tracking-wider uppercase mb-1">Govt License / ID</p>
                                                <p className="text-gray-800 font-semibold">{user.govtCertificationId}</p>
                                            </div>
                                        )}
                                        {user.runnerName && (
                                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                                <p className="text-[10px] font-bold text-primary tracking-wider uppercase mb-1">Point of Contact / Runner</p>
                                                <p className="text-gray-800 font-semibold">{user.runnerName}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                </div>

                {/* Receiver Gallery Images */}
                {user?.galleryImages && user.galleryImages.length > 0 && (
                    <div className="px-8 pb-6 pt-0 border-t border-gray-100 mt-2">
                        <p className="text-sm font-semibold text-gray-400 tracking-wider mb-3 mt-4">GALLERY / NEEDS</p>
                        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                            {user.galleryImages.map((imgUrl, index) => (
                                <img
                                    key={index}
                                    src={getImageUrl(imgUrl)}
                                    alt={`Gallery detail ${index + 1}`}
                                    className="w-24 h-24 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0 border border-gray-200 shadow-sm"
                                    onClick={() => window.open(getImageUrl(imgUrl), '_blank')}
                                />
                            ))}
                        </div>
                    </div>
                )}

                <div className="bg-gray-50 border-t p-4 text-center">
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl transition shadow-sm"
                    >
                        Close Details
                    </button>
                    <p className="text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
                        Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'Unknown'}
                    </p>
                </div>
            </div>

            {/* Full Screen DP Modal */}
            {isViewingDp && user.profileImageUrl && (
                <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
                    <button
                        onClick={() => setIsViewingDp(false)}
                        className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
                    >
                        <X size={24} />
                    </button>
                    <img
                        src={getImageUrl(user.profileImageUrl)}
                        alt={user.fullName || 'User Profile'}
                        className="max-w-full max-h-[90vh] object-contain shadow-2xl rounded-sm"
                    />
                </div>
            )}
        </div>
    );
};

export default UserDetailsModal;
