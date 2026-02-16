import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Home from './pages/Home';
import Cars from './pages/Cars';
import CarDetails from './pages/CarDetails';
import About from './pages/About';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserDashboard from './pages/user/UserDashboard';
import UserBookings from './pages/user/UserBookings';
import UserProfile from './pages/user/UserProfile';
import UserLicense from './pages/user/UserLicense';
import UserPayments from './pages/user/UserPayments';
import UserSettings from './pages/user/UserSettings';
import Payment from './pages/user/Payment';
import Invoice from './pages/user/Invoice';
import NotFound from './pages/NotFound';
import CorporateTravel from './pages/services/CorporateTravel';
import AirportTransfers from './pages/services/AirportTransfers';
import SpecialEvents from './pages/services/SpecialEvents';
import Services from './pages/Services';
import FAQ from './pages/FAQ';
import heroVideo from './assets/A_drive_like_no_other_the_Porsche_911_GT3_2160p.mp4';
import './App.css';

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className={`app-container ${isAdminRoute ? 'admin-theme' : ''}`}>
      {!isAdminRoute && (
        <>
          <video
            autoPlay
            loop
            muted
            playsInline
            className="global-bg-video"
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
          <div className="global-overlay"></div>
        </>
      )}

      {!isAdminRoute && <Navbar />}
      <main className="main-content">

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/cars/:id" element={<CarDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/dashboard" element={<UserDashboard />}>
            <Route index element={<UserBookings />} />
            <Route path="bookings" element={<UserBookings />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="license" element={<UserLicense />} />
            <Route path="payments" element={<UserPayments />} />
            <Route path="settings" element={<UserSettings />} />
          </Route>
          <Route path="/payment" element={<Payment />} />
          <Route path="/invoice/:bookingId" element={<Invoice />} />
          <Route path="/services/corporate-travel" element={<CorporateTravel />} />
          <Route path="/services/airport-transfers" element={<AirportTransfers />} />
          <Route path="/services/special-events" element={<SpecialEvents />} />
          <Route path="/services" element={<Services />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;

