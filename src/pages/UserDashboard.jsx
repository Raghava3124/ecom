import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { User, MapPin, Gift, Heart, LogOut, ClipboardList } from "lucide-react";
import { FaCartPlus } from "react-icons/fa";

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
                console.log("🔐 Token in UserDashboard:", token);
                console.log("🧾 Decoded User ID from token:", userId);
                console.log("🌐 Fetching from URL:", `https://ecom-production-8da0.up.railway.app/user/${userId}`);


                //const response = await fetch(`https://ecom-production-ca19.up.railway.app/user/${userId}`, {
                const response = await fetch(`https://ecom-production-8da0.up.railway.app/user/${userId}`, {
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

    if (!user) return <div className="text-center mt-5">Loading user info...</div>;

    const renderContent = () => {
        switch (activeTab) {
            case "orders":
                return <div className="text-secondary">📦 You will be redirected to the orders page.</div>;
            case "profile":
                return (
                    <div className="text-dark">
                        <p><strong>Name:</strong> {user.name}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>User ID:</strong> {user.id}</p>
                    </div>
                );
            case "addresses":
                return (
                    <div className="text-dark">
                        Saved addresses shown here. <br />
                        <Link to="/addaddress" className="text-primary">➕ Add New Address</Link>
                    </div>
                );
            case "wishlist":
                return <div className="text-dark">❤️ Your wishlist items will appear here.</div>;
            case "coupons":
                return <div className="text-dark">🎁 Your coupons will appear here.</div>;
            default:
                return <div className="text-muted">Select a tab</div>;
        }
    };

    return (
        <div className="container-fluid vh-100 bg-light d-flex">
            <aside className="col-md-3 bg-white border-end p-4 shadow">
                <h4 className="mb-4">👋 Hello, {user.name}</h4>

                <div className="mb-4">
                    <h6 className="text-muted">MY ORDERS</h6>
                    <button
                        className="btn btn-outline-secondary w-100 text-start d-flex align-items-center gap-2"
                        onClick={() => navigate("/orders")}
                    >
                        <ClipboardList size={16} /> Orders
                    </button>
                </div>

                <div className="mb-4">
                    <h6 className="text-muted">ACCOUNT SETTINGS</h6>
                    <button
                        className={`btn w-100 text-start d-flex align-items-center gap-2 mb-2 ${activeTab === "profile" ? "btn-primary text-white" : "btn-outline-secondary"}`}
                        onClick={() => setActiveTab("profile")}
                    >
                        <User size={16} /> Profile Information
                    </button>
                    <button
                        className="btn btn-outline-secondary w-100 text-start d-flex align-items-center gap-2"
                        onClick={() => navigate("/myaddresses")}
                    >
                        <MapPin size={16} /> Manage Addresses
                    </button>
                </div>

                <div className="mb-4">
                    <h6 className="text-muted">MY STUFF</h6>
                    <button
                        className={`btn w-100 text-start d-flex align-items-center gap-2 mb-2 ${activeTab === "coupons" ? "btn-primary text-white" : "btn-outline-secondary"}`}
                        onClick={() => setActiveTab("coupons")}
                    >
                        <Gift size={16} /> My Coupons
                    </button>
                    {/* <button
                        className={`btn w-100 text-start d-flex align-items-center gap-2 ${activeTab === "wishlist" ? "btn-primary text-white" : "btn-outline-secondary"}`}
                        onClick={() => setActiveTab("wishlist")}
                    >
                        <Heart size={16} /> My Wishlist
                    </button> */}
                    <button
                        className="btn btn-outline-secondary w-100 text-start d-flex align-items-center gap-2"
                        onClick={() => navigate("/wishlist")}
                    >
                        <Heart size={16} /> My Wishlist
                    </button>
                    <br />
                    <button
                        className="btn btn-outline-secondary w-100 text-start d-flex align-items-center gap-2"
                        onClick={() => navigate("/car")}
                    >
                        <FaCartPlus size={16} /> My Cart
                    </button>
                </div>

                <div className="border-top pt-3">
                    <button className="btn btn-link text-danger d-flex align-items-center gap-2" onClick={handleLogout}>
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </aside>

            <main className="col-md-9 p-5">
                <h2 className="mb-4">📋 Dashboard</h2>
                <div className="bg-white p-4 rounded shadow-sm border">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default UserDashboard;
