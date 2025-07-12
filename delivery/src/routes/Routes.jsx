import React from 'react';
import { Routes, Route } from 'react-router-dom';
// import Login from '../pages/Login';
// import Dashboard from '../pages/Dashboard';
import Home from '../pages/Home/Home';
// import DeliveryPartnerSignup from '../components/DeliveryPartnerSignup';
import Signup from '../components/Signup';
import Login from '../components/Login';
import DeliveryDashboard from '../components/DeliveryDashboard';
import LiveTrackingStatus from '../components/LiveTrackingStatus';
import LiveLocationTracker from '../pages/LiveLocationTracker';
import DeliveryOrders from '../pages/DeliveryOrders';


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      <Route path="/deliverydashboard" element={<DeliveryDashboard />} />
      <Route path="/livelocationtracker" element={<LiveLocationTracker />} />
       <Route path="/deliveryorders" element={<DeliveryOrders />} />
    </Routes>
  );
}