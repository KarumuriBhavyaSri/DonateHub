import React, { useEffect, useState } from 'react';
import api from '../api';
import RequestCard from '../components/RequestCard';
import { Search, MapPin, ArrowLeft, Trash2, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PostDonationForm from '../components/PostDonationForm';
import UserDetailsModal from '../components/UserDetailsModal';

const DonorDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [donations, setDonations] = useState([]); // Donor's own donation posts
    const [fulfillments, setFulfillments] = useState([]);
    const [claims, setClaims] = useState([]);
    const [viewMode, setViewMode] = useState('options');
    const [historyFilter, setHistoryFilter] = useState('all');
    const [showHistoryList, setShowHistoryList] = useState(false);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [sortOrder, setSortOrder] = useState('newest');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUserForModal, setSelectedUserForModal] = useState(null);
    const [deleteConfirmPost, setDeleteConfirmPost] = useState(null); // { id, hasClaims }

    const { user } = useAuth();
    const navigate = useNavigate();

    const categories = ['Blankets', 'Food', 'Shirts', 'Pants', 'Coats', 'Others'];

    useEffect(() => {
        fetchData();
    }, [user]);

    const fetchRequests = async () => {
        try {
            const response = await api.get('/requests');
            setRequests(Array.isArray(response.data.data) ? response.data.data : []);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        let result = [...requests];

        result = result.filter(r => r.status !== 'COMPLETED');

        if (categoryFilter) {
            result = result.filter(r => r.category === categoryFilter);
        }

        if (locationFilter) {
            result = result.filter(r =>
                r.location?.toLowerCase().includes(locationFilter.toLowerCase())
            );
        }

        result.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });

        setFilteredRequests(result);

    }, [categoryFilter, locationFilter, sortOrder, requests]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [requestsRes, fulfillmentsRes, claimsRes, donationsRes] = await Promise.all([
                api.get('/requests'),
                user?.id ? api.get(`/requests/donor/${user.id}/fulfillments`) : Promise.resolve({ data: { data: [] } }),
                user?.id ? api.get(`/donations/claims/donor/${user.id}`) : Promise.resolve({ data: { data: [] } }),
                user?.id ? api.get(`/donations/donor/${user.id}`) : Promise.resolve({ data: { data: [] } })
            ]);
            setRequests(Array.isArray(requestsRes.data.data) ? requestsRes.data.data : []);
            setFulfillments(Array.isArray(fulfillmentsRes.data.data) ? fulfillmentsRes.data.data : []);
            setClaims(Array.isArray(claimsRes.data.data) ? claimsRes.data.data : []);
            setDonations(Array.isArray(donationsRes.data.data) ? donationsRes.data.data : []);
        } catch (error) {
            console.error(error);
            setError("Could not load donation data.");
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptClaim = async (claimId) => {
        try {
            setHistoryLoading(true);
            await api.put(`/donations/claims/${claimId}/status?status=APPROVED`);
            alert('Claim accepted!');
            fetchData();
        } catch (err) {
            console.error(err);
            alert('Failed to accept claim.');
        } finally {
            setHistoryLoading(false);
        }
    };

    const handleRejectClaim = async (claimId) => {
        try {
            setHistoryLoading(true);
            await api.put(`/donations/claims/${claimId}/status?status=REJECTED`);
            alert('Claim rejected.');
            fetchData();
        } catch (err) {
            console.error(err);
            alert('Failed to reject claim.');
        } finally {
            setHistoryLoading(false);
        }
    };

    const handleDeleteDonationPost = (donationId) => {
        // Find the donation to check if it has claims
        const don = donations.find(d => d.id === donationId);
        const hasClaims = don?.items?.some(i => (i.claimedQuantity || 0) > 0) || false;
        // Also check from claims list whether any claim refers to this donation post
        const claimsForPost = claims.filter(c => {
            const dItem = c.donationItem;
            return dItem?.donationPost?.id === donationId;
        });
        const actualHasClaims = hasClaims || claimsForPost.length > 0;
        setDeleteConfirmPost({ id: donationId, hasClaims: actualHasClaims });
    };

    const confirmDeleteDonationPost = async () => {
        if (!deleteConfirmPost) return;
        try {
            await api.delete(`/donations/${deleteConfirmPost.id}`);
            setDonations(prev => prev.filter(d => d.id !== deleteConfirmPost.id));
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Failed to delete post.');
        } finally {
            setDeleteConfirmPost(null);
        }
    };

    // --- Unified History Logic ---
    const allHistoryItems = (() => {
        const mappedOpenRequests = requests
            .filter(r => ['OPEN', 'PARTIALLY_FULFILLED'].includes(r.status))
            .map(r => ({
                id: `req-${r.id}`,
                title: r.title || 'Request',
                quantity: r.items?.reduce((acc, i) => acc + (i.requiredQuantity - i.fulfilledQuantity), 0) || 0,
                type: 'Open Request',
                status: r.status,
                date: new Date(r.createdAt),
                source: 'open_request',
                subtext: `From ${r.receiver?.organizationName || r.receiver?.fullName || 'Receiver'}`,
                receiver: r.receiver,
                prefix: 'From'
            }));

        const mappedFulfillments = fulfillments.map(f => ({
            id: `ful-${f.id}`,
            title: f.requestItem?.itemName || 'Fulfillment',
            quantity: f.quantity,
            type: 'Your Commitment',
            status: f.status,
            date: new Date(f.fulfilledAt || f.createdAt),
            source: 'fulfillment',
            subtext: `To ${f.requestItem?.request?.receiver?.organizationName || f.requestItem?.request?.receiver?.fullName || 'Receiver'}`,
            receiver: f.requestItem?.request?.receiver,
            prefix: 'To'
        }));

        const mappedClaims = claims.map(c => ({
            id: `clm-${c.id}`,
            realId: c.id,
            title: c.donationItem?.itemName || 'Claim',
            quantity: c.quantity,
            type: 'Receiver Claim',
            status: c.status,
            date: new Date(c.claimedAt || c.createdAt),
            source: 'claim',
            subtext: `By ${c.receiver?.organizationName || c.receiver?.fullName || 'Receiver'}`,
            receiver: c.receiver,
            prefix: 'By'
        }));

        const mappedOwnDonations = donations.map(d => ({
            id: `don-${d.id}`,
            title: d.title || 'Your Post',
            quantity: d.items?.reduce((acc, i) => acc + i.quantity, 0) || 0,
            type: 'Your Donation Post',
            status: d.status,
            date: new Date(d.createdAt),
            source: 'own_donation',
            subtext: 'Posted by you',
            donorCount: d.donor?.donationCount || 0,
            receiver: null,
            prefix: ''
        }));

        return [...mappedOpenRequests, ...mappedFulfillments, ...mappedClaims, ...mappedOwnDonations];
    })();

    const counts = {
        open: allHistoryItems.filter(i => i.source === 'open_request').length,
        active: allHistoryItems.filter(i =>
            (i.source === 'fulfillment' && ['PENDING', 'APPROVED'].includes(i.status)) ||
            (i.source === 'claim' && ['PENDING', 'APPROVED'].includes(i.status))
        ).length,
        fulfilled: allHistoryItems.filter(i =>
            (i.source === 'fulfillment' && ['DELIVERED', 'COMPLETED', 'RECEIVED', 'FULFILLED'].includes(i.status)) ||
            (i.source === 'claim' && ['RECEIVED', 'COMPLETED', 'FULFILLED'].includes(i.status))
        ).length,
        all: allHistoryItems.filter(i => ['own_donation', 'fulfillment', 'claim'].includes(i.source)).length
    };

    const historyItemsToShow = (() => {
        let items = [...allHistoryItems];
        if (historyFilter === 'open') {
            items = items.filter(i => i.source === 'open_request');
        } else if (historyFilter === 'active') {
            items = items.filter(i =>
                (i.source === 'fulfillment' && ['PENDING', 'APPROVED'].includes(i.status)) ||
                (i.source === 'claim' && ['PENDING', 'APPROVED'].includes(i.status))
            );
        } else if (historyFilter === 'fulfilled') {
            items = items.filter(i =>
                (i.source === 'fulfillment' && ['DELIVERED', 'COMPLETED', 'RECEIVED', 'FULFILLED'].includes(i.status)) ||
                (i.source === 'claim' && ['RECEIVED', 'COMPLETED', 'FULFILLED'].includes(i.status))
            );
        } else if (historyFilter === 'all') {
            items = items.filter(i => ['own_donation', 'fulfillment', 'claim'].includes(i.source));
        }
        return items.sort((a, b) => b.date - a.date);
    })();

    const handleBoxClick = (filter) => {
        setHistoryFilter(filter);
        setShowHistoryList(true);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'APPROVED': return 'bg-green-100 text-green-700 border-green-200';
            case 'REJECTED': return 'bg-red-100 text-red-700 border-red-200';
            case 'OPEN': return 'bg-green-100 text-green-700 border-green-200';
            case 'COMPLETED':
            case 'RECEIVED':
            case 'DELIVERED':
            case 'FULFILLED': return 'bg-teal-100 text-teal-700 border-teal-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
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

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">

            {/* Back Button */}
            {(showHistoryList || viewMode !== 'options') && (
                <button
                    onClick={() => {
                        if (showHistoryList) {
                            setShowHistoryList(false);
                        } else {
                            setViewMode('options');
                        }
                    }}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-medium"
                >
                    <ArrowLeft size={20} />
                    {showHistoryList ? 'Back to Dashboard' : 'Back to Options'}
                </button>
            )}

            {/* Hero Section */}
            {viewMode !== 'post' && (
                <div className="bg-gradient-to-r from-primary to-indigo-800 text-white p-12 rounded-2xl mb-12 shadow-xl">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl font-bold mb-4">Make a Difference Today</h1>
                        <p className="text-xl opacity-90 mb-8">
                            Connect directly with people in need. Your small contribution can change a life.
                        </p>

                        <div className="flex gap-4 flex-wrap">
                            <div
                                onClick={() => handleBoxClick('open')}
                                className="bg-white/20 backdrop-blur-sm p-4 rounded-lg text-center min-w-[120px] cursor-pointer hover:bg-white/30 transition"
                            >
                                <span className="block text-3xl font-bold">{counts.open}</span>
                                <span className="text-sm opacity-90 font-medium">Open Requests</span>
                            </div>

                            <div
                                onClick={() => handleBoxClick('active')}
                                className="bg-white/20 backdrop-blur-sm p-4 rounded-lg text-center min-w-[120px] cursor-pointer hover:bg-white/30 transition"
                            >
                                <span className="block text-3xl font-bold">{counts.active}</span>
                                <span className="text-sm opacity-90 font-medium">Active Requests</span>
                            </div>

                            <div
                                onClick={() => handleBoxClick('fulfilled')}
                                className="bg-white/20 backdrop-blur-sm p-4 rounded-lg text-center min-w-[120px] cursor-pointer hover:bg-white/30 transition"
                            >
                                <span className="block text-3xl font-bold">{counts.fulfilled}</span>
                                <span className="text-sm opacity-90 font-medium">Fulfilled Requests</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* History List Section */}
            {showHistoryList && (
                <div className="mb-12 bg-white rounded-2xl p-6 border shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 capitalize">
                            {historyFilter} Record
                        </h2>
                        <button
                            onClick={() => setShowHistoryList(false)}
                            className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition"
                        >
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex gap-2 mb-6">
                        {['all', 'open', 'active', 'fulfilled'].map(f => (
                            <button
                                key={f}
                                onClick={() => setHistoryFilter(f)}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${historyFilter === f
                                    ? 'bg-primary text-white shadow-md'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)} ({
                                    f === 'all' ? counts.all : counts[f]
                                })
                            </button>
                        ))}
                    </div>

                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                        {historyItemsToShow.length === 0 ? (
                            <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed">
                                No records found for this category.
                            </div>
                        ) : (
                            historyItemsToShow.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 p-4 border rounded-xl hover:shadow-md transition bg-white group">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm ${item.source === 'open_request' ? 'bg-blue-500' :
                                        item.source === 'fulfillment' ? 'bg-primary' :
                                            item.source === 'claim' ? 'bg-teal-500' : 'bg-green-500'
                                        }`}>
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold text-gray-900 group-hover:text-primary transition">{item.title} ({item.quantity})</h4>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    {item.receiver ? (
                                                        <p className="text-sm text-gray-500">
                                                            {item.prefix}{' '}
                                                            <button
                                                                onClick={() => setSelectedUserForModal(item.receiver)}
                                                                className="text-primary hover:text-primary-dark hover:underline font-bold focus:outline-none transition-colors"
                                                            >
                                                                {item.receiver.organizationName || item.receiver.fullName || 'Receiver'}
                                                            </button>
                                                        </p>
                                                    ) : (
                                                        <p className="text-sm text-gray-500">{item.subtext}</p>
                                                    )}
                                                    {item.source === 'own_donation' && getUserTypeInfo(item.donorCount) && (
                                                        <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getUserTypeInfo(item.donorCount).bg} ${getUserTypeInfo(item.donorCount).color} ${getUserTypeInfo(item.donorCount).border}`}>
                                                            {getUserTypeInfo(item.donorCount).type}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getStatusColor(item.status)}`}>
                                                {['COMPLETED', 'FULFILLED', 'RECEIVED', 'DELIVERED'].includes(item.status) ? 'COMPLETED & FULFILLED' : item.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 mt-2">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 px-2 py-0.5 rounded border">
                                                {item.type}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                {item.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                        {item.source === 'claim' && item.status === 'PENDING' && (
                                            <div className="flex gap-2 mt-3">
                                                <button
                                                    onClick={() => handleAcceptClaim(item.realId)}
                                                    disabled={historyLoading}
                                                    className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded hover:bg-green-600 disabled:opacity-50"
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleRejectClaim(item.realId)}
                                                    disabled={historyLoading}
                                                    className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded hover:bg-red-600 disabled:opacity-50"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                        {/* Delete button for donor's own donation posts */}
                                        {item.source === 'own_donation' && !['COMPLETED', 'FULLY_CLAIMED'].includes(item.status) && (
                                            <div className="mt-3">
                                                <button
                                                    onClick={() => handleDeleteDonationPost(item.id.replace('don-', '') * 1)}
                                                    className="flex items-center gap-1 px-3 py-1 text-xs font-bold text-red-600 bg-red-50 border border-red-200 rounded hover:bg-red-100 transition-colors"
                                                >
                                                    <Trash2 size={12} />
                                                    Delete Post
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* OPTIONS */}
            {viewMode === 'options' && (
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">

                    <div
                        onClick={() => setViewMode('browse')}
                        className="bg-white p-10 rounded-2xl shadow-sm border hover:border-primary hover:shadow-xl transition-all cursor-pointer flex flex-col items-center text-center group"
                    >
                        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Search className="text-primary" size={48} />
                        </div>

                        <h2 className="text-3xl font-bold mb-4 text-gray-800">
                            Browse Requests
                        </h2>

                        <p className="text-gray-600 text-lg">
                            Find people in need and fulfill their requests directly.
                        </p>
                    </div>

                    <div
                        onClick={() => setViewMode('post')}
                        className="bg-white p-10 rounded-2xl shadow-sm border hover:border-green-500 hover:shadow-xl transition-all cursor-pointer flex flex-col items-center text-center group"
                    >
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">

                            <svg xmlns="http://www.w3.org/2000/svg"
                                width="48"
                                height="48"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-green-600">

                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>

                            </svg>

                        </div>

                        <h2 className="text-3xl font-bold mb-4 text-gray-800">
                            Post Donation
                        </h2>

                        <p className="text-gray-600 text-lg">
                            Have extra items? Post them here so receivers can claim what they need.
                        </p>

                    </div>
                </div>
            )}

            {viewMode === 'post' && (
                <div className="py-2">
                    <PostDonationForm
                        onBack={() => setViewMode('options')}
                        onSuccess={() => setViewMode('options')}
                    />
                </div>
            )}

            {viewMode === 'browse' && (
                <>
                    {/* Filters */}
                    <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-6 rounded-xl shadow-md border items-stretch md:items-center">

                        {/* Category Filter */}
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-600 mb-1">Category</label>
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
                            >
                                <option value="">All Categories</option>

                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Location Filter */}
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-600 mb-1">Location</label>
                            <div className="relative">

                                <MapPin
                                    className="absolute left-3 top-3 text-gray-400"
                                    size={18}
                                />

                                <input
                                    type="text"
                                    placeholder="Filter by Location..."
                                    value={locationFilter}
                                    onChange={(e) => setLocationFilter(e.target.value)}
                                    className="w-full pl-10 border border-gray-300 rounded-lg px-4 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
                                />
                            </div>
                        </div>

                        {/* Sort */}
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-600 mb-1">Sort By</label>
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                            </select>
                        </div>

                    </div>

                    {/* Requests */}
                    {loading ? (
                        <div className="text-center py-10">Loading...</div>

                    ) : error ? (
                        <div className="text-center py-10 text-red-600">
                            {error}
                        </div>

                    ) : filteredRequests.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-lg border border-dashed">
                            <p className="text-gray-500">
                                No requests found matching your filters.
                            </p>
                        </div>

                    ) : (
                        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">

                            {filteredRequests.map(req => (
                                <RequestCard
                                    key={req.id}
                                    request={req}
                                    onUpdate={fetchRequests}
                                />
                            ))}

                        </div>
                    )}
                </>
            )}

            {/* Receiver Details Modal */}
            <UserDetailsModal
                isOpen={!!selectedUserForModal}
                onClose={() => setSelectedUserForModal(null)}
                user={selectedUserForModal}
            />

            {/* Delete Donation Post Confirmation Modal */}
            {deleteConfirmPost && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in fade-in duration-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <AlertTriangle size={24} className="text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Delete Donation Post?</h3>
                                {deleteConfirmPost.hasClaims ? (
                                    <p className="text-sm text-red-600 font-medium mt-0.5">⚠️ Someone has already claimed this post!</p>
                                ) : (
                                    <p className="text-sm text-gray-500 mt-0.5">No claims yet — safe to delete.</p>
                                )}
                            </div>
                        </div>

                        {deleteConfirmPost.hasClaims && (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 text-sm text-amber-800">
                                Deleting this post may <strong>affect your score and badge</strong> because a person has already claimed it. Are you sure you want to continue?
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteConfirmPost(null)}
                                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                            >
                                Keep Post
                            </button>
                            <button
                                onClick={confirmDeleteDonationPost}
                                className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors"
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default DonorDashboard;