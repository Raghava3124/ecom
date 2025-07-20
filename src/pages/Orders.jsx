// src/pages/Orders.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
// import { useEffect, useState } from 'react';


const Orders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
      setMessageType(location.state.messageType);
      setShowMessage(true);
      // Optional: Clear the state after showing once
      window.history.replaceState({}, document.title)
    }
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      try {
         const res = await axios.get('http://localhost:5000/api/payments', {
        //const res = await axios.get('https://ecom-production-ca19.up.railway.app/api/payments', {
          headers: { Authorization: token ? `Bearer ${token}` : '' }
        });
        setOrders(res.data);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
          navigate('/login');
        }
      }
    };





    fetchOrders();
  }, [navigate], [location.state]);

  const getStatusBadge = (status) => {
    if (status === 'success') {
      return <span className="badge bg-success">✅ SUCCESS</span>;
    } else if (status === 'pending') {
      return <span className="badge bg-warning text-dark">⏳ PENDING</span>;
    } else if (status === 'failed') {
      return <span className="badge bg-danger">❌ FAILED</span>;
    } else {
      return <span className="badge bg-secondary">{status.toUpperCase()}</span>;
    }

  };

  return (
    <div className="container mt-4">


      {showMessage && (
        <div className={`message-box ${messageType}`}>
          {messageType === "success" ? (
            <>
              <span className="icon">✔️</span>
              <p>{message}</p>
            </>
          ) : (
            <>
              <span className="icon">⚠️</span>
              <p>{message}</p>
            </>
          )}
          <button onClick={() => setShowMessage(false)}>OK</button>
        </div>
      )}



      <h2 className="mb-4">🧾 Your Orders</h2>
      {orders.length === 0 ? (
        <p className="text-muted">You have not placed any orders yet.</p>
      ) : (
        <div className="row">
          {/* {orders.map((order) => (
            <div className="col-md-6 col-lg-4 mb-4" key={order.id}>
              <div className="card shadow-sm h-100 border-0">
                <div className="card-body">
                  <h5 className="card-title">Order ID: <span className="text-primary">{order.orderId}</span></h5>
                  <p className="card-text">
                    <strong>Amount:</strong> ₹{parseFloat(order.amount).toFixed(2)} <br />
                    <strong>UTR No:</strong> {order.utrNumber} <br />
                    <strong>Status:</strong> {getStatusBadge(order.status)} <br />
                    <strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}
                  </p>
                  {orders.status === "pending" ? (
                    <p className="text-muted">Please wait for the confirmation</p>
                  ) : (
                    <Link to="/home">Home</Link>
                  )}
                </div>
              </div>
            </div>
          ))} */}

          {orders.map((order) => (
            <div className="col-md-6 col-lg-4 mb-4" key={order.id}>
              <div className="card shadow-sm h-100 border-0">
                <div className="card-body">
                  <h5 className="card-title">Order ID: <span className="text-primary">{order.orderId}</span></h5>
                  <p className="card-text">
                    <strong>Amount:</strong> ₹{parseFloat(order.amount).toFixed(2)} <br />
                    <strong>UTR No:</strong> {order.utrNumber} <br />
                    <strong>Status:</strong> {getStatusBadge(order.status)} <br />
                    <strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}
                  </p>
                  <Link to={`/vieworder/${order.orderId}`} className="btn btn-outline-primary mt-2">
                    📦 Track Delivery
                  </Link>
                </div>
              </div>
            </div>
          ))}

        </div>
      )}
    </div>
  );
};

export default Orders;
