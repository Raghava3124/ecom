import React, { useEffect, useState } from 'react';
import './All.css';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { cart = [], total = 0 } = location.state || {};
  const userId = localStorage.getItem("userId");

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [email, setEmail] = useState('');


  const token = localStorage.getItem("token"); // same as in MyAddresses.jsx

  useEffect(() => {
    if (!userId || !token) return;

    axios
       .get(`http://localhost:5000/api/address/user/${userId}`, {
      //.get(`https://ecom-production-ca19.up.railway.app/api/address/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setAddresses(res.data.addresses); // match the structure
      })
      .catch((err) => {
        console.error("Failed to fetch addresses:", err);
      });
  }, []);


  const generateOrderId = () => {
    return Math.floor(100000 + Math.random() * 900000); // 6-digit random order ID
  };



  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   if (!selectedAddressId || !email) {
  //     alert('Please select an address and enter your email.');
  //     return;
  //   }

  //   const orderId = generateOrderId();

  //   // navigate('/payments', {
  //   //   state: {
  //   //     orderId,
  //   //     addressId: selectedAddressId,
  //   //     email,
  //   //     cart,
  //   //     totalAmount: total
  //   //   }
  //   // });



  //   const selectedAddress = addresses.find((addr) => addr.id === parseInt(selectedAddressId));

  //   if (!selectedAddress) {
  //     alert('Selected address not found.');
  //     return;
  //   }

  //   navigate('/payments', {
  //     state: {
  //       orderId,
  //       email,
  //       cart,
  //       totalAmount: total,
  //       selectedAddress
  //     }
  //   });


  // };



  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedAddressId || !email) {
      alert('Please select an address and enter your email.');
      return;
    }

    const selectedAddress = addresses.find((addr) => addr.id === parseInt(selectedAddressId));

    if (!selectedAddress) {
      alert('Selected address not found.');
      return;
    }

    const orderId = generateOrderId();

    navigate('/payments', {
      state: {
        orderId,
        email,
        cart,
        totalAmount: total,
        selectedAddress
      }
    });
  };







  return (
    <div className="container mt-5 checkout-page">
      <h2 className="text-center mb-4">🛍️ Checkout</h2>

      <div className="cart-summary mb-4">
        <h4>Order Summary:</h4>
        {cart.length > 0 ? (
          <>
            {cart.map((item) => (
              <p key={item.product_id || item.id}>
                {item.product_name || item.title} (x{item.quantity}) - ₹
                {(item.product_price || item.price) * item.quantity}
              </p>
            ))}
            <h4>Total: ₹{total}</h4>
          </>
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="checkout-form">
        <div className="mb-3">
          <label>Email:</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* <div className="mb-3">
          <label>Select Delivery Address:</label>
          <select
            className="form-control"
            value={selectedAddressId}
            onChange={(e) => setSelectedAddressId(e.target.value)}
            required
          >
            <option value="">-- Select an Address --</option>
            {addresses.map((addr) => (
              <option key={addr.id} value={addr.id}>
                {addr.name}, {addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}
              </option>
            ))}
          </select>
        </div> */}

        <div className="mb-3">
          <label>Select Delivery Address:</label>
          {addresses.length === 0 ? (
            <p>No saved addresses found. Please add a new address to proceed</p>
          ) : (
            addresses.map((addr) => (
              <div key={addr.id} className="card p-3 mb-2">
                <div className="form-check d-flex justify-content-between align-items-center">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="address"
                    value={addr.id}
                    checked={selectedAddressId === String(addr.id)}
                    onChange={(e) => setSelectedAddressId(e.target.value)}
                    required
                  />
                  <div className="ms-3 flex-grow-1">
                    <strong>{addr.name}</strong><br />
                    {addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}<br />
                    Phone: {addr.phone}
                  </div>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/editaddress/${addr.id}`);
                    }}
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="d-flex justify-content-end mb-2">
  <button
    className="btn btn-primary btn-sm"
    onClick={() => navigate('/addaddress', { state: { from: location.pathname } })}
  >
    ➕ Add New Address
  </button>
</div>


        <button type="submit" className="btn btn-success w-100">
          Continue to Payment
        </button>
      </form>
    </div>
  );
};

export default Checkout;
