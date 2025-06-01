import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Payments = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId,  cart, totalAmount,selectedAddress } = location.state || {};

  useEffect(() => {
    if (!orderId || !cart || cart.length === 0 || !selectedAddress) {
      alert('Missing info. Redirecting back to checkout.');
      navigate('/checkout');
    }
  }, [orderId, cart, navigate]);

  const upiId = '6300073279@superyes';
  const payeeName = 'Your Store Name';

  const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${totalAmount}&cu=INR&tid=${orderId}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiUri)}`;

  const [utrNumber, setUtrNumber] = useState('');
  const [message, setMessage] = useState('');




 const handleConfirm = async () => {
  if (!utrNumber.trim()) {
    setMessage('❌ Please enter the UTR number from your payment receipt.');
    return;
  }

  try {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    // Step 1: Add payment
    // const paymentRes = await fetch('http://localhost:5000/api/payments', {
    const paymentRes = await fetch('https://ecom-production-ca19.up.railway.app/api/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify({
        orderId,
        utrNumber: utrNumber.trim(),
        amount: totalAmount,
        status: 'pending',
        cart,
        userId
      }),
    });

    const paymentData = await paymentRes.json();

    if (!paymentRes.ok) {
      setMessage(`❌ ${paymentData.message || 'Payment failed.'}`);
      return;
    }

    const selectedAddress = location.state.selectedAddress;

    // Step 2: Create order entry with full address and payment info
    // const orderRes = await fetch('http://localhost:5000/api/orders', {
     const orderRes = await fetch('https://ecom-production-ca19.up.railway.app/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify({
        userId,
        orderId,
        utrNumber: paymentData.utrNumber || utrNumber.trim(),
        paymentStatus: paymentData.status || 'pending',
        deliveryStatus: 'pending',

        // Full address fields
        name: selectedAddress.name,
        phone: selectedAddress.phone,
        pincode: selectedAddress.pincode,
        city: selectedAddress.city,
        state: selectedAddress.state,
        addressLine: selectedAddress.addressLine,
        landmark: selectedAddress.landmark
      }),
    });

    if (!orderRes.ok) {
      setMessage('❌ Order creation failed.');
      return;
    }

    // Step 3: Clear cart
    // await fetch(`http://localhost:5000/api/cart/${userId}`, {
    await fetch(`https://ecom-production-ca19.up.railway.app/api/cart/${userId}`, {
      method: 'DELETE',
    });

    localStorage.removeItem('cart');

    setMessage('✅ Payment recorded & Order placed. Redirecting to home...');
    setTimeout(() => {
      navigate('/');
    }, 2000);

  } catch (err) {
    console.error(err);
    setMessage('❌ Network error. Please try again.');
  }
};

 
 
 
 
  return (
    <div className="payments-container">
      <h2 className="text-center">💳 Payment for Order #{orderId}</h2>

      <div className="qr-section text-center">
        <h5>Scan to Pay ₹{totalAmount}</h5>
        <img src={qrUrl} alt="UPI QR Code" />
        <p><small>Payee: {payeeName} ({upiId})</small></p>
      </div>

      <div className="utr-confirmation mt-4">
        <label>Transaction UTR Number:</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter UTR number from payment receipt"
          value={utrNumber}
          onChange={(e) => setUtrNumber(e.target.value)}
        />
        <button className="btn btn-primary w-100 mt-2" onClick={handleConfirm}>
          Confirm Payment
        </button>
      </div>

      {message && (
        <div className="alert mt-3" role="alert">
          {message}
        </div>
      )}
    </div>
  );
};

export default Payments;
