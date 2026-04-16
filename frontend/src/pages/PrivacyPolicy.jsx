import React from 'react';
import { ArrowLeft, Shield, Lock, UserCheck, Phone, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivacyPolicy = () => {
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
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">Privacy Policy</h1>
                        <p className="text-xl opacity-90">
                            Your privacy matters to us. Learn how we protect your information.
                        </p>
                    </div>

                    <div className="p-8 md:p-12 space-y-8">
                        <section>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                At Donate Hub, we respect the privacy of everyone who interacts with our platform, including both Donors and Receivers. This Privacy Policy explains how we collect, use, and protect personal information to ensure transparency and trust.
                            </p>
                        </section>

                        <section className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                                <UserCheck className="mr-3 text-primary" /> Information We Collect
                            </h2>
                            <div className="space-y-4 text-gray-700">
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">From Donors:</h3>
                                    <p>We may collect details such as name, contact information, payment details, and donation history. This helps us process contributions securely, provide receipts and tax certificates, and share updates about the impact of donations.</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">From Receivers:</h3>
                                    <p>We may collect name, contact information, and eligibility documents to deliver aid, verify requirements, and communicate about programs.</p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                                <Shield className="mr-3 text-green-500" /> Use of Information
                            </h2>
                            <ul className="space-y-3 text-gray-600">
                                <li className="flex items-start">
                                    <span className="font-semibold mr-2">Donor Information:</span>
                                    <span>We use donor information to process donations, issue receipts, and keep donors informed about our work.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="font-semibold mr-2">Receiver Information:</span>
                                    <span>Receiver information is used to deliver support, verify eligibility, and communicate about services.</span>
                                </li>
                                <li>All information is handled responsibly and only for the purposes stated.</li>
                            </ul>
                        </section>

                        <section className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Information Sharing</h2>
                            <p className="text-gray-700 mb-4">
                                Donate Hub does not sell or misuse personal information. Data may be shared only with:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-gray-700">
                                <li>Trusted third-party service providers such as payment processors</li>
                                <li>When required by law</li>
                                <li>During organizational restructuring</li>
                            </ul>
                            <p className="mt-4 text-gray-700">We ensure that any third parties handling data maintain strict confidentiality.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                                <Lock className="mr-3 text-red-500" /> Security
                            </h2>
                            <ul className="space-y-3 text-gray-600">
                                <li>All online transactions are processed through secure servers with SSL encryption.</li>
                                <li>Only authorized staff have access to sensitive data.</li>
                                <li>While we take reasonable steps to protect information, absolute security against external breaches cannot be guaranteed.</li>
                            </ul>
                        </section>

                        <section className="bg-yellow-50 p-6 rounded-xl border border-yellow-100">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                                <Phone className="mr-3 text-yellow-600" /> Communication Consent
                            </h2>
                            <p className="text-gray-700">
                                By providing contact details, Donors and Receivers consent to receive updates, SMS, emails, or calls from Donate Hub, even if their number is registered under DND/NCPR lists. These communications are intended to keep stakeholders informed and engaged.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Rights</h2>
                            <ul className="space-y-2 text-gray-600">
                                <li>Request access to their personal information</li>
                                <li>Ask for corrections</li>
                                <li>Withdraw consent for communications</li>
                                <li>Request deletion of data, subject to legal and operational requirements</li>
                            </ul>
                        </section>

                        <section className="bg-gray-100 p-6 rounded-xl">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Policy Updates</h2>
                            <p className="text-gray-600">
                                This Privacy Policy may be updated from time to time. Continued use of Donate Hub means acceptance of the revised terms.
                            </p>
                        </section>

                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <p className="text-gray-500 text-center">
                                If you have any questions about this Privacy Policy, please contact us at{' '}
                                <a href="mailto:support@donatehub.com" className="text-primary hover:underline flex items-center justify-center gap-2">
                                    <Mail size={16} /> support@donatehub.com
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
