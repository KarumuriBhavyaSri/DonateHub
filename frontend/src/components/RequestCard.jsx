import React, { useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { MapPin, Trash2, XCircle } from 'lucide-react';
import UserDetailsModal from './UserDetailsModal';

const RequestCard = ({ request, onUpdate, onDelete, onClose }) => {
    const { user } = useAuth();
    const [fulfillmentData, setFulfillmentData] = useState({});
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);

    const getStatusColor = (status) => {
        switch (status) {
            case 'COMPLETED': return 'text-green-600 bg-green-50 border-green-200';
            case 'PARTIALLY_FULFILLED': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            default: return 'text-blue-600 bg-blue-50 border-blue-200';
        }
    };

    const handleFulfill = async (itemId, required, fulfilled) => {
        const amount = parseInt(fulfillmentData[itemId] || 0);
        if (amount <= 0) return;
        if (amount + fulfilled > required) {
            alert("Cannot fulfill more than required!");
            return;
        }

        try {
            await api.post('/requests/fulfill', {
                donorId: user.id,
                requestItemId: itemId,
                quantity: amount
            });
            alert('Donation recorded! Thank you.');
            setFulfillmentData({ ...fulfillmentData, [itemId]: '' });
            if (onUpdate) onUpdate();
        } catch (err) {
            alert('Failed to fulfill request.');
        }
    };

    const isOpen = request?.status === 'OPEN';
    const isPartial = request?.status === 'PARTIALLY_FULFILLED';
    const isCompleted = request?.status === 'COMPLETED';

    return (
        <div className={`bg-white rounded-lg shadow-sm border p-6 mb-4 transition hover:shadow-md ${isCompleted ? 'opacity-75' : ''}`}>
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{request?.title || 'Untitled Request'}</h3>
                    <div className="flex items-center text-gray-500 mt-1">
                        <MapPin size={16} className="mr-1" />
                        <span className="text-sm">{request?.location || 'No location'}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 bg-gray-50 inline-block px-3 py-1 rounded-full border">
                        Posted by{' '}
                        {request?.receiver ? (
                            <button
                                onClick={() => setIsUserModalOpen(true)}
                                className="text-primary hover:text-primary-dark hover:underline font-bold focus:outline-none transition-colors"
                            >
                                {request.receiver.organizationName || request.receiver.fullName || request.receiver.username || 'Unknown Organization'}
                            </button>
                        ) : (
                            <span className="font-semibold text-gray-700">Unknown</span>
                        )}
                        {' '}on {request?.createdAt ? new Date(request.createdAt).toLocaleDateString() : 'Unknown Date'}
                    </p>
                </div>

                <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(request?.status)}`}>
                        {request?.status?.replace('_', ' ') || 'OPEN'}
                    </span>

                    {/* Cancel button — only for OPEN requests, only shown to the receiver (when onDelete is passed) */}
                    {onDelete && isOpen && (
                        <button
                            onClick={() => onDelete(request.id)}
                            title="Cancel this request"
                            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-full hover:bg-red-100 transition-colors"
                        >
                            <Trash2 size={12} />
                            Cancel
                        </button>
                    )}

                    {/* Close Need button — only for PARTIALLY_FULFILLED, only shown to receiver (when onClose is passed) */}
                    {onClose && isPartial && (
                        <button
                            onClick={() => onClose(request.id)}
                            title="Close this need (mark as completed)"
                            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-200 rounded-full hover:bg-orange-100 transition-colors"
                        >
                            <XCircle size={12} />
                            Close Need
                        </button>
                    )}
                </div>
            </div>

            <div className="space-y-3">
                {(request?.items || []).map(item => (
                    <div key={item.id} className="bg-gray-50 p-3 rounded-md">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-gray-700">{item.itemName}</span>
                            <span className="text-sm text-gray-500">
                                {item.fulfilledQuantity || 0} / {item.requiredQuantity || 0} fulfilled
                            </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                            <div
                                className="bg-secondary h-2 rounded-full transition-all duration-500"
                                style={{ width: `${item.requiredQuantity > 0 ? (item.fulfilledQuantity / item.requiredQuantity) * 100 : 0}%` }}
                            ></div>
                        </div>

                        {/* Donor Actions */}
                        {user.role === 'DONOR' && item.fulfilledQuantity < item.requiredQuantity && (
                            <div className="flex gap-2 mt-2">
                                <input
                                    type="number"
                                    placeholder="Qty"
                                    min="1"
                                    max={item.requiredQuantity - item.fulfilledQuantity}
                                    value={fulfillmentData[item.id] || ''}
                                    onChange={(e) => setFulfillmentData({ ...fulfillmentData, [item.id]: e.target.value })}
                                    className="w-20 px-2 py-1 text-sm border rounded focus:outline-none focus:border-primary"
                                />
                                <button
                                    onClick={() => handleFulfill(item.id, item.requiredQuantity, item.fulfilledQuantity)}
                                    className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-opacity-90 transition"
                                    disabled={!fulfillmentData[item.id]}
                                >
                                    Donate
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Receiver Details Modal */}
            <UserDetailsModal
                isOpen={isUserModalOpen}
                onClose={() => setIsUserModalOpen(false)}
                user={request?.receiver}
            />
        </div>
    );
};

export default RequestCard;
