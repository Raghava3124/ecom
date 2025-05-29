import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './All.css'; // Assuming your custom CSS is in All.css

const ProductDEtails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const userId = localStorage.getItem("userId");

  const [showMessage, setShowMessage] = useState(false);
  const [messageType, setMessageType] = useState("success"); // or 'warning'
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get(`https://fakestoreapi.com/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error("Error fetching product:", err));
  }, [id]);

  const addToCart = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/cart/${userId}`);
      const existingCart = res.data;

      const found = existingCart.find(item => item.product_id === product.id);

      let updatedCart;
      if (found) {
        updatedCart = existingCart.map(item =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        showFloatingMessage("Item already in cart, quantity increased", "warning");
      } else {
        const newItem = {
          userId: userId,
          product_id: product.id,
          product_name: product.title,
          product_price: product.price,
          product_image: product.image,
          quantity: 1
        };
        updatedCart = [...existingCart, newItem];
        showFloatingMessage("Item added to cart", "success");
      }

      await axios.put(`http://localhost:5000/api/cart/${userId}`, updatedCart);
    } catch (err) {
      console.error("Error updating cart:", err);
      // showFloatingMessage("Something went wrong", "warning");
      showFloatingMessage("Please login to continue", "warning");
    }
  };

  const showFloatingMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setShowMessage(true);
  };

  const closeMessageBox = () => {
    setShowMessage(false);
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="product-details-container">
      <div className="product-details">
        <img src={product.image} alt={product.title} className="product-image" />
        <div className="product-info">
          <h2 className="product-title">{product.title}</h2>
          <p className="product-category">Category: {product.category}</p>
          <p className="product-description">{product.description}</p>
          <p className="product-price">Price: <strong>${product.price}</strong></p>
          <p className="product-rating">Rating: {product.rating.rate} ⭐ ({product.rating.count} reviews)</p>
          <button className="add-to-cart-btn" onClick={addToCart}>
            Add to Cart
          </button>
        </div>
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

export default ProductDEtails;
