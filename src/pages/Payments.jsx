import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './All.css'; // Ensure message-box styling exists

const Payments = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, cart, totalAmount, selectedAddress } = location.state || {};

  const [loading, setLoading] = useState(false);

  const USD_TO_INR = 86;
  const amountInINR = (totalAmount * USD_TO_INR).toFixed(2);

  const [utrNumber, setUtrNumber] = useState('');
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [messageType, setMessageType] = useState(''); // success or warning

  useEffect(() => {
    if (!orderId || !cart || cart.length === 0 || !selectedAddress) {
      alert('Missing info. Redirecting back to checkout.');
      navigate('/checkout');
    }
  }, [orderId, cart, navigate]);

  const upiId = '6300073279@superyes';
  const payeeName = 'INDANA RAGHAVENKATA SATYANARAYANA';

  const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${amountInINR}&cu=INR&tid=${orderId}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiUri)}`;

  // const handleConfirm = async () => {
  //   const trimmedUTR = utrNumber.trim();

  //   if (!trimmedUTR) {
  //     setMessage('❌ Please enter the UTR number from your payment receipt.');
  //     setMessageType('warning');
  //     setShowMessage(true);
  //     return;
  //   }

  //   if (/[^0-9]/.test(trimmedUTR)) {
  //     setMessage('❌ UTR number must not contain alphabets or special characters.');
  //     setMessageType('warning');
  //     setShowMessage(true);
  //     return;
  //   }

  //   if (trimmedUTR.length !== 12) {
  //     setMessage('❌ UTR number must be exactly 12 digits long.');
  //     setMessageType('warning');
  //     setShowMessage(true);
  //     return;
  //   }

  //   try {
  //     const token = localStorage.getItem('token');
  //     const userId = localStorage.getItem('userId');

  //     const paymentRes = await fetch('https://ecom-production-9b18.up.railway.app/api/payments', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: token ? `Bearer ${token}` : '',
  //       },
  //       body: JSON.stringify({
  //         orderId,
  //         utrNumber: trimmedUTR,
  //         amount: amountInINR,
  //         status: 'pending',
  //         cart,
  //         userId
  //       }),
  //     });

  //     const paymentData = await paymentRes.json();

  //     if (!paymentRes.ok) {
  //       setMessage(`❌ ${paymentData.message || 'Payment failed.'}`);
  //       setMessageType('warning');
  //       setShowMessage(true);
  //       return;
  //     }

  //     const orderRes = await fetch('https://ecom-production-9b18.up.railway.app/api/orders', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: token ? `Bearer ${token}` : '',
  //       },
  //       body: JSON.stringify({
  //         userId,
  //         orderId,
  //         utrNumber: paymentData.utrNumber || trimmedUTR,
  //         paymentStatus: paymentData.status || 'pending',
  //         deliveryStatus: 'pending',
  //         name: selectedAddress.name,
  //         phone: selectedAddress.phone,
  //         pincode: selectedAddress.pincode,
  //         city: selectedAddress.city,
  //         state: selectedAddress.state,
  //         addressLine: selectedAddress.addressLine,
  //         landmark: selectedAddress.landmark
  //       }),
  //     });

  //     if (!orderRes.ok) {
  //       setMessage('❌ Order creation failed.');
  //       setMessageType('warning');
  //       setShowMessage(true);
  //       return;
  //     }

  //     await fetch(`https://ecom-production-9b18.up.railway.app/api/cart/${userId}`, {
  //       method: 'DELETE',
  //     });

  //     localStorage.removeItem('cart');

  //     setMessage('✅ Payment successful. Order confirmation will take 1 to 12 hours.');
  //     setMessageType('success');
  //     setShowMessage(true);

  //   } catch (err) {
  //     console.error(err);
  //     setMessage('❌ Network error. Please try again.');
  //     setMessageType('warning');
  //     setShowMessage(true);
  //   }
  // };



  const handleConfirm = async () => {
    const trimmedUTR = utrNumber.trim();

    if (!trimmedUTR) {
      setMessage('❌ Please enter the UTR number from your payment receipt.');
      setMessageType('warning');
      setShowMessage(true);
      return;
    }

    if (/[^0-9]/.test(trimmedUTR)) {
      setMessage('❌ UTR number must not contain alphabets or special characters.');
      setMessageType('warning');
      setShowMessage(true);
      return;
    }

    if (trimmedUTR.length !== 12) {
      setMessage('❌ UTR number must be exactly 12 digits long.');
      setMessageType('warning');
      setShowMessage(true);
      return;
    }

    setLoading(true); // 🔐 Disable button
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      const paymentRes = await fetch('https://ecom-production-9b18.up.railway.app/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          orderId,
          utrNumber: trimmedUTR,
          amount: amountInINR,
          status: 'pending',
          cart,
          userId
        }),
      });

      const paymentData = await paymentRes.json();

      if (!paymentRes.ok) {
        setMessage(`❌ ${paymentData.message || 'Payment failed.'}`);
        setMessageType('warning');
        setShowMessage(true);
        return;
      }

      const orderRes = await fetch('https://ecom-production-9b18.up.railway.app/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          userId,
          orderId,
          utrNumber: paymentData.utrNumber || trimmedUTR,
          paymentStatus: paymentData.status || 'pending',
          deliveryStatus: 'pending',
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
        setMessageType('warning');
        setShowMessage(true);
        return;
      }

      await fetch(`https://ecom-production-9b18.up.railway.app/api/cart/${userId}`, {
        method: 'DELETE',
      });

      localStorage.removeItem('cart');

      // ✅ Redirect to orders page with success message
      navigate('/orders', {
        state: {
          message: '✅ Payment successful. Order confirmation will take 1 to 12 hours.',
          messageType: 'success'
        }
      });

    } catch (err) {
      console.error(err);
      setMessage('❌ Network error. Please try again.');
      setMessageType('warning');
      setShowMessage(true);
    } finally {
      setLoading(false); // 🔓 Re-enable after response
    }
  };


  const closeMessageBox = () => {
    setShowMessage(false);
    if (messageType === 'success') {
      navigate('/');
    }
  };

  return (
    <div className="payments-container">
      <h2 className="text-center">💳 Payment for Order #{orderId}</h2>

      <p className="text-center mt-3">
        The total cart value is ${totalAmount} (USD). At the current exchange rate of ₹{USD_TO_INR} per dollar, the total payable amount is INR ₹{amountInINR}.
      </p>

      <div className="qr-section text-center">
        <h5>Scan to Pay ₹{amountInINR}</h5>
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
        {/* <button className="btn btn-primary w-100 mt-2" onClick={handleConfirm}>
          Confirm Payment
        </button> */}
        <button
          className="btn btn-primary w-100 mt-2"
          onClick={handleConfirm}
          disabled={loading} // 🚫 Disable while loading
        >
          {loading ? 'Processing...' : 'Confirm Payment'}
        </button>

      </div>

      {/* Floating Message Box */}
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
          <button onClick={closeMessageBox}>OK</button>
        </div>
      )}
    </div>
  );
};

export default Payments;
