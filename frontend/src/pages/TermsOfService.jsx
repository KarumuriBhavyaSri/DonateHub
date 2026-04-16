import React from 'react';
import { ArrowLeft, Shield, AlertTriangle, CheckCircle, FileText, Copyright } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TermsOfService = () => {
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
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">Terms & Conditions</h1>
                        <p className="text-xl opacity-90">
                            Please read our terms and conditions carefully before using our website.
                        </p>
                    </div>

                    <div className="p-8 md:p-12 space-y-8">
                        <section>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                This website is solely owned and operated by Donate Hub. Donate Hub provides this website, including all information, software and services available on this website to the user, provided the user/s accepts all the terms, conditions, policies and notices described herein (hereinafter "General Terms and Conditions"). Please carefully read the General Terms and Conditions and our privacy policy before using our website. By using our website the user consents to all the said terms, conditions, policies and notices. These Terms and Conditions are applicable to all site visitors, registered users, and all other users of Donate Hub website.
                            </p>
                        </section>

                        <section className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                                <AlertTriangle className="mr-3 text-yellow-500" /> Use of Website by User
                            </h2>
                            <p className="text-gray-700">
                                As a condition to the use of this website, the user also warrants to Donate Hub that the user will not use this website for any purpose that is unlawful or prohibited by law and/or these General Terms and Conditions.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                                <Shield className="mr-3 text-red-500" /> Disclaimers
                            </h2>
                            <p className="text-gray-600 mb-4">
                                Use of this website is at the user's own risk. The website is provided on an "AS AVAILABLE" and "AS IS" basis. Donate Hub reserves the right to restrict or terminate any user/s access to the website or any feature or any part thereof at any time. Donate Hub expressly disclaims all warranties of any kind, whether express or implied, including but not limited to:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                                <li>The implied warranties of merchantability and fitness for a particular purpose</li>
                                <li>Any warranties that materials on the website are non-infringing</li>
                                <li>That access to the website will be uninterrupted or free from error</li>
                                <li>That the website or servers that make the website will be free from viruses</li>
                                <li>That the information on the website will be complete, accurate and timely</li>
                            </ul>
                            <p className="text-gray-600 mt-4">
                                No advice or information, whether oral or written, obtained by the user from Donate Hub or from the website shall create any warranty of any kind. Donate Hub does not make any warranties or representations regarding any results obtained by the user in relying on the materials on this website.
                            </p>
                        </section>

                        <section className="bg-red-50 p-6 rounded-xl border border-red-100">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Limitation of Liability</h2>
                            <p className="text-gray-700 mb-4">
                                To the fullest extent permitted under applicable law, the user understands and agrees that no member of Donate Hub shall be liable for any direct, indirect, incidental, special, exemplary, consequential, punitive or any other damages relating to or resulting from:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                                <li>The usage of this website or any other website</li>
                                <li>Publishing of any information, comment or any other information on the website</li>
                                <li>Use by any third party of the user's username or password</li>
                            </ul>
                            <p className="text-gray-700 mt-4">
                                This limitation applies regardless of whether the damages are claimed under the terms of a contract, as of negligence, or otherwise arise out of or in connection with the use, inability to use or performance of the information, services, products or materials available from this website.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                                <CheckCircle className="mr-3 text-green-500" /> Indemnification
                            </h2>
                            <p className="text-gray-600">
                                User will on demand indemnify and hold harmless Donate Hub, its affiliates and their respective current, future or former officers, directors, employees, partners, agents, contractors, licensors, licensees, suppliers and their successors or assigns, from and against any and all fines, penalties, liabilities, losses and other damages of any kind whatsoever (including attorneys' and experts' fees) incurred by any of them, and, if directed by Donate Hub, shall defend Donate Hub against all claims arising from fraud, intentional misconduct, criminal acts or gross negligence by the user, and all claims otherwise arising due to a failure by the user to comply with any of these General Terms and Conditions.
                            </p>
                        </section>

                        <section className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Representations, Covenants and Warranties of User</h2>
                            <p className="text-gray-700 mb-4">User represents, covenants and warrants to Donate Hub that:</p>
                            <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                                <li>These General Terms and Conditions have been executed and delivered by User and constitute a valid and binding agreement</li>
                                <li>User will not access or use the website except as expressly permitted by these General Terms and Conditions</li>
                                <li>User will access and use the website in full compliance with applicable Law</li>
                                <li>User is at least eighteen (18) years old, or of an age sufficient to execute a legally enforceable agreement</li>
                                <li>All of the information, data and other materials provided by User are accurate and truthful</li>
                                <li>User is the rightful owner of the account opened in his or her name</li>
                                <li>User is not barred or otherwise legally prohibited from accessing or using the Donate Hub website under the laws of India</li>
                            </ol>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                                <Copyright className="mr-3 text-blue-500" /> Intellectual Property Rights Including Trademarks and Copyright
                            </h2>
                            <p className="text-gray-600 mb-4">
                                Donate Hub and/or its affiliates, suppliers or licensors retain full and complete title to the materials and to any and all of the associated intellectual property rights. Any other use of the materials on the website, including but not limited to the modification, distribution, transmission, performance, broadcast, reproduction, publication, licensing, reverse engineering, transfer or sale of, or the creation of derivative works from, any materials, information, software, products or services obtained from the website, without the prior written permission of Donate Hub, is expressly prohibited.
                            </p>
                            <p className="text-gray-600">
                                Donate Hub and other marks used on this website are trademarks or registered trademarks and intellectual property of Donate Hub and/or its affiliates and are protected by intellectual property laws. Other trademarks appear on the website with permission from their respective owners. Except for material in the public domain under Indian copyright law, all material contained on the website is protected by applicable Indian and foreign copyright laws. The unauthorized use by the user of trademarks, copyright and/or any intellectual properties appearing on the website shall constitute infringement, which could subject the user to substantial civil and criminal penalties.
                            </p>
                        </section>

                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <p className="text-gray-500 text-center">
                                If you have any questions about these Terms and Conditions, please contact us at{' '}
                                <a href="mailto:support@donatehub.com" className="text-primary hover:underline">
                                    support@donatehub.com
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
