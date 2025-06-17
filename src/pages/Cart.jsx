import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './All.css';
import axios from 'axios';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  // Load cart from backend
  useEffect(() => {
    if (userId) {
      axios.get(`http://150.230.134.36:5000/api/cart/${userId}`)
      //axios.get(`https://ecom-production-ca19.up.railway.app/api/cart/${userId}`)
        .then((res) => setCart(res.data))
        .catch((err) => console.error("Error loading cart:", err));
    }
  }, [userId]);

  // Sync cart to backend
  const syncCart = (updatedCart) => {
    setCart(updatedCart);
    axios.put(`http://150.230.134.36:5000/api/cart/${userId}`, updatedCart)
    //axios.put(`https://ecom-production-ca19.up.railway.app/api/cart/${userId}`, updatedCart)
      .catch((err) => console.error("Error syncing cart:", err));
  };

  // Increase item quantity
  const incrementQuantity = (product_id) => {
    const updatedCart = cart.map((item) =>
      item.product_id === product_id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    syncCart(updatedCart);
  };

  // Decrease item quantity (min 1)
  const decrementQuantity = (product_id) => {
    const updatedCart = cart.map((item) =>
      item.product_id === product_id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    syncCart(updatedCart);
  };

  // Remove item
  const removeItem = (product_id) => {
    const updatedCart = cart.filter((item) => item.product_id !== product_id);
    syncCart(updatedCart);

    axios.delete(`http://150.230.134.36:5000/api/cart/${userId}/${product_id}`)
    //axios.delete(`https://ecom-production-ca19.up.railway.app/api/cart/${userId}/${product_id}`)
      .catch((err) => console.error("Error deleting item:", err));
  };

  // Calculate total
  const calculateTotal = () => {
    return cart
      .reduce((total, item) => total + item.product_price * item.quantity, 0)
      .toFixed(2);
  };

  return (
    <div className="cart-container">
      <h2 className="cart-title">🛒 Your Shopping Cart</h2>

      {cart.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.product_id} className="cart-item">
                <img src={item.product_image} alt={item.product_name} className="cart-item-image" />
                <div className="cart-item-details">
                  <h4 className="cart-item-title">{item.product_name}</h4>
                  <p className="cart-item-price">Price: <strong>₹{item.product_price}</strong></p>

                  <div className="cart-quantity">
                    <button className="quantity-btn decrease" onClick={() => decrementQuantity(item.product_id)}>-</button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button className="quantity-btn increase" onClick={() => incrementQuantity(item.product_id)}>+</button>
                  </div>

                  <p className="cart-item-subtotal">
                    Subtotal: <strong>₹{(item.product_price * item.quantity).toFixed(2)}</strong>
                  </p>
                </div>

                <button className="remove-btn" onClick={() => removeItem(item.product_id)}>🗑️ Remove</button>
              </div>
            ))}
          </div>

          <div className="text-end">
            <h4>Total: ₹{calculateTotal()}</h4>
            {/* <button className="btn btn-primary mt-3" onClick={() => navigate('/checkout')}>
              Proceed to Checkout
            </button> */}

            <button
              className="btn btn-primary mt-3"
              onClick={() => navigate('/checkout', {
                state: {
                  cart: cart,
                  total: calculateTotal()
                }
              })}
            >
              Proceed to Checkout
            </button>


          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
