import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ViewOrders.css'; // Optional: if you want to move styles separately
// import './All.css';

const steps = ['pending', 'shipped', 'in transit', 'delivered'];

const ViewOrders = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`https://ecom-production-8da0.up.railway.app/api/orders/${orderId}`, {
          //const res = await axios.get(`https://ecom-production-ca19.up.railway.app/api/orders/${orderId}`, {
          headers: {
            Authorization:  `Bearer ${token}`,
          },
        });
        setOrder(res.data);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 403 || err.response?.status === 401) {
          navigate('/error'); // Unauthorized
        } else {
          setError('Failed to fetch order');
        }
      }
    };

    fetchOrder();
  }, [orderId, navigate]);

  const getStepStatus = (step) => {
    if (!order) return 'step';
    if (step === order.deliveryStatus) return 'step active';
    const currentIndex = steps.indexOf(order.deliveryStatus);
    const stepIndex = steps.indexOf(step);
    return stepIndex < currentIndex ? 'step completed' : 'step';
  };

  // return (
  //   <div className="container mt-4">
  //     <h3>🚚 Order Delivery Status</h3>
  //     <p><strong>Order ID:</strong> {order?.orderId}</p>

  //     {error ? (
  //       <div className="alert alert-danger">{error}</div>
  //     ) : !order ? (
  //       <p>Loading...</p>
  //     ) : (
  //       <div className="steps-container">
  //         {steps.map((step, index) => (
  //           <div key={index} className={getStepStatus(step)}>
  //             <div className="circle">{index + 1}</div>
  //             <div className="label">{step.toUpperCase()}</div>
  //             {index < steps.length - 1 && <div className="line"></div>}
  //           </div>
  //         ))}
  //       </div>
  //     )}
  //   </div>
  // );



  return (
    <div className="container mt-4">
      <h3>🚚 Order Delivery Status</h3>
      <p><strong>Order ID:</strong> {order?.orderId}</p>

      {error ? (
        <div className="alert alert-danger">{error}</div>
      ) : !order ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* <div className="steps-container">
          {steps.map((step, index) => (
            <div key={index} className={getStepStatus(step)}>
              <div className="circle">{index + 1}</div>
              <div className="label">{step.toUpperCase()}</div>
              {index < steps.length - 1 && <div className="line"></div>}
            </div>
          ))}
        </div> */}

          <div className="status-tracker">
            {steps.map((step, index) => {
              const isCompleted = steps.indexOf(order.deliveryStatus) > index;
              const isActive = steps.indexOf(order.deliveryStatus) === index;

              return (
                <div key={index} className={`status-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
                  <div className="status-circle">{isCompleted ? '✔️' : index + 1}</div>
                  <div className="status-label">{step.toUpperCase()}</div>
                  {index < steps.length - 1 && <div className="status-line" />}
                </div>
              );
            })}
          </div>


          {/* ✅ NEW DETAILS SECTION */}
          <div className="mt-4">
            <h5>📦 Delivery Details</h5>
            <p><strong>Name:</strong> {order.name}</p>
            <p><strong>Phone:</strong> {order.phone}</p>
            <p><strong>Address:</strong> {order.addressLine}, {order.landmark}</p>
            <p><strong>City/Pincode:</strong> {order.city} - {order.pincode}, {order.state}</p>

            <h5 className="mt-3">💳 Payment</h5>
            <p><strong>UTR Number:</strong> {order.utrNumber}</p>
            <p>
              <strong>Payment Status:</strong>{' '}
              <span
                style={{
                  color:
                    order.paymentStatus === 'success'
                      ? 'green'
                      : order.paymentStatus === 'failed'
                        ? 'red'
                        : '#ffc107',
                }}
              >
                {order.paymentStatus}
              </span>
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default ViewOrders;
