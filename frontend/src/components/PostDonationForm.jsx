import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

const PostDonationForm = ({ onBack, onSuccess }) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [location, setLocation] = useState('');
    const [items, setItems] = useState([{ itemName: '', quantity: 1 }]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userAddress, setUserAddress] = useState(null);

    const categories = ['Blankets', 'Food', 'Clothes', 'Medicines', 'Others'];

    // Fetch user address details on mount
    useEffect(() => {
        const fetchUserAddress = async () => {
            if (user && user.id) {
                try {
                    const response = await api.get(`/users/${user.id}`);
                    const userData = response.data.data;
                    setUserAddress(userData);

                    // Pre-fill location with user's address
                    const fullAddress = formatAddress(userData);
                    if (fullAddress) {
                        setLocation(fullAddress);
                    }
                } catch (err) {
                    console.error('Failed to fetch user address:', err);
                }
            }
        };
        fetchUserAddress();
    }, [user]);

    // Format address from user data
    const formatAddress = (userData) => {
        // First try to use simple address field
        if (userData.address && userData.address.trim()) {
            return userData.address;
        }

        // If simple address is empty, try detailed address fields
        const parts = [];
        if (userData.houseNumber) parts.push(userData.houseNumber);
        if (userData.streetLandmark) parts.push(userData.streetLandmark);
        if (userData.areaLocality) parts.push(userData.areaLocality);
        if (userData.city) parts.push(userData.city);
        if (userData.district) parts.push(userData.district);
        if (userData.state) parts.push(userData.state);
        if (userData.pincode) parts.push(userData.pincode);
        if (userData.country) parts.push(userData.country);
        return parts.join(', ');
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { itemName: '', quantity: 1 }]);
    };

    const removeItem = (index) => {
        if (items.length > 1) {
            const newItems = items.filter((_, i) => i !== index);
            setItems(newItems);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user || !user.id) {
            setError("You must be logged in to post a donation.");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const payload = {
                donorId: user.id,
                title,
                category,
                location,
                items: items.map(item => ({
                    itemName: item.itemName,
                    quantity: parseInt(item.quantity) || 1
                }))
            };

            await api.post('/donations', payload);
            if (onSuccess) onSuccess();
            onBack();

        } catch (err) {
            console.error("Failed to post donation", err);
            setError("Failed to post donation. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md border">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-medium"
            >
                <ArrowLeft size={20} />
                Back to Options
            </button>

            <h2 className="text-3xl font-bold mb-6 text-gray-800">Post a Donation</h2>

            {/* Display User Address Info */}
            {userAddress && (
                <div className="mb-6 p-4 bg-teal-50 rounded-lg border border-teal-200">
                    <h3 className="text-sm font-semibold text-teal-800 mb-2">Your Registered Address:</h3>
                    <p className="text-teal-700">{formatAddress(userAddress)}</p>
                    <p className="text-xs text-teal-600 mt-1">This address will be used for your donation pickup</p>
                </div>
            )}

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="e.g., 5 Winter Jackets in Good Condition"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                            required
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                        >
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location / Pickup Area</label>
                        <input
                            type="text"
                            required
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Enter the full address or use your registered address"
                        />
                    </div>
                </div>

                <div className="mt-8">
                    <div className="flex justify-between items-center mb-4">
                        <label className="block text-sm font-medium text-gray-700">Item to Donate</label>
                    </div>

                    {items.map((item, index) => (
                        <div key={index} className="flex gap-4 items-center mb-4 bg-gray-50 p-4 rounded-lg border">
                            <div className="flex-1">
                                <label className="block text-xs text-gray-500 mb-1">Item Description</label>
                                <input
                                    type="text"
                                    required
                                    value={item.itemName}
                                    onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                                    placeholder="e.g., Large Jacket"
                                />
                            </div>
                            <div className="w-24">
                                <label className="block text-xs text-gray-500 mb-1">Quantity</label>
                                <input
                                    type="number"
                                    min="1"
                                    required
                                    value={item.quantity}
                                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    type="submit"
                    disabled={loading || !category}
                    className="w-full bg-primary text-white py-3 rounded-md font-bold text-lg hover:bg-indigo-700 transition disabled:opacity-70 disabled:cursor-not-allowed mt-8"
                >
                    {loading ? 'Posting...' : 'Post Donation'}
                </button>
            </form>
        </div>
    );
};

export default PostDonationForm;
