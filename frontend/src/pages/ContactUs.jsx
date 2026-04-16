import React from 'react';
import { ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ContactUs = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const handleBack = () => {
        if (user) {
            navigate(user.role === 'DONOR' ? '/donor' : '/receiver');
        } else {
            navigate('/');
        }
    };
    
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <button onClick={handleBack} className="flex items-center text-primary hover:text-primary-dark font-medium transition-colors">
                        <ArrowLeft size={20} className="mr-2" />
                        {user ? 'Back to Dashboard' : 'Back to Home'}
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Hero Section */}
                    <div className="bg-gradient-to-r from-primary to-primary-dark p-8 md:p-12 text-center text-white">
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h1>
                        <p className="text-xl opacity-90">
                            We'd love to hear from you. Get in touch with us.
                        </p>
                    </div>

                    <div className="p-8 md:p-12">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Address */}
                            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 text-center">
                                <div className="flex justify-center mb-4">
                                    <div className="p-3 bg-primary rounded-full text-white">
                                        <MapPin size={24} />
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Address</h3>
                                <p className="text-gray-600">
                                    Bapatla Engineering College<br />
                                    Bapatla
                                </p>
                            </div>

                            {/* Phone */}
                            <div className="bg-green-50 p-6 rounded-xl border border-green-100 text-center">
                                <div className="flex justify-center mb-4">
                                    <div className="p-3 bg-primary rounded-full text-white">
                                        <Phone size={24} />
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Phone</h3>
                                <p className="text-gray-600">
                                    +91 9876543210
                                </p>
                            </div>

                            {/* Email */}
                            <div className="bg-purple-50 p-6 rounded-xl border border-purple-100 text-center">
                                <div className="flex justify-center mb-4">
                                    <div className="p-3 bg-primary rounded-full text-white">
                                        <Mail size={24} />
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Email</h3>
                                <p className="text-gray-600">
                                    support@donatehub.com
                                </p>
                            </div>
                        </div>

                        <div className="mt-12 bg-gray-50 p-8 rounded-xl">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Get in Touch</h2>
                            <p className="text-gray-600 text-center mb-6">
                                Have questions about donations, requests, or need support? Feel free to reach out to us using the information above. Our team is here to help Monday through Friday, 9 AM to 6 PM.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
