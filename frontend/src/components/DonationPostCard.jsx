import React, { useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { MapPin, Box, Briefcase, Info, CheckCircle, Clock } from 'lucide-react';

const DonationPostCard = ({ post, onClaimSuccess }) => {
    const { user } = useAuth();
    const [claimingItemId, setClaimingItemId] = useState(null);
    const [claimQuantity, setClaimQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleClaimClick = (itemId, maxQuantity) => {
        setClaimingItemId(itemId);
        setClaimQuantity(1); // Reset to 1 on open
        setError(null);
    };

    const cancelClaim = () => {
        setClaimingItemId(null);
        setError(null);
    };

    const submitClaim = async (itemId) => {
        try {
            setLoading(true);
            setError(null);
            const payload = {
                receiverId: user.id,
                donationItemId: itemId,
                quantity: parseInt(claimQuantity)
            };
            await api.post('/donations/claim', payload);
            setClaimingItemId(null);
            if (onClaimSuccess) onClaimSuccess();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to claim items');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'OPEN':
                return <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 flex items-center gap-1"><CheckCircle size={14} /> Available</span>;
            case 'PARTIALLY_CLAIMED':
                return <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 flex items-center gap-1"><Clock size={14} /> Partially Claimed</span>;
            case 'CLOSED':
                return <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800 flex items-center gap-1"><Info size={14} /> Closed</span>;
            default:
                return null;
        }
    };

    const getUserTypeInfo = (count) => {
        if (!count && count !== 0) return null;
        if (count < 5) return { type: 'Elite User', color: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-200' };
        if (count >= 5 && count < 10) return { type: 'Bronze User', color: 'text-amber-700', bg: 'bg-amber-100', border: 'border-amber-200' };
        if (count >= 10 && count < 20) return { type: 'Silver User', color: 'text-gray-500', bg: 'bg-gray-100', border: 'border-gray-200' };
        if (count >= 20 && count < 30) return { type: 'Gold User', color: 'text-yellow-600', bg: 'bg-yellow-100', border: 'border-yellow-200' };
        if (count >= 30 && count < 40) return { type: 'Platinum User', color: 'text-cyan-600', bg: 'bg-cyan-100', border: 'border-cyan-200' };
        return { type: 'Premium User', color: 'text-purple-600', bg: 'bg-purple-100', border: 'border-purple-200' };
    };

    const donorTypeInfo = post.donor ? getUserTypeInfo(post.donor.donationCount) : null;

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border hover:border-teal-500 hover:shadow-lg transition flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-800">{post.title}</h3>
                    {getStatusBadge(post.status)}
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
                    <span className="flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-md border"><Briefcase size={16} className="text-primary" /> {post.category}</span>
                    <span className="flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-md border"><MapPin size={16} className="text-red-500" /> {post.location}</span>
                </div>

                <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-2 border-b pb-2 flex items-center gap-2">
                        <Box size={18} className="text-teal-600" /> Available Items
                    </h4>
                    {error && claimingItemId && <div className="text-red-500 text-sm mb-2">{error}</div>}
                    <ul className="space-y-3">
                        {(post.items || []).map(item => {
                            const available = item.quantity - item.claimedQuantity;
                            const isClaiming = claimingItemId === item.id;

                            return (
                                <li key={item.id} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <span className="font-medium block text-gray-800">{item.itemName}</span>
                                            <span className="text-xs text-gray-500">
                                                Available: {available} / {item.quantity}
                                            </span>
                                        </div>

                                        {!isClaiming && available > 0 && post.status !== 'CLOSED' && (
                                            <button
                                                onClick={() => handleClaimClick(item.id, available)}
                                                className="bg-teal-600 text-white px-4 py-1.5 rounded-md text-sm font-semibold hover:bg-teal-700 transition shadow-sm"
                                            >
                                                Claim
                                            </button>
                                        )}
                                        {!isClaiming && available === 0 && (
                                            <span className="text-xs text-gray-400 font-medium italic">Fully Claimed</span>
                                        )}

                                        {isClaiming && (
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max={available}
                                                    value={claimQuantity}
                                                    onChange={(e) => setClaimQuantity(e.target.value)}
                                                    className="w-16 px-2 py-1 text-sm border-2 border-teal-500 rounded-md focus:outline-none"
                                                />
                                                <button
                                                    onClick={() => submitClaim(item.id)}
                                                    disabled={loading}
                                                    className="bg-teal-600 text-white px-3 py-1 rounded-md text-sm font-semibold hover:bg-teal-700 transition"
                                                >
                                                    Confirm
                                                </button>
                                                <button
                                                    onClick={cancelClaim}
                                                    className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm font-semibold hover:bg-gray-300 transition"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t text-sm text-gray-500 flex justify-between items-center">
                <div className="flex flex-col">
                    <span>Offered by: <span className="font-medium text-gray-700">{post.donor?.fullName || 'Anonymous'}</span></span>
                    {donorTypeInfo && (
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-bold border w-max ${donorTypeInfo.bg} ${donorTypeInfo.color} ${donorTypeInfo.border}`}>
                            {donorTypeInfo.type}
                        </span>
                    )}
                </div>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
        </div>
    );
};

export default DonationPostCard;
