import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white pt-12 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand Section */}
                    <div>
                        <div className="flex items-center gap-2 text-2xl font-bold text-primary mb-4">
                            <Heart className="fill-current" />
                            <span>DonateHub</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Connecting generous hearts with those in need. Join our community to make a difference today.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link to="/" className="text-gray-400 hover:text-primary transition-colors">Home</Link></li>
                            <li><Link to="/about" className="text-gray-400 hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link to="/learn-more" className="text-gray-400 hover:text-primary transition-colors">Learn More</Link></li>
                            <li><Link to="/donor" className="text-gray-400 hover:text-primary transition-colors">Browse Requests</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-white">Legal</h3>
                        <ul className="space-y-2">
                            <li><Link to="/privacy" className="text-gray-400 hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="text-gray-400 hover:text-primary transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-white">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-gray-400">
                                <MapPin size={20} className="mt-1 flex-shrink-0" />
                                <span>Bapatla Engineering College,Bapatla</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400">
                                <Phone size={20} />
                                <span>+91 9876543210</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400">
                                <Mail size={20} />
                                <span>support@donatehub.com</span>
                            </li>
                        </ul>
                    </div>
                </div>
                {/*}
                <hr className="border-gray-800 my-8" />

                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} DonateHub. All rights reserved.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="p-2 bg-gray-800 rounded-full text-gray-400 hover:text-white hover:bg-primary transition-all">
                            <Facebook size={20} />
                        </a>
                        <a href="#" className="p-2 bg-gray-800 rounded-full text-gray-400 hover:text-white hover:bg-primary transition-all">
                            <Twitter size={20} />
                        </a>
                        <a href="#" className="p-2 bg-gray-800 rounded-full text-gray-400 hover:text-white hover:bg-primary transition-all">
                            <Instagram size={20} />
                        </a>
                    </div>
                </div>
                */}
            </div>
        </footer>
    );
};

export default Footer;
