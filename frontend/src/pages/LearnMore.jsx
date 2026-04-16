import React from 'react';
import { ArrowLeft, User, Heart, CheckCircle, Gift, Truck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LearnMore = () => {
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
                    <div className="bg-primary p-8 md:p-12 text-center">
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Understanding DonateHub</h1>
                        <p className="text-xl text-white/90 max-w-2xl mx-auto">
                            Connecting generous hearts directly with those in need. Simple, transparent, and impactful.
                        </p>
                    </div>

                    <div className="p-8 md:p-12 space-y-16">
                        <section>
                            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                                <Heart className="mr-3 text-red-500" /> Our Mission & Idea
                            </h2>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                DonateHub was built on a simple yet powerful idea: "remove the barriers between donors and receivers".
                                Traditional donation methods often involve middlemen, delays, and lack of transparency.
                                We envision a world where anyone with surplus resources can directly help someone in need within their community.
                                Whether it's food, clothing, educational supplies, or furniture, your unused items can change a life today.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
                                <CheckCircle className="mr-3 text-green-500" /> How It Works
                            </h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                                    <h3 className="text-xl font-bold text-blue-800 mb-3 flex items-center">
                                        <User className="mr-2" /> For Receivers
                                    </h3>
                                    <ul className="space-y-3 text-gray-700">
                                        <li className="flex items-start"><span className="font-bold mr-2">1.</span> Register and verify your account.</li>
                                        <li className="flex items-start"><span className="font-bold mr-2">2.</span> Post a request for specific items you need.</li>
                                        <li className="flex items-start"><span className="font-bold mr-2">3.</span> Wait for a donor to accept your request.</li>
                                        <li className="flex items-start"><span className="font-bold mr-2">4.</span> Coordinate details and receive the donation.</li>
                                    </ul>
                                </div>

                                <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                                    <h3 className="text-xl font-bold text-purple-800 mb-3 flex items-center">
                                        <Gift className="mr-2" /> For Donors
                                    </h3>
                                    <ul className="space-y-3 text-gray-700">
                                        <li className="flex items-start"><span className="font-bold mr-2">1.</span> Browse open requests in your area.</li>
                                        <li className="flex items-start"><span className="font-bold mr-2">2.</span> Choose a request you can fulfill.</li>
                                        <li className="flex items-start"><span className="font-bold mr-2">3.</span> Connect with the receiver.</li>
                                        <li className="flex items-start"><span className="font-bold mr-2">4.</span> Complete the donation and feel great!</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
                                <Truck className="mr-3 text-orange-500" /> The Donation Journey
                            </h2>
                            <div className="relative">
                                <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 transform -translate-y-1/2"></div>
                                <div className="grid md:grid-cols-4 gap-6">
                                    <div className="bg-white p-6 rounded-xl border-2 border-dashed border-gray-300 shadow-sm text-center relative">
                                        <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
                                        <h4 className="font-bold text-lg mb-2">Request Posted</h4>
                                        <p className="text-sm text-gray-500">Receiver details their need and location.</p>
                                    </div>

                                    <div className="bg-white p-6 rounded-xl border-2 border-primary border-opacity-50 shadow-sm text-center relative">
                                        <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
                                        <h4 className="font-bold text-lg mb-2">Donor Accepts</h4>
                                        <p className="text-sm text-gray-500">A donor commits to fulfilling the request.</p>
                                    </div>

                                    <div className="bg-white p-6 rounded-xl border-2 border-primary border-opacity-50 shadow-sm text-center relative">
                                        <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
                                        <h4 className="font-bold text-lg mb-2">Exchange</h4>
                                        <p className="text-sm text-gray-500">Items are handed over physically or shipped.</p>
                                    </div>

                                    <div className="bg-white p-6 rounded-xl border-2 border-green-500 border-opacity-50 shadow-sm text-center relative">
                                        <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">4</div>
                                        <h4 className="font-bold text-lg mb-2">Completed</h4>
                                        <p className="text-sm text-gray-500">Delivered Succesfully. Request closed.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div className="text-center mt-8">
                            <p className="italic text-gray-500">"We make a living by what we get, but we make a life by what we give."</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LearnMore;
