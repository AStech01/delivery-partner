import React, { useState, useEffect, useRef } from "react";
import {
  FaSatelliteDish,
  FaPlay,
  FaStop,
  FaLocationArrow,
} from "react-icons/fa";
import Navbar from "../components/Navbar";

const LiveLocationTracker = () => {
  const [user, setUser] = useState({ username: "", email: "" });
  const [trackingBy, setTrackingBy] = useState("mobile"); // mobile or order
  const [mobile, setMobile] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", ""]);
  const otpInputsRef = useRef([]);
  const [item, setItem] = useState("");
  const [place, setPlace] = useState("");
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [status, setStatus] = useState("Checking permissions...");
  const [tracking, setTracking] = useState(false);
  const [watchId, setWatchId] = useState(null);
  const [location, setLocation] = useState(null);
  const lastUpdateRef = useRef(Date.now());

  // Load user from localStorage or default Guest
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const u = JSON.parse(stored);
        setUser({
          username: u.username || u.name || "Guest",
          email: u.email || "N/A",
        });
      } catch {
        setUser({ username: "Guest", email: "N/A" });
      }
    } else {
      setUser({ username: "Guest", email: "N/A" });
    }
  }, []);

  // Enable Location Permission
  const enableLocation = () => {
    if (!navigator.geolocation) {
      setStatus("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setLocationEnabled(true);
        setStatus("Permission granted");
        setLocation({ lat: p.coords.latitude, lng: p.coords.longitude });
      },
      () => {
        setLocationEnabled(false);
        setStatus("Permission denied");
      }
    );
  };

  // OTP handling functions (simplified, OTP = 1234)
  const handleSendOtp = () => {
    if (mobile.length !== 10) {
      alert("Enter a valid 10-digit mobile number");
      return;
    }
    setOtpSent(true);
    alert("OTP sent to " + mobile);
  };

  const handleOtpChange = (e, i) => {
    const v = e.target.value.replace(/[^0-9]/g, "");
    if (!v) return;
    const newOtp = [...otpDigits];
    newOtp[i] = v;
    setOtpDigits(newOtp);
    if (i < otpDigits.length - 1) otpInputsRef.current[i + 1]?.focus();
  };

  const handleOtpKey = (e, i) => {
    if (e.key === "Backspace") {
      const newOtp = [...otpDigits];
      if (!newOtp[i] && i > 0) otpInputsRef.current[i - 1]?.focus();
      newOtp[i] = "";
      setOtpDigits(newOtp);
    }
  };

  // Verify OTP and start tracking
  const verifyOtp = () => {
    if (otpDigits.join("") === "1234") {
      alert("OTP verified");
      startTracking();
    } else {
      alert("Invalid OTP");
    }
  };

  // Send location data to backend
  const sendToBackend = async (data) => {
    const token = localStorage.getItem("token") || ""; // adjust token retrieval as needed
    try {
      const res = await fetch("http://localhost:5000/location", {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Failed to send location");
      }
    } catch (err) {
      console.error("Error sending location:", err);
      alert("Network error while sending location");
    }
  };

  // Start location tracking
  const startTracking = () => {
    if (!locationEnabled) {
      alert("Please enable location permissions first");
      return;
    }
    if (!item.trim() || !place.trim()) {
      alert("Please enter both item and place");
      return;
    }
    if (
      (trackingBy === "mobile" && mobile.trim().length !== 10) ||
      (trackingBy === "order" && !orderId.trim())
    ) {
      alert("Please provide valid tracking info");
      return;
    }

    lastUpdateRef.current = Date.now();

    const id = navigator.geolocation.watchPosition(
      (p) => {
        lastUpdateRef.current = Date.now();
        const coords = { lat: p.coords.latitude, lng: p.coords.longitude };
        setLocation(coords);

        // Prepare data to send
        const dataToSend = {
          lat: coords.lat,
          lng: coords.lng,
          item: item.trim(),
          place: place.trim(),
          username: user.username,
          email: user.email,
        };
        if (trackingBy === "mobile") {
          dataToSend.mobile = mobile.trim();
        } else {
          dataToSend.orderId = orderId.trim();
        }

        sendToBackend(dataToSend);
      },
      (err) => {
        alert("Error while tracking location: " + err.message);
        stopTracking();
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );

    setWatchId(id);
    setTracking(true);
    setStatus("Tracking started");
  };

  // Stop location tracking
  const stopTracking = () => {
    if (watchId) navigator.geolocation.clearWatch(watchId);
    setTracking(false);
    setWatchId(null);
    setStatus("Tracking stopped");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-md mt-28 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 flex justify-center items-center gap-2">
          <FaSatelliteDish className="text-blue-500 animate-pulse" />
          Live Location Tracker
        </h2>

        {/* Toggle tracking mode */}
        <div className="flex justify-center gap-4">
          {["mobile", "order"].map((mode) => (
            <button
              key={mode}
              onClick={() => {
                setTrackingBy(mode);
                setOtpSent(false);
                setOtpDigits(["", "", "", ""]);
              }}
              className={`px-4 py-1 rounded-full text-sm font-medium ${
                trackingBy === mode
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {mode === "mobile" ? "Track by Mobile" : "Track by Order ID"}
            </button>
          ))}
        </div>

        {/* Input fields */}
        <div className="space-y-4">
          {trackingBy === "mobile" ? (
            <>
              <div>
                <label className="block font-medium">Mobile Number</label>
                <input
                  type="text"
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                  className="mt-1 w-full border rounded px-3 py-2"
                  disabled={tracking}
                />
              </div>
              {!otpSent ? (
                <button
                  onClick={handleSendOtp}
                  className="w-full bg-blue-600 text-white py-2 rounded"
                  disabled={tracking || mobile.length !== 10}
                >
                  Send OTP
                </button>
              ) : (
                <div>
                  <label className="block font-medium">Enter OTP</label>
                  <div className="flex justify-center gap-2 mt-1">
                    {otpDigits.map((digit, i) => (
                      <input
                        key={i}
                        type="text"
                        maxLength={1}
                        value={digit}
                        ref={(el) => (otpInputsRef.current[i] = el)}
                        onChange={(e) => handleOtpChange(e, i)}
                        onKeyDown={(e) => handleOtpKey(e, i)}
                        className="w-12 h-12 text-center border rounded text-xl"
                      />
                    ))}
                  </div>
                  <button
                    onClick={verifyOtp}
                    className="mt-4 w-full bg-green-600 text-white py-2 rounded"
                    disabled={otpDigits.some((d) => d === "") || tracking}
                  >
                    Verify & Start
                  </button>
                </div>
              )}
            </>
          ) : (
            <div>
              <label className="block font-medium">Order ID</label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="mt-1 w-full border rounded px-3 py-2"
                disabled={tracking}
              />
            </div>
          )}

          <div>
            <label className="block font-medium">Item</label>
            <input
              value={item}
              onChange={(e) => setItem(e.target.value)}
              className="mt-1 w-full border rounded px-3 py-2"
              disabled={tracking}
            />
          </div>
          <div>
            <label className="block font-medium">Place</label>
            <input
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              className="mt-1 w-full border rounded px-3 py-2"
              disabled={tracking}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <button
            onClick={enableLocation}
            className={`flex items-center gap-2 px-5 py-2 rounded text-white ${
              locationEnabled ? "bg-green-600" : "bg-gray-600"
            }`}
            disabled={locationEnabled}
          >
            <FaLocationArrow />
            {locationEnabled ? "Location Enabled" : "Enable Location"}
          </button>

          {!tracking && trackingBy === "order" && (
            <button
              onClick={startTracking}
              disabled={
                !locationEnabled ||
                !item.trim() ||
                !place.trim() ||
                !orderId.trim()
              }
              className={`flex items-center gap-2 px-5 py-2 rounded text-white ${
                locationEnabled && item && place && orderId
                  ? "bg-blue-600"
                  : "bg-blue-300 cursor-not-allowed"
              }`}
            >
              <FaPlay />
              Start Tracking
            </button>
          )}

          {tracking && (
            <button
              onClick={stopTracking}
              className="flex items-center gap-2 px-5 py-2 bg-red-600 text-white rounded"
            >
              <FaStop />
              Stop Tracking
            </button>
          )}
        </div>

        {/* Status & Coordinates */}
        <div className="mt-6 space-y-2">
          <div className="flex justify-between">
            <span>Status:</span>
            <span
              className={`px-3 py-1 rounded-full ${
                locationEnabled
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {status}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Latitude:</span>
            <span>{location?.lat?.toFixed(6) ?? "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span>Longitude:</span>
            <span>{location?.lng?.toFixed(6) ?? "N/A"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveLocationTracker;
