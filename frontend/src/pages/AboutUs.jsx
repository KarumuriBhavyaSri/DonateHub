import React from 'react';
import { ArrowLeft, Heart, Users, Target, Globe } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AboutUs = () => {
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
                <div className="mb-8 pl-4">
                    <button onClick={handleBack} className="flex items-center text-primary hover:text-primary-dark font-medium transition-colors">
                        <ArrowLeft size={20} className="mr-2" />
                        {user ? 'Back to Dashboard' : 'Back to Home'}
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Hero Section */}
                    <div className="bg-gradient-to-r from-primary to-primary-dark p-8 md:p-12 text-center text-white">
                        <h1 className="text-3xl md:text-5xl font-bold mb-4">About DonateHub</h1>
                        <p className="text-xl opacity-90 max-w-2xl mx-auto">
                            Building bridges of kindness in our communities.
                        </p>
                    </div>

                    <div className="p-8 md:p-12 space-y-12">
                        {/* Vision Section */}
                        <section>
                            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                                <Target className="mr-3 text-red-500" /> Our Vision
                            </h2>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                We envision a world where waste is minimized and compassion is maximized.
                                DonateHub aims to be the catalyst that transforms surplus into sustenance,
                                bringing communities together through the simple act of giving. We believe
                                that everyone has something to give, and someone, somewhere, is waiting for exactly that.
                            </p>
                        </section>

                        {/* Who We Are */}
                        <section className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                            <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center">
                                <Users className="mr-3" /> Who We Are
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                                We are a team of passionate individuals dedicated to social impact through technology.
                                Started as a project to address small scale waste and resource inequality, DonateHub
                                has grown into a platform that empowers individuals to take direct action in their
                                neighborhoods. We are developers, designers, and community builders united by a common goal.
                            </p>
                        </section>

                        {/* Our Values */}
                        <section>
                            <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
                                <Heart className="mr-3 text-pink-500" /> Core Values
                            </h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="text-center p-4">
                                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Globe size={24} />
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">Community First</h3>
                                    <p className="text-gray-600 text-sm">Empowering local connections for global impact.</p>
                                </div>
                                <div className="text-center p-4">
                                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Heart size={24} />
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">Empathy</h3>
                                    <p className="text-gray-600 text-sm">Understanding and respecting the dignity of every individual.</p>
                                </div>
                                <div className="text-center p-4">
                                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Target size={24} />
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">Transparency</h3>
                                    <p className="text-gray-600 text-sm">Open, honest, and direct communication in all we do.</p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
