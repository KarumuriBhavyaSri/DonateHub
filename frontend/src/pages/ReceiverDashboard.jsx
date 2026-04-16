import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import RequestCard from '../components/RequestCard';
import DonationPostCard from '../components/DonationPostCard';
import { Plus, ArrowLeft, Box, Briefcase, CheckCircle, Package, AlertTriangle, ShieldAlert } from 'lucide-react';
import ReportModal from '../components/ReportModal';

const ReceiverDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [donations, setDonations] = useState([]);
  const [claims, setClaims] = useState([]);
  const [fulfillments, setFulfillments] = useState([]);

  const [filteredRequests, setFilteredRequests] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [viewMode, setViewMode] = useState('options');
  const [donationCategoryFilter, setDonationCategoryFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const [showHistory, setShowHistory] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyFilter, setHistoryFilter] = useState('all');

  const [reportingItem, setReportingItem] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Fetch Requests
  useEffect(() => {
    const fetchRequests = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const res = await api.get(`/requests/receiver/${user.id}`);
        setRequests(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (err) {
        console.error(err);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [user]);

  // Fetch Donations
  const fetchDonations = async () => {
    setLoading(true);
    try {
      const res = await api.get('/donations');
      setDonations(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (viewMode === 'donations') {
      fetchDonations();
    }
  }, [viewMode]);

  // Fetch History (Claims & Fulfillments)
  const fetchHistoryData = async () => {
    if (!user?.id) return;
    try {
      setHistoryLoading(true);
      const [claimsRes, fulfillmentsRes] = await Promise.all([
        api.get(`/donations/claims/receiver/${user.id}`),
        api.get(`/requests/receiver/${user.id}/fulfillments`)
      ]);

      const rawClaims = claimsRes.data.data || [];
      setClaims(
        rawClaims.map((claim) => {
          const donationItem = claim.donationItem;
          const donationPost = donationItem?.donationPost;
          return {
            id: claim.id,
            item: donationItem?.itemName || 'Unknown Item',
            quantity: claim.quantity,
            donor: donationPost?.donor?.fullName || 'Anonymous Donor',
            donorCount: donationPost?.donor?.donationCount || 0,
            status: (claim.status || '').toUpperCase(),
            reportedUserId: donationPost?.donor?.id,
            date: claim.claimedAt ? new Date(claim.claimedAt) : new Date(),
            dateStr: claim.claimedAt
              ? new Date(claim.claimedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : 'Recently',
            source: 'claim',
            canMarkReceived: (claim.status || '').toUpperCase() === 'APPROVED'
          };
        })
      );

      const rawFulfillments = fulfillmentsRes.data.data || [];
      setFulfillments(
        rawFulfillments.map((f) => ({
          id: f.id,
          item: f.requestItem?.itemName || 'Unknown',
          quantity: f.quantity,
          donor: f.donor?.fullName || 'Anonymous Donor',
          donorCount: f.donor?.donationCount || 0,
          status: (f.status || '').toUpperCase(),
          reportedUserId: f.donor?.id,
          date: f.fulfilledAt ? new Date(f.fulfilledAt) : new Date(),
          dateStr: f.fulfilledAt
            ? new Date(f.fulfilledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : 'Date N/A',
          source: 'fulfillment',
          canMarkReceived: (f.status || '').toUpperCase() === 'PENDING'
        }))
      );
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleHistoryClick = (filter) => {
    setHistoryFilter(filter);
    setShowHistory(true);
    fetchHistoryData();
  };

  // Filtered Requests & Donations
  useEffect(() => {
    const sortedRequests = [...requests].sort((a, b) =>
      sortOrder === 'newest' ? new Date(b?.createdAt) - new Date(a?.createdAt) : new Date(a?.createdAt) - new Date(b?.createdAt)
    );
    setFilteredRequests(sortedRequests);
  }, [requests, sortOrder]);

  useEffect(() => {
    let result = [...donations];
    if (donationCategoryFilter) result = result.filter((d) => d?.category === donationCategoryFilter);
    result.sort((a, b) =>
      sortOrder === 'newest' ? new Date(b?.createdAt) - new Date(a?.createdAt) : new Date(a?.createdAt) - new Date(b?.createdAt)
    );
    setFilteredDonations(result);
  }, [donations, donationCategoryFilter, sortOrder]);

  // Totals for boxes
  const mappedRequests = requests.map(r => ({
    id: r.id,
    item: r.title || 'Request',
    quantity: r.items?.reduce((acc, i) => acc + (i.requiredQuantity || 0), 0) || 0,
    donor: 'N/A',
    status: (r.status || 'OPEN').toUpperCase(),
    date: r.createdAt ? new Date(r.createdAt) : new Date(),
    dateStr: r.createdAt
      ? new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : 'Recently',
    source: 'request',
    canMarkReceived: false
  }));

  const allRelevantItems = [...mappedRequests, ...claims, ...fulfillments];

  const total = allRelevantItems.length;
  const pending = allRelevantItems.filter((i) => ['PENDING', 'APPROVED', 'OPEN', 'PARTIALLY_FULFILLED'].includes(i.status)).length;
  const fulfilled = allRelevantItems.filter((i) => ['DELIVERED', 'COMPLETED', 'RECEIVED', 'FULFILLED'].includes(i.status)).length;

  // History Items filtered
  const historyItems = (() => {
    let result = [...allRelevantItems];
    if (historyFilter === 'pending') {
      result = result.filter((i) => ['PENDING', 'APPROVED', 'OPEN', 'PARTIALLY_FULFILLED'].includes(i.status));
    } else if (historyFilter === 'fulfilled') {
      result = result.filter((i) => ['DELIVERED', 'COMPLETED', 'RECEIVED', 'FULFILLED'].includes(i.status));
    }
    return result.sort((a, b) => b.date - a.date);
  })();

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'APPROVED':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'RECEIVED':
      case 'DELIVERED':
      case 'COMPLETED':
      case 'FULFILLED':
        return 'bg-teal-100 text-teal-700 border-teal-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
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

  const handleMarkReceived = async (item) => {
    try {
      setActionLoading(item.id);
      if (item.source === 'claim') {
        await api.put(`/donations/claims/${item.id}/status?status=COMPLETED`);
      } else {
        await api.put(`/requests/fulfillments/${item.id}/status?status=DELIVERED`);
      }
      fetchHistoryData();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to cancel this request? This cannot be undone.')) return;
    try {
      await api.delete(`/requests/${requestId}`);
      setRequests(prev => prev.filter(r => r.id !== requestId));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to cancel request.');
    }
  };

  const handleCloseRequest = async (requestId) => {
    if (!window.confirm('Mark this request as completed? It will be closed and no more donations will be accepted.')) return;
    try {
      await api.put(`/requests/${requestId}/close`);
      setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'COMPLETED' } : r));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to close request.');
    }
  };

  const getFilterBtnClass = (filter) => {
    if (historyFilter === filter) {
      if (filter === 'all') return 'bg-teal-600 text-white';
      if (filter === 'pending') return 'bg-teal-600 text-white';
      if (filter === 'fulfilled') return 'bg-green-600 text-white';
    }
    return 'bg-gray-100 text-gray-600 hover:bg-gray-200';
  };

  // ---------- RENDER ----------
  if (viewMode === 'options') {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <button
          onClick={() => (user ? navigate('/receiver') : navigate('/'))}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-medium"
        >
          <ArrowLeft size={20} /> {user ? 'Back to Dashboard' : 'Back to Home'}
        </button>

        {/* Welcome Box */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-800 text-white p-12 rounded-2xl mb-8 shadow-xl">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">Welcome, Receiver!</h1>
            <p className="text-xl opacity-90 mb-8">
              Browse available donations or post your needs. Track all your requests here.
            </p>
            <div className="flex gap-4 flex-wrap">
              {/* Total */}
              <div
                onClick={() => handleHistoryClick('all')}
                className="bg-white/20 backdrop-blur-sm p-4 rounded-lg text-center min-w-[120px] cursor-pointer hover:bg-white/30 transition-colors"
              >
                <span className="block text-3xl font-bold">{total}</span>
                <span className="text-sm opacity-90">
                  Total Requests
                </span>
              </div>

              {/* Pending */}
              <div
                onClick={() => handleHistoryClick('pending')}
                className="bg-white/20 backdrop-blur-sm p-4 rounded-lg text-center min-w-[120px] cursor-pointer hover:bg-white/30 transition-colors"
              >
                <span className="block text-3xl font-bold">{pending}</span>
                <span className="text-sm opacity-90">
                  Pending Requests
                </span>
              </div>

              {/* Fulfilled */}
              <div
                onClick={() => handleHistoryClick('fulfilled')}
                className="bg-white/20 backdrop-blur-sm p-4 rounded-lg text-center min-w-[120px] cursor-pointer hover:bg-white/30 transition-colors"
              >
                <span className="block text-3xl font-bold">{fulfilled}</span>
                <span className="text-sm opacity-90">
                  Fulfilled Requests
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* History */}
        {showHistory && (
          <div className="mb-8 bg-white rounded-2xl p-6 border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">
                {historyFilter === 'all'
                  ? 'All Requests & Claims'
                  : historyFilter === 'pending'
                    ? 'Pending (Awaiting Delivery)'
                    : 'Fulfilled'}
              </h2>
              <button onClick={() => setShowHistory(false)} className="text-gray-500 hover:text-gray-700 text-xl">
                ✕
              </button>
            </div>

            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setHistoryFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${getFilterBtnClass(
                  'all'
                )}`}
              >
                All ({total})
              </button>
              <button
                onClick={() => setHistoryFilter('pending')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${getFilterBtnClass(
                  'pending'
                )}`}
              >
                Pending ({pending})
              </button>
              <button
                onClick={() => setHistoryFilter('fulfilled')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${getFilterBtnClass(
                  'fulfilled'
                )}`}
              >
                Fulfilled ({fulfilled})
              </button>
            </div>

            {historyLoading ? (
              <div className="text-center py-6">Loading...</div>
            ) : historyItems.length === 0 ? (
              <div className="text-center py-6 text-gray-500">No records found</div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {historyItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-4 border rounded-lg hover:shadow-md"
                  >
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center ${['APPROVED', 'DELIVERED', 'COMPLETED', 'RECEIVED', 'FULFILLED'].includes(item.status)
                        ? 'bg-green-100 text-green-600'
                        : item.status === 'PENDING'
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-600'
                        }`}
                    >
                      {['COMPLETED', 'DELIVERED', 'RECEIVED', 'FULFILLED'].includes(item.status) ? (
                        <CheckCircle size={24} />
                      ) : (
                        <Package size={24} />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">
                        {item.item} ({item.quantity})
                      </p>
                      <div className="text-sm text-gray-500">
                        {item.source === 'request' ? (
                          'Posted by You'
                        ) : (
                          <div className="flex items-center gap-2">
                            <span>From {item.donor}</span>
                            {getUserTypeInfo(item.donorCount) && (
                              <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getUserTypeInfo(item.donorCount).bg} ${getUserTypeInfo(item.donorCount).color} ${getUserTypeInfo(item.donorCount).border}`}>
                                {getUserTypeInfo(item.donorCount).type}
                              </span>
                            )}
                          </div>
                        )}
                        <span className="text-xs text-gray-400 block mt-0.5">
                          {item.source === 'claim' ? '(Claimed donation)' : item.source === 'fulfillment' ? '(Fulfilled request)' : '(Your request)'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 text-sm rounded-full border ${getStatusColor(item.status)}`}>
                        {['COMPLETED', 'FULFILLED', 'RECEIVED', 'DELIVERED'].includes(item.status) ? 'COMPLETED & FULFILLED' : item.status}
                      </span>
                      {item.canMarkReceived && (
                        <button
                          onClick={() => handleMarkReceived(item)}
                          disabled={actionLoading === item.id}
                          className="px-3 py-1.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark disabled:opacity-50"
                        >
                          {actionLoading === item.id ? '...' : 'Mark Received'}
                        </button>
                      )}
                      {item.reportedUserId && (
                        <button
                          onClick={() => {
                            setReportingItem(item);
                            setIsReportModalOpen(true);
                          }}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                          title="Report Donor"
                        >
                          <ShieldAlert size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <ReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          reportedUserId={reportingItem?.reportedUserId}
          reporterId={user?.id}
          onSuccess={() => {
            // No specific action needed besides existing modal feedback
          }}
        />

        {/* Options */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div
            onClick={() => setViewMode('donations')}
            className="bg-white p-10 rounded-2xl shadow-sm border hover:border-teal-500 hover:shadow-xl transition-all cursor-pointer flex flex-col items-center text-center group"
          >
            <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Box size={48} className="text-teal-600" />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Browse Donations</h2>
            <p className="text-gray-600 text-lg">Claim items offered by donors.</p>
          </div>

          <div
            onClick={() => setViewMode('requests')}
            className="bg-white p-10 rounded-2xl shadow-sm border hover:border-secondary hover:shadow-xl transition-all cursor-pointer flex flex-col items-center text-center group"
          >
            <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Briefcase size={48} className="text-secondary" />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Manage Requests</h2>
            <p className="text-gray-600 text-lg">Post and track your needs.</p>
          </div>
        </div>
      </div>
    );
  }

  // Donations & Requests Views
  if (viewMode === 'donations') {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <button
          onClick={() => setViewMode('options')}
          className="flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-900 font-medium"
        >
          <ArrowLeft size={20} /> Back
        </button>
        <h1 className="text-3xl font-bold mb-6">Available Donations</h1>
        <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-6 rounded-xl shadow-md border">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-600 mb-1">Category</label>
            <select
              value={donationCategoryFilter}
              onChange={(e) => setDonationCategoryFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-gray-50"
            >
              <option value="">All Categories</option>
              <option value="Blankets">Blankets</option>
              <option value="Food">Food</option>
              <option value="Shirts">Shirts</option>
              <option value="Pants">Pants</option>
              <option value="Coats">Coats</option>
              <option value="Others">Others</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-600 mb-1">Sort By</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-gray-50"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {loading ? <p>Loading...</p> : filteredDonations.map((donation) => <DonationPostCard key={donation.id} post={donation} onClaimSuccess={fetchDonations} />)}
        </div>
      </div>
    );
  }

  if (viewMode === 'requests') {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <button
          onClick={() => setViewMode('options')}
          className="flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-900 font-medium"
        >
          <ArrowLeft size={20} /> Back
        </button>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Your Requests</h1>
          <Link
            to="/receiver/create"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Plus size={20} /> Post Request
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {loading ? (
            <p>Loading...</p>
          ) : filteredRequests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              onDelete={handleDeleteRequest}
              onClose={handleCloseRequest}
            />
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export default ReceiverDashboard;