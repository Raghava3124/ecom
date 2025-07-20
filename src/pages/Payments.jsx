
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './All.css'; // Ensure message-box styling exists

const Payments = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, cart, totalAmount, selectedAddress } = location.state || {};

  const [loading, setLoading] = useState(false);

  const USD_TO_INR = 86;
  // const amountInINR = (totalAmount * USD_TO_INR).toFixed(2);
  //const amountInINR =totalAmount;


    const getTotalQuantity = (cart) => {
    return cart.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  const getDeliveryCharge = (qty) => {
    if (qty === 1) return 80;
    if (qty === 2) return 140;
    if (qty >= 3 && qty <= 4) return 200;
    if (qty >= 5 && qty <= 10) return 300;
    return 500;
  };
  const totalQuantity = getTotalQuantity(cart || []);
  const deliveryCharge = getDeliveryCharge(totalQuantity);
  const amountInINR = (Number(totalAmount) + deliveryCharge).toFixed(2);


  const [modalImage, setModalImage] = useState(null);

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

      //const paymentRes = await fetch('https://ecom-production-ca19.up.railway.app/api/payments', {
      const paymentRes = await fetch('http://localhost:5000/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
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

      //const orderRes = await fetch('https://ecom-production-ca19.up.railway.app/api/orders', {
      const orderRes = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
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

      //await fetch(`https://ecom-production-ca19.up.railway.app/api/cart/${userId}`, {
      await fetch(`http://localhost:5000/api/cart/${userId}`, {
        method: 'DELETE',
                headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      localStorage.removeItem('cart');

      // ✅ Redirect to orders page with success message
      navigate('/orders', {
        state: {
          message: '✅ Payment details recorded successfully. Order confirmation will take 1 to 12 hours.',
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

      {/* <p className="text-center mt-3">
        🛒 Total cart value: ₹{totalAmount} (INR). 💳 Proceed with payment to complete your purchase.
      </p> */}

      <div className="text-center mt-3">
        <p>🛒 Cart Total: ₹{totalAmount}</p>
        <p>📦 Total Items: {totalQuantity}</p>
        <p>🚚 Delivery Charges: ₹{deliveryCharge}</p>
        <h5>💳 Final Amount to Pay: ₹{amountInINR}</h5>
      </div>


      <div className="qr-section text-center">
        <h5>Scan to Pay ₹{amountInINR}</h5>
        <img src={qrUrl} alt="UPI QR Code" />
        <p><small>Payee: {payeeName} ({upiId})</small></p>
      </div>


      <div className="utr-confirmation mt-4">
        <label>Transaction UTR / UPI Ref Number:</label>
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

      <div className="utr-help mt-3">
        <h6>🧐 How to find your UTR number?</h6>
        <ul>
          <li>✅ UTR (Unique Transaction Reference) number is a **12-digit number** assigned to every successful UPI payment.</li>
          <li>🔢 It consists **only of numbers** — no alphabets or special characters.</li>
          <li>⚠️ Do **not enter** Transaction ID, Order ID, or Reference ID from the merchant site.</li>
          <li>📱 You can find the UTR number in the **transaction details/receipt** of your payment app.</li>
        </ul>

        <p><strong>📷 Sample UTR locations:</strong></p>
        <div className="utr-sample-images">
          <div>
            <img
              src="/images/googlepayupi.jpg"
              alt="GPay UTR example"
              className="utr-img"
              onClick={() => setModalImage('/images/gpay-utr.jpg')}
            />

            <p className="text-center small">Google Pay</p>
          </div>
          <div>
            <img
              src="/images/phonepayupi.jpg"
              alt="GPay UTR example"
              className="utr-img"
              onClick={() => setModalImage('/images/gpay-utr.jpg')}
            />

            <p className="text-center small">PhonePe</p>
          </div>
          <div>
            <img
              src="/images/paytmupi.jpg"
              alt="GPay UTR example"
              className="utr-img"
              onClick={() => setModalImage('/images/gpay-utr.jpg')}
            />

            <p className="text-center small">Paytm</p>
          </div>
        </div>
      </div>

    </div>

  );
};

export default Payments;
