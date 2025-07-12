import React, { useState, useEffect, useRef } from "react";
import {
  FaMapMarkerAlt,
  FaSatelliteDish,
  FaPlay,
  FaStop,
  FaLocationArrow,
} from "react-icons/fa";
import Navbar from "../components/Navbar";

const LiveLocationTracker = () => {
  const [user, setUser] = useState({ username: "", email: "" });
  const [item, setItem] = useState("");
  const [place, setPlace] = useState("");
  const [location, setLocation] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [watchId, setWatchId] = useState(null);
  const [status, setStatus] = useState("Checking permissions...");
  const [locationEnabled, setLocationEnabled] = useState(false);

  // Tracking method states
  const [trackingBy, setTrackingBy] = useState("mobile"); // "mobile" or "order"
  const [mobile, setMobile] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [orderId, setOrderId] = useState("");

  // OTP digits as array of strings for small inputs
  const [otpDigits, setOtpDigits] = useState(["", "", "", ""]);
  const otpInputsRef = useRef([]);

  // To track last location update time
  const lastUpdateRef = useRef(Date.now());
  // Timeout duration before considering inactive/offline
  const INACTIVITY_TIMEOUT = 20 * 1000; // 20 seconds

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({
          username: parsedUser.username || parsedUser.name || "Guest",
          email: parsedUser.email || "N/A",
        });
      } catch (err) {
        console.error("Error reading user from localStorage:", err);
        setUser({ username: "Guest", email: "N/A" });
      }
    } else {
      setUser({ username: "Guest", email: "N/A" });
    }
  }, []);

  // Enable location access
  const enableLocation = () => {
    if (!navigator.geolocation) {
      setStatus("Geolocation is not supported");
      setLocationEnabled(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocationEnabled(true);
        setStatus("Location permission granted");
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        setLocationEnabled(false);
        setStatus("Location permission denied");
        console.error("Location error:", err);
      }
    );
  };

  // Simulate OTP send
  const handleSendOtp = () => {
    if (mobile.length !== 10) {
      alert("Enter valid 10-digit mobile number");
      return;
    }
    setOtpSent(true);
    alert("OTP sent to " + mobile);
  };

  // Handle OTP digit change in each box
  const handleOtpChange = (e, index) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    if (val.length > 1) return;

    const newOtp = [...otpDigits];
    newOtp[index] = val;
    setOtpDigits(newOtp);

    // Move focus to next box if not last and input is not empty
    if (val && index < otpDigits.length - 1) {
      otpInputsRef.current[index + 1].focus();
    }
  };

  // Handle backspace navigation in OTP inputs
  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otpDigits[index] === "") {
        if (index > 0) otpInputsRef.current[index - 1].focus();
      } else {
        // Clear current box on backspace
        const newOtp = [...otpDigits];
        newOtp[index] = "";
        setOtpDigits(newOtp);
      }
    }
  };

  // Verify OTP entered
  const verifyOtp = () => {
    const fullOtp = otpDigits.join("");
    if (fullOtp === "1234") {
      alert("OTP verified successfully");
      startTracking();
    } else {
      alert("Invalid OTP");
    }
  };

  // Start tracking location
  const startTracking = () => {
    if (!locationEnabled) {
      alert("Please enable location first");
      return;
    }
    if (!item.trim() || !place.trim()) {
      alert("Please enter both item and place");
      return;
    }
    if (
      (trackingBy === "mobile" && (!mobile || mobile.length !== 10)) ||
      (trackingBy === "order" && !orderId.trim())
    ) {
      alert("Provide valid " + trackingBy);
      return;
    }

    lastUpdateRef.current = Date.now();

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        lastUpdateRef.current = Date.now();

        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setLocation(coords);

        const payload = {
          ...coords,
          item,
          place,
          username: user.username,
          email: user.email,
          ...(trackingBy === "mobile" ? { mobile } : { orderId }),
        };

        sendToBackend(payload);
      },
      (err) => {
        console.error("Tracking error:", err);
        stopTracking();
        setStatus("Tracking error: " + err.message);
        alert("Unable to track location: " + err.message);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );

    setWatchId(id);
    setTracking(true);
    setStatus("Tracking started");
  };

  // Stop tracking location
  const stopTracking = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setTracking(false);
    setStatus("Tracking stopped");
  };

  // Send location data to backend (mock)
  const sendToBackend = async (data) => {
    try {
      await fetch("/api/location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.error("Backend error:", err);
    }
  };

  // Monitor for inactivity (no location update)
  useEffect(() => {
    if (!tracking) return;

    const interval = setInterval(() => {
      if (Date.now() - lastUpdateRef.current > INACTIVITY_TIMEOUT) {
        stopTracking();
        setStatus("Offline / Inactive: Location updates stopped");
        alert("Location updates stopped. Tracking has been stopped.");
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [tracking]);

  // Listen for permission changes
  useEffect(() => {
    if (!navigator.permissions) return;

    let permissionStatus;
    navigator.permissions.query({ name: "geolocation" }).then((status) => {
      permissionStatus = status;
      status.onchange = () => {
        if (status.state !== "granted") {
          if (tracking) {
            stopTracking();
            setLocationEnabled(false);
            setStatus("Location permission revoked, tracking stopped");
            alert("Location permission revoked. Tracking stopped.");
          }
        }
      };
    });

    return () => {
      if (permissionStatus) permissionStatus.onchange = null;
    };
  }, [tracking]);

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-md mt-16 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 flex justify-center items-center gap-2">
          <FaSatelliteDish className="text-blue-500 animate-pulse" />
          Live Location Tracker
        </h2>

        {/* Tracking method toggle */}
        <div className="flex gap-4 mb-4 justify-center">
          <button
            onClick={() => {
              setTrackingBy("mobile");
              setOtpSent(false);
              setOtpDigits(["", "", "", ""]);
            }}
            className={`px-4 py-1 rounded-full text-sm font-medium ${
              trackingBy === "mobile"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Track by Mobile
          </button>
          <button
            onClick={() => setTrackingBy("order")}
            className={`px-4 py-1 rounded-full text-sm font-medium ${
              trackingBy === "order"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Track by Order ID
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          {trackingBy === "mobile" && (
            <>
              <div>
                <label className="block font-medium text-gray-700">
                  Mobile Number
                </label>
                <input
                  type="text"
                  maxLength={10}
                  value={mobile}
                  onChange={(e) =>
                    setMobile(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="Enter mobile number"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              {!otpSent ? (
                <button
                  onClick={handleSendOtp}
                  className="w-full bg-blue-600 text-white py-2 rounded-md"
                >
                  Send OTP
                </button>
              ) : (
                <div>
                  <label className="block font-medium text-gray-700 mt-2">
                    Enter OTP
                  </label>
                  <div className="flex gap-2 mt-1 justify-center">
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        type="text"
                        maxLength={1}
                        value={digit}
                        ref={(el) => (otpInputsRef.current[idx] = el)}
                        onChange={(e) => handleOtpChange(e, idx)}
                        onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                        className="w-12 h-12 text-center text-xl border border-gray-300 shadow-md rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ))}
                  </div>
                  <button
                    onClick={verifyOtp}
                    className="mt-4 w-full bg-green-600 text-white py-2 rounded-md"
                  >
                    Verify OTP & Start Tracking
                  </button>
                </div>
              )}
            </>
          )}

          {trackingBy === "order" && (
            <div>
              <label className="block font-medium text-gray-700">Order ID</label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter order ID"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          )}

          <div>
            <label className="block font-medium text-gray-700">Item</label>
            <input
              type="text"
              value={item}
              onChange={(e) => setItem(e.target.value)}
              placeholder="Enter item"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700">Place</label>
            <input
              type="text"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              placeholder="Enter place"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
        </div>

        {/* Enable location and track buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={enableLocation}
            className={`flex items-center gap-2 px-5 py-2 rounded text-white ${
              locationEnabled
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-600 hover:bg-gray-700"
            } transition-colors duration-200`}
          >
            <FaLocationArrow />
            {locationEnabled ? "Location Enabled" : "Enable Location"}
          </button>

          {trackingBy === "order" && !tracking && (
            <button
              onClick={startTracking}
              disabled={
                !locationEnabled || !item.trim() || !place.trim() || !orderId
              }
              className={`flex items-center gap-2 px-5 py-2 rounded text-white ${
                locationEnabled && item.trim() && place.trim() && orderId
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-300 cursor-not-allowed"
              } transition-colors duration-200`}
            >
              <FaPlay />
              Start Tracking
            </button>
          )}

          {tracking && (
            <button
              onClick={stopTracking}
              className="flex items-center gap-2 px-5 py-2 bg-red-600 hover:bg-red-700 rounded text-white transition-colors duration-200"
            >
              <FaStop />
              Stop Tracking
            </button>
          )}
        </div>

        {/* Location data */}
        <table className="w-full table-auto text-left border-separate border-spacing-y-2 mt-6">
          <tbody>
            <tr>
              <td className="font-medium text-gray-600 flex items-center gap-2">
                <FaSatelliteDish className="text-indigo-500" />
                Status
              </td>
              <td>
                <span
                  className={`text-sm font-semibold px-3 py-1 rounded-full ${
                    locationEnabled
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {status}
                </span>
              </td>
            </tr>
            <tr>
              <td className="font-medium text-gray-600 flex items-center gap-2">
                <FaMapMarkerAlt className="text-indigo-500" />
                Latitude
              </td>
              <td>{location ? location.lat.toFixed(6) : "N/A"}</td>
            </tr>
            <tr>
              <td className="font-medium text-gray-600 flex items-center gap-2">
                <FaMapMarkerAlt className="text-indigo-500" />
                Longitude
              </td>
              <td>{location ? location.lng.toFixed(6) : "N/A"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LiveLocationTracker;
