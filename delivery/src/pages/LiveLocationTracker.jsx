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
  const [trackingBy, setTrackingBy] = useState("mobile");
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
  const [locationLogs, setLocationLogs] = useState([]);
  const [trackingInfoVisible, setTrackingInfoVisible] = useState(false);

  const INACTIVITY_TIMEOUT = 20 * 1000;

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

  useEffect(() => {
    if (!navigator.permissions) return;
    let perm;
    navigator.permissions.query({ name: "geolocation" }).then((st) => {
      perm = st;
      st.onchange = () => {
        if (st.state !== "granted" && tracking) {
          stopTracking();
          setLocationEnabled(false);
          alert("Location permission revoked. Tracking stopped.");
          setStatus("Tracking stopped — permission revoked");
        }
      };
    });
    return () => perm && (perm.onchange = null);
  }, [tracking]);

  useEffect(() => {
    if (trackingBy === "order" && tracking) {
      fetchLogs();
      const iv = setInterval(fetchLogs, 5000);
      return () => clearInterval(iv);
    }
  }, [trackingBy, tracking, orderId]);

  useEffect(() => {
    if (!tracking) return;
    const iv = setInterval(() => {
      if (Date.now() - lastUpdateRef.current > INACTIVITY_TIMEOUT) {
        stopTracking();
        setStatus("Offline: Location updates stopped");
        alert("Location updates stopped due to inactivity.");
      }
    }, 5000);
    return () => clearInterval(iv);
  }, [tracking]);

  const enableLocation = () => {
    if (!navigator.geolocation) return setStatus("Geolocation not supported");
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

  const handleSendOtp = () => {
    if (mobile.length !== 10) return alert("Enter valid 10-digit mobile number");
    setOtpSent(true);
    alert("OTP sent to " + mobile);
  };

  const handleOtpChange = (e, i) => {
    const v = e.target.value.replace(/[^0-9]/g, "");
    if (!v) return;
    const nxt = [...otpDigits];
    nxt[i] = v;
    setOtpDigits(nxt);
    if (i < otpDigits.length - 1) otpInputsRef.current[i + 1]?.focus();
  };

  const handleOtpKey = (e, i) => {
    if (e.key === "Backspace") {
      const nxt = [...otpDigits];
      if (!nxt[i] && i > 0) otpInputsRef.current[i - 1]?.focus();
      nxt[i] = "";
      setOtpDigits(nxt);
    }
  };

  const verifyOtp = () => {
    if (otpDigits.join("") === "1234") {
      alert("OTP verified");
      startTracking();
    } else alert("Invalid OTP");
  };

  const fetchLogs = async () => {
    if (!orderId) return;
    try {
      console.log("Fetching logs for order:", orderId);
      const res = await fetch(`/api/location/${orderId}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (!Array.isArray(data)) {
        console.warn("Expected an array but got:", data);
        setLocationLogs([]);
        return;
      }
      setLocationLogs(data);
    } catch (error) {
      console.error("Fetch logs failed:", error);
      setLocationLogs([]);
    }
  };

  const startTracking = () => {
    if (!locationEnabled) return alert("Enable location first");
    if (!item.trim() || !place.trim()) return alert("Enter both item and place");
    if (
      (trackingBy === "mobile" && mobile.length !== 10) ||
      (trackingBy === "order" && !orderId.trim())
    )
      return alert("Provide valid info");

    lastUpdateRef.current = Date.now();

    const id = navigator.geolocation.watchPosition(
      (p) => {
        lastUpdateRef.current = Date.now();
        const coords = { lat: p.coords.latitude, lng: p.coords.longitude };
        setLocation(coords);
        sendToBackend({
          ...coords,
          item,
          place,
          username: user.username,
          email: user.email,
          ...(trackingBy === "mobile" ? { mobile } : { orderId }),
        });
      },
      (err) => {
        console.error(err);
        stopTracking();
        setStatus("Error: " + err.message);
        alert("Tracking error: " + err.message);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );

    setWatchId(id);
    setTracking(true);
    setStatus("Tracking started");
    setTrackingInfoVisible(true);
  };

  const stopTracking = () => {
    if (watchId) navigator.geolocation.clearWatch(watchId);
    setTracking(false);
    setWatchId(null);
    setStatus("Tracking stopped");
  };

  const sendToBackend = async (data) => {
    const token = localStorage.getItem("token");
    await fetch("/api/location", {
      method: "POST",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).catch(console.error);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-md mt-28 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 flex justify-center items-center gap-2">
          <FaSatelliteDish className="text-blue-500 animate-pulse" />
          Live Location Tracker
        </h2>

        {/* Toggle */}
        <div className="flex justify-center gap-4">
          {["mobile", "order"].map((t) => (
            <button
              key={t}
              onClick={() => {
                setTrackingBy(t);
                setOtpSent(false);
                setOtpDigits(["", "", "", ""]);
              }}
              className={`px-4 py-1 rounded-full text-sm font-medium ${
                trackingBy === t
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {t === "mobile" ? "Track by Mobile" : "Track by Order ID"}
            </button>
          ))}
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          {trackingBy === "mobile" ? (
            <>
              <div>
                <label className="block font-medium">Mobile Number</label>
                <input
                  type="text"
                  maxLength={10}
                  value={mobile}
                  onChange={(e) =>
                    setMobile(e.target.value.replace(/\D/g, ""))
                  }
                  className="mt-1 w-full border rounded px-3 py-2"
                />
              </div>
              {!otpSent ? (
                <button
                  onClick={handleSendOtp}
                  className="w-full bg-blue-600 text-white py-2 rounded"
                >
                  Send OTP
                </button>
              ) : (
                <div>
                  <label className="block font-medium">Enter OTP</label>
                  <div className="flex justify-center gap-2 mt-1">
                    {otpDigits.map((d, i) => (
                      <input
                        key={i}
                        type="text"
                        maxLength={1}
                        value={d}
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
              />
            </div>
          )}

          <div>
            <label className="block font-medium">Item</label>
            <input
              value={item}
              onChange={(e) => setItem(e.target.value)}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-medium">Place</label>
            <input
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              className="mt-1 w-full border rounded px-3 py-2"
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
          >
            <FaLocationArrow />
            {locationEnabled ? "Location Enabled" : "Enable Location"}
          </button>

          {!tracking && trackingBy === "order" && (
            <button
              onClick={startTracking}
              disabled={!locationEnabled || !item || !place || !orderId}
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

        {/* Tracking Summary Table */}
        {trackingInfoVisible && (
          <div className="mt-6 bg-white border rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">
              Tracking Summary
            </h3>
            <table className="w-full text-sm table-auto">
              <tbody>
                <tr>
                  <td className="font-medium py-1">Username</td>
                  <td className="py-1">{user.username}</td>
                </tr>
                <tr>
                  <td className="font-medium py-1">Email</td>
                  <td className="py-1">{user.email}</td>
                </tr>
                <tr>
                  <td className="font-medium py-1">Tracking By</td>
                  <td className="py-1">{trackingBy === "mobile" ? mobile : orderId}</td>
                </tr>
                <tr>
                  <td className="font-medium py-1">Item</td>
                  <td className="py-1">{item}</td>
                </tr>
                <tr>
                  <td className="font-medium py-1">Place</td>
                  <td className="py-1">{place}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Location Logs for order tracking */}
        {trackingBy === "order" && (
          <div className="mt-8 max-h-64 overflow-auto">
            <h3 className="font-semibold mb-2">Location Logs for Order</h3>
            {locationLogs.length === 0 ? (
              <p className="text-gray-600 text-sm">No location data available.</p>
            ) : (
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-2 py-1 text-left">Date/Time</th>
                    <th className="border border-gray-300 px-2 py-1 text-left">Latitude</th>
                    <th className="border border-gray-300 px-2 py-1 text-left">Longitude</th>
                    <th className="border border-gray-300 px-2 py-1 text-left">Place</th>
                  </tr>
                </thead>
                <tbody>
                  {locationLogs.map((log, idx) => (
                    <tr key={idx} className="odd:bg-white even:bg-gray-50">
                      <td className="border border-gray-300 px-2 py-1">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="border border-gray-300 px-2 py-1">{log.latitude}</td>
                      <td className="border border-gray-300 px-2 py-1">{log.longitude}</td>
                      <td className="border border-gray-300 px-2 py-1">{log.place}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveLocationTracker;
