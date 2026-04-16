import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ReceiverDashboard from './pages/ReceiverDashboard';
import ReceiverProfile from './pages/ReceiverProfile';
import CreateRequest from './pages/CreateRequest';
import DonorDashboard from './pages/DonorDashboard';
import DonorProfile from './pages/DonorProfile';
import HomePage from './pages/HomePage';
import LearnMore from './pages/LearnMore';
import AboutUs from './pages/AboutUs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import ContactUs from './pages/ContactUs';
import { useAuth } from './context/AuthContext';

const PrivateRoute = ({ children, roles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    if (!user) return <Navigate to="/login" />;
    if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
    return children;
};

// Home page - shows HomePage for everyone
const HomeRedirect = () => {
    return <HomePage />;
};

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="container mx-auto px-4 py-8">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/" element={<HomeRedirect />} />
                        <Route path="/learn-more" element={<LearnMore />} />
                        <Route path="/about-us" element={<AboutUs />} />
                        <Route path="/privacy" element={<PrivacyPolicy />} />
                        <Route path="/terms" element={<TermsOfService />} />
                        <Route path="/contact" element={<ContactUs />} />

                        <Route path="/receiver" element={
                            <PrivateRoute roles={['RECEIVER']}>
                                <ReceiverDashboard />
                            </PrivateRoute>
                        } />
                        <Route path="/receiver/create" element={
                            <PrivateRoute roles={['RECEIVER']}>
                                <CreateRequest />
                            </PrivateRoute>
                        } />
                        <Route path="/receiver-profile" element={
                            <PrivateRoute roles={['RECEIVER']}>
                                <ReceiverProfile />
                            </PrivateRoute>
                        } />

                        <Route path="/donor" element={
                            <PrivateRoute roles={['DONOR']}>
                                <DonorDashboard />
                            </PrivateRoute>
                        } />
                        <Route path="/donor-profile" element={
                            <PrivateRoute roles={['DONOR']}>
                                <DonorProfile />
                            </PrivateRoute>
                        } />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
