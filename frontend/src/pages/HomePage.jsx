import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// Import user-provided hero image
import heroImage from '../assets/hero.jpg';
import { Heart, Shield, Users } from 'lucide-react';
import { getStats } from '../api';

const HomePage = () => {
    const { user } = useAuth();
    const [stats, setStats] = React.useState(null);

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await getStats();
                if (response.data.status === 200) {
                    setStats(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <div className="relative w-full h-[600px]">
                <img
                    src={heroImage}
                    alt="Helping hands"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-center items-center text-center px-4">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
                        Make a Difference Today
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl drop-shadow-md">
                        Join our community to connect directly with those in need.
                        Your contribution changes lives.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        {user?.role === 'RECEIVER' ? (
                            <>
                                <Link
                                    to="/receiver"
                                    className="px-8 py-4 bg-primary text-white rounded-full text-lg font-bold hover:bg-opacity-90 transition transform hover:scale-105 shadow-lg"
                                >
                                    Post Request
                                </Link>
                                
                            </>
                        ) : (
                            <Link
                                to="/donor"
                                className="px-8 py-4 bg-primary text-white rounded-full text-lg font-bold hover:bg-opacity-90 transition transform hover:scale-105 shadow-lg"
                            >
                                Donate Now
                            </Link>
                        )}
                        <Link
                            to="/learn-more"
                            className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full text-lg font-bold hover:bg-white hover:text-gray-900 transition transform hover:scale-105"
                        >
                            Learn More
                        </Link>
                    </div>
                </div>
            </div>

            {/* Impact Section */}
            <div className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16">
                        Our Impact
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* Stat 1 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition text-center group border border-gray-100">
                            <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary transition">
                                <Users className="text-primary group-hover:text-white transition" size={32} />
                            </div>
                            <h3 className="text-4xl font-bold text-primary mb-2">
                                {stats ? stats.donors : '0'}
                            </h3>
                            <p className="text-gray-600 font-medium uppercase tracking-wider">Donors</p>
                            <p className="text-sm text-gray-400 mt-4 leading-relaxed">
                                Generous individuals contributing to various causes.
                            </p>
                        </div>

                        {/* Stat 2 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition text-center group border border-gray-100">
                            <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary transition">
                                <Heart className="text-primary group-hover:text-white transition" size={32} />
                            </div>
                            <h3 className="text-4xl font-bold text-primary mb-2">
                                {stats ? stats.receivers : '0'}
                            </h3>
                            <p className="text-gray-600 font-medium uppercase tracking-wider">Receivers</p>
                            <p className="text-sm text-gray-400 mt-4 leading-relaxed">
                                Individuals and organizations receiving essential support.
                            </p>
                        </div>

                        {/* Stat 3 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition text-center group border border-gray-100">
                            <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary transition">
                                <Shield className="text-primary group-hover:text-white transition" size={32} />
                            </div>
                            <h3 className="text-4xl font-bold text-primary mb-2">
                                {stats ? stats.donations : '0'}
                            </h3>
                            <p className="text-gray-600 font-medium uppercase tracking-wider">Donations Made</p>
                            <p className="text-sm text-gray-400 mt-4 leading-relaxed">
                                Successful deliveries of help to those in need.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16">
                        Why Choose DonateHub?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* Feature 1 */}
                        <div className="bg-gray-50 p-8 rounded-2xl shadow-sm hover:shadow-md transition text-center group">
                            <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary transition">
                                <Heart className="text-primary group-hover:text-white transition" size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Direct Impact</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Connect directly with receivers. No middlemen, ensuring your help goes exactly where it's needed most.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-gray-50 p-8 rounded-2xl shadow-sm hover:shadow-md transition text-center group">
                            <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary transition">
                                <Shield className="text-primary group-hover:text-white transition" size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Transparent & Safe</h3>
                            <p className="text-gray-600 leading-relaxed">
                                We verify requests to ensure authenticity, creating a safe environment for both donors and receivers.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-gray-50 p-8 rounded-2xl shadow-sm hover:shadow-md transition text-center group">
                            <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary transition">
                                <Users className="text-primary group-hover:text-white transition" size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Community Driven</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Join a growing community of people dedicated to making the world a better place, one donation at a time.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
