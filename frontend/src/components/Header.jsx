import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, LogOut, User, Image as ImageIcon, X, Upload } from 'lucide-react';
import api from '../api';

const Header = () => {
    const { user, logout, updateUser } = useAuth();
    const navigate = useNavigate();
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const currentGalleryCount = user?.galleryImages?.length || 0;
        if (currentGalleryCount + images.length + files.length > 5) {
            alert('You can only have up to 5 images in your gallery.');
            return;
        }
        setImages([...images, ...files]);
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleGalleryUpload = async () => {
        if (images.length === 0) return;
        setUploading(true);
        try {
            const formData = new FormData();
            images.forEach(img => formData.append('files', img));
            const res = await api.post(`/users/${user.id}/gallery`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            console.log('Gallery upload response:', res);
            alert('Gallery updated successfully!');
            setImages([]);
            setIsGalleryOpen(false);
            if (updateUser && res.data && res.data.data) {
                console.log('Sending to updateUser:', res.data.data);
                updateUser({ galleryImages: res.data.data });
            } else {
                console.error("Missing updateUser or res.data in context", { updateUser: !!updateUser, data: res.data });
            }
        } catch (err) {
            console.error(err);
            alert('Failed to update gallery');
        } finally {
            setUploading(false);
        }
    };

    // Logo link - goes to dashboard when logged in, home when not logged in
    const getLogoDestination = () => {
        if (user) {
            return user.role === 'RECEIVER' ? '/receiver' : '/donor';
        }
        return '/';
    };

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        const baseUrl = api.defaults.baseURL.replace('/api', '');
        return `${baseUrl}${path}`;
    };

    return (
        <>
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to={getLogoDestination()} className="flex items-center gap-2 text-2xl font-bold text-primary">
                    <Heart className="fill-current" />
                    <span>DonateHub</span>
                </Link>

                <nav className="flex items-center gap-6">
                    <Link to="/about-us" className="text-sm font-medium text-gray-600 hover:text-primary hidden md:block">About Us</Link>
                    <Link to="/contact" className="text-sm font-medium text-gray-600 hover:text-primary hidden md:block">Contact Us</Link>
                    {user ? (
                        <>

                            {user.role === 'RECEIVER' && (
                                <>
                                    <button onClick={() => setIsGalleryOpen(true)} className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary">
                                        <ImageIcon size={18} /> My Gallery
                                    </button>
                                    <Link to="/receiver-profile" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary">
                                        {user.profileImageUrl ? (
                                            <img src={getImageUrl(user.profileImageUrl)} alt="Profile" className="w-6 h-6 rounded-full object-cover border shadow-sm border-gray-200" />
                                        ) : (
                                            <User size={18} />
                                        )}
                                        {user.fullName || 'Profile'}
                                    </Link>
                                    <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700">
                                        <LogOut size={18} /> Logout
                                    </button>
                                </>
                            )}
                            {user.role === 'DONOR' && (
                                <>
                                    <Link to="/donor-profile" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary">
                                        {user.profileImageUrl ? (
                                            <img src={getImageUrl(user.profileImageUrl)} alt="Profile" className="w-6 h-6 rounded-full object-cover border shadow-sm border-gray-200" />
                                        ) : (
                                            <User size={18} />
                                        )}
                                        {user.fullName || 'Profile'}
                                    </Link>
                                    <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700">
                                        <LogOut size={18} /> Logout
                                    </button>
                                </>
                            )}

                        </>
                    ) : (
                        <div className="flex gap-4">
                            <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary">Login</Link>
                            <Link to="/signup" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-opacity-90">Sign Up</Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
            
            {/* Gallery Modal */}
            {isGalleryOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <ImageIcon className="text-primary" /> My Gallery
                            </h2>
                            <button onClick={() => setIsGalleryOpen(false)} className="text-gray-500 hover:text-gray-900">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto">
                            {/* Existing Gallery Images */}
                            <div className="mb-6">
                                <h4 className="text-sm border-b pb-2 font-bold text-gray-700 mb-4">Current Gallery</h4>
                                {(!user?.galleryImages || user.galleryImages.length === 0) ? (
                                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                                        <p className="text-gray-500 text-sm font-medium">No images are there to show.</p>
                                        <p className="text-gray-400 text-xs mt-1">Please upload images below.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                        {user.galleryImages.map((imgUrl, index) => (
                                            <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 shadow-sm transition-transform hover:scale-105 group">
                                                <img src={getImageUrl(imgUrl)} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* New Photos Queue */}
                            {images.length > 0 && (
                                <div className="mb-6 border-t pt-4">
                                    <h4 className="text-sm font-bold text-primary mb-3">Selected for Upload</h4>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                        {images.map((img, index) => (
                                            <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                                <img src={URL.createObjectURL(img)} alt={`New ${index + 1}`} className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute top-1 right-1 bg-black/60 hover:bg-black text-white rounded-full p-1 transition-colors backdrop-blur-sm shadow"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Upload Option */}
                            {((user?.galleryImages?.length || 0) + images.length) < 5 ? (
                                <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center bg-gray-50 transition-all hover:bg-white hover:border-primary/50">
                                    <Upload className="mx-auto h-8 w-8 text-primary mb-2" />
                                    <p className="text-sm font-medium text-gray-700 mb-1">Your uploads can change donor impression</p>
                                    <p className="text-xs text-gray-500 mb-4">You can add {5 - ((user?.galleryImages?.length || 0) + images.length)} more photo(s).</p>
                                    
                                    <input
                                        type="file"
                                        id="headerGalleryUpload"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                        disabled={uploading}
                                    />
                                    <label
                                        htmlFor="headerGalleryUpload"
                                        className="cursor-pointer inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 transition-colors"
                                    >
                                        Select Photos
                                    </label>
                                </div>
                            ) : (
                                <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
                                    <p className="text-amber-700 text-sm font-medium">You have reached the maximum of 5 images.</p>
                                </div>
                            )}
                        </div>
                        <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
                            <button onClick={() => setIsGalleryOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-md font-medium text-sm">
                                Cancel
                            </button>
                            <button
                                onClick={handleGalleryUpload}
                                disabled={uploading || images.length === 0}
                                className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90 disabled:opacity-50"
                            >
                                {uploading ? 'Uploading...' : 'Save Gallery'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;

