// UserDashboard.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { User, MapPin, Gift, Heart, LogOut, ClipboardList } from "lucide-react"; // Optional Icons

const UserDashboard = () => {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState("profile");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("Token not found");
                const decoded = jwtDecode(token);
                const userId = decoded.id;

                // const response = await fetch(`http://localhost:5000/user/${userId}`, {
                const response = await fetch(`https://ecom-production-9b18.up.railway.app/user/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) throw new Error("Failed to fetch user");

                const userData = await response.json();
                setUser(userData);
            } catch (error) {
                console.error("❌ Error:", error);
                localStorage.removeItem("token");
                navigate("/login");
            }
        };

        fetchUser();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    if (!user) return <div className="text-center mt-10">Loading user info...</div>;

    const renderContent = () => {
        switch (activeTab) {
            case "orders":
                return <div className="text-gray-700">📦 You will be redirected to the orders page.</div>;
            case "profile":
                return (
                    <div className="space-y-3 text-gray-700">
                        <p><strong>Name:</strong> {user.name}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>User ID:</strong> {user.id}</p>
                    </div>
                );
            case "addresses":
                return (
                    <div className="text-gray-700">
                        Saved addresses shown here.
                        <br />
                        <Link to="/addaddress" className="text-blue-600 hover:underline">➕ Add New Address</Link>
                    </div>
                );
            case "wishlist":
                return <div className="text-gray-700">❤️ Your wishlist items will appear here.</div>;
            case "coupons":
                return <div className="text-gray-700">🎁 Your coupons will appear here.</div>;
            default:
                return <div>Select a tab</div>;
        }
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-sans">
            <aside className="w-72 p-6 bg-white shadow-xl rounded-r-3xl">
                <div className="mb-10">
                    <h2 className="text-2xl font-semibold text-gray-800">👋 Hello, {user.name}</h2>
                </div>
                <nav className="space-y-6">
                    <div>
                        <h3 className="text-gray-600 font-bold mb-2">MY ORDERS</h3>
                        {/* <button
                            onClick={() => setActiveTab("orders")}
                            className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-left transition 
                                ${activeTab === "orders" ? "bg-indigo-100 text-indigo-700 font-semibold" : "hover:bg-gray-100 text-gray-700"}`}>
                            <ClipboardList size={18} /> Orders
                        </button> */}
                        <button
                            onClick={() => navigate("/orders")}
                            className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-left hover:bg-gray-100 text-gray-700 transition">
                            <ClipboardList size={18} /> Orders
                        </button>

                    </div>
                    <div>
                        <h3 className="text-gray-600 font-bold mt-6 mb-2">ACCOUNT SETTINGS</h3>
                        <button
                            onClick={() => setActiveTab("profile")}
                            className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-left transition 
                                ${activeTab === "profile" ? "bg-indigo-100 text-indigo-700 font-semibold" : "hover:bg-gray-100 text-gray-700"}`}>
                            <User size={18} /> Profile Information
                        </button>
                        {/* <button
                            onClick={() => setActiveTab("addresses")}
                            className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-left transition 
                                ${activeTab === "addresses" ? "bg-indigo-100 text-indigo-700 font-semibold" : "hover:bg-gray-100 text-gray-700"}`}>
                            <MapPin size={18} /> Manage Addresses
                        </button> */}
                        <button
                            onClick={() => navigate("/myaddresses")}
                            className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-left hover:bg-gray-100 text-gray-700 transition">
                            <MapPin size={18} /> Manage Addresses
                        </button>

                    </div>
                    <div>
                        <h3 className="text-gray-600 font-bold mt-6 mb-2">MY STUFF</h3>
                        <button
                            onClick={() => setActiveTab("coupons")}
                            className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-left transition 
                                ${activeTab === "coupons" ? "bg-indigo-100 text-indigo-700 font-semibold" : "hover:bg-gray-100 text-gray-700"}`}>
                            <Gift size={18} /> My Coupons
                        </button>
                        <button
                            onClick={() => setActiveTab("wishlist")}
                            className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-left transition 
                                ${activeTab === "wishlist" ? "bg-indigo-100 text-indigo-700 font-semibold" : "hover:bg-gray-100 text-gray-700"}`}>
                            <Heart size={18} /> My Wishlist
                        </button>
                    </div>
                    <div className="pt-6 border-t mt-6">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-red-600 hover:text-red-800 transition">
                            <LogOut size={18} /> Logout
                        </button>
                    </div>
                </nav>
            </aside>

            <main className="flex-1 p-10">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">📋 Dashboard</h2>
                <div className="bg-white p-8 rounded-3xl shadow-xl transition hover:shadow-2xl">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default UserDashboard;
