import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './All.css'; // Make sure styles like .cart-badge are defined

function Nav({ userId, handleLogout }) {
    const navigate = useNavigate();
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        let interval;

        const fetchCartCount = () => {
            if (userId) {
                axios.get(`http://localhost:5000/api/cart/count/${userId}`)
                    .then((res) => {
                        setCartCount(res.data.count);
                    })
                    .catch((err) => {
                        console.error("Error fetching cart count:", err);
                    });
            }
        };

        fetchCartCount(); // initial fetch

        if (userId) {
            interval = setInterval(fetchCartCount, 500); // re-fetch every 5s
        }

        return () => clearInterval(interval);
    }, [userId]); // Re-fetch cart count if userId changes

    const logoutUser = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        handleLogout(); // clear userId in App.jsx
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">Shopping</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="navbar-brand" to="/home">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="navbar-brand" to="/products">Products</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="navbar-brand" to="/contact">Contact</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="navbar-brand" to="/creator">Creator</Link>
                        </li>
                        <li className="nav-item">
                        <Link className="nav-item" to="/orders">My Orders</Link>

                        </li>
                    </ul>

                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        {!userId && (
                            <li className="nav-item">
                                <Link className="navbar-brand" to="/login">Login</Link>
                            </li>
                        )}

                        {userId && (
                            <>
                                <li className="nav-item">
                                    <Link className="navbar-brand" to="/dashboard">User Dashboard</Link>
                                </li>

                                <li className="nav-item">
                                    <button className="navbar-brand btn btn-link" onClick={logoutUser}>
                                        Logout
                                    </button>
                                </li>
                            </>
                        )}

                        <li className="nav-item">
                            <Link className="navbar-brand cart-link" to="/cart">
                                Cart 🛒
                                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Nav;
