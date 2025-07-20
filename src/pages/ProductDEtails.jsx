import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './All.css'; // Assuming your custom CSS is in All.css

const ProductDEtails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const userId = localStorage.getItem("userId");
  const [wishlist, setWishlist] = useState([]);

  const [showMessage, setShowMessage] = useState(false);
  const [messageType, setMessageType] = useState("success"); // or 'warning'
  const [message, setMessage] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));
  // const token = localStorage.getItem("token");
  // useEffect(() => {
  //   axios.get(`https://fakestoreapi.com/products/${id}`)
  //     .then(res => setProduct(res.data))
  //     .catch(err => console.error("Error fetching product:", err));
  // }, [id]);

  useEffect(() => {
    if (!userId || !token) {
      // navigate("/login");
      // return;
      setMessage("Please log in to continue");
      setMessageType("warning");
      setShowMessage(true);
      return;
    }
    const fetchProduct = async () => {
      try {
        const res = await fetch("/products.json"); // Local JSON file
        const data = await res.json();

        const foundProduct = data.find((item) => item.id === parseInt(id));
        setProduct(foundProduct || null);
      } catch (err) {
        console.error("Error loading product:", err);
      }
    };

    fetchProduct();
  }, [id]);



  const handleWishlistToggle = async (product) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setMessage("Please log in to add items to your wishlist.");
      setMessageType("warning");
      setShowMessage(true);
      return;
    }

    const alreadyWishlisted = wishlist.includes(product.id);

    try {
      if (alreadyWishlisted) {
        await fetch(`http://localhost:5000/wishlist/${userId}/${product.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });
        setWishlist(wishlist.filter(id => id !== product.id));
      } else {
        await fetch("http://localhost:5000/wishlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            userId,
            product_id: product.id,
            product_name: product.title,
            product_price: product.price,
            product_image: product.image
          })
        });
        setWishlist([...wishlist, product.id]);
      }
    } catch (err) {
      console.error("Wishlist error:", err);
      setMessage("Something went wrong with the wishlist.");
      setMessageType("warning");
      setShowMessage(true);
    }
  };


  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    fetch(`http://localhost:5000/wishlist/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        const ids = data.map(item => item.product_id);
        setWishlist(ids);
      })
      .catch(err => console.error("Error loading wishlist:", err));
  }, []);




  const addToCart = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/cart/${userId}`);
      //const res = await axios.get(`https://ecom-production-ca19.up.railway.app/api/cart/${userId}`);
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
      //await axios.put(`https://ecom-production-ca19.up.railway.app/api/cart/${userId}`, updatedCart);
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

  // return (
  //   <div className="product-details-container">
  //     <div className="product-details">

  //       <img src={product.image} alt={product.title} className="product-image" />
  //       <div className="product-info">

  //         <h2 className="product-title">{product.title}</h2>
  //         <p className="product-category">Category: {product.category}</p>
  //         <p className="product-description">{product.description}</p>
  //         <p className="product-price">Price: <strong>₹{product.price}</strong></p>
  //         <p className="product-rating">Rating: {product.rating.rate} ⭐ ({product.rating.count} reviews)</p>
  //         <button className="add-to-cart-btn" onClick={addToCart}>
  //           Add to Cart
  //         </button>
  //           <button
  //   className={`wishlist-btn ${wishlist.includes(product.id) ? 'filled' : 'empty'}`}
  //   onClick={() => handleWishlistToggle(product)}
  //   title={wishlist.includes(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
  // >
  //   {wishlist.includes(product.id) ? "❤️ Wishlisted" : "🤍 Wishlist"}
  // </button>

  //       </div>
  //     </div>

  //     {/* Floating Message Box */}
  //     {showMessage && (
  //       <div className={`message-box ${messageType}`}>
  //         {messageType === "success" ? (
  //           <>
  //             <span className="icon">✔️</span>
  //             <p>{message}</p>
  //           </>
  //         ) : (
  //           <>
  //             <span className="icon">⚠️</span>
  //             <p>{message}</p>
  //           </>
  //         )}
  //         <button onClick={closeMessageBox}>OK</button>
  //       </div>
  //     )}
  //   </div>
  // );

  // return (
  //   <div className="product-details-container">
  //     <div className="product-details">

  //       <img src={product.image} alt={product.title} className="product-image" />
  //       <div className="product-info">

  //         <h2 className="product-title">{product.title}</h2>
  //         <p className="product-category">Category: {product.category}</p>
  //         <p className="product-price">Price: <strong>₹{product.price}</strong></p>
  //         <p className="product-rating">Rating: {product.rating.rate} ⭐ ({product.rating.count} reviews)</p>

  //         <button className="add-to-cart-btn" onClick={addToCart}>
  //           Add to Cart
  //         </button>

  //         <button
  //           className={`wishlist-btn ${wishlist.includes(product.id) ? 'filled' : 'empty'}`}
  //           onClick={() => handleWishlistToggle(product)}
  //           title={wishlist.includes(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
  //         >
  //           {wishlist.includes(product.id) ? "❤️ Wishlisted" : "🤍 Wishlist"}
  //         </button>

  //         <hr />

  //         {/* Product Description */}
  //         <h3>Description</h3>
  //         <p className="product-description">{product.description}</p>

  //         {/* About This Product */}
  //         {product.about && (
  //           <>
  //             <h3>About this product</h3>
  //             <ul>
  //               {product.about.map((point, index) => (
  //                 <li key={index}>{point}</li>
  //               ))}
  //             </ul>
  //           </>
  //         )}

  //         {/* Specifications */}
  //         {product.specs && (
  //           <>
  //             <h3>Specifications</h3>
  //             <table className="specs-table">
  //               <tbody>
  //                 {Object.entries(product.specs).map(([key, value], index) => (
  //                   <tr key={index}>
  //                     <td><strong>{key.replace(/[:-]/g, "").trim()}</strong></td>
  //                     <td>{value}</td>
  //                   </tr>
  //                 ))}
  //               </tbody>
  //             </table>
  //           </>
  //         )}

  //       </div>
  //     </div>

  //     {/* Floating Message Box */}
  //     {showMessage && (
  //       <div className={`message-box ${messageType}`}>
  //         {messageType === "success" ? (
  //           <>
  //             <span className="icon">✔️</span>
  //             <p>{message}</p>
  //           </>
  //         ) : (
  //           <>
  //             <span className="icon">⚠️</span>
  //             <p>{message}</p>
  //           </>
  //         )}
  //         <button onClick={closeMessageBox}>OK</button>
  //       </div>
  //     )}
  //   </div>
  // );



  // return (
  //   <div className="product-details-wrapper">
  //     <div className="product-card">
  //       <div className="product-left">
  //         <img src={product.image} alt={product.title} className="product-image-large" />
  //       </div>

  //       <div className="product-right">
  //         <h2 className="product-title">{product.title}</h2>
  //         <p className="product-category">📂 {product.category}</p>

  //         <div className="product-price-rating">
  //           <span className="product-price">₹{product.price}</span>
  //           <span className="product-rating">
  //             ⭐ {product.rating.rate} ({product.rating.count} reviews)
  //           </span>
  //         </div>

  //         <p className="product-description">{product.description}</p>

  //         {product.about && (
  //           <div className="product-section">
  //             <h4>🧵 About this product</h4>
  //             <ul>
  //               {product.about.map((point, index) => (
  //                 <li key={index}>{point}</li>
  //               ))}
  //             </ul>
  //           </div>
  //         )}

  //         {product.specs && (
  //           <div className="product-section">
  //             <h4>📋 Specifications</h4>
  //             <table className="specs-table">
  //               <tbody>
  //                 {Object.entries(product.specs).map(([key, value], index) => (
  //                   <tr key={index}>
  //                     <td><strong>{key.replace(/[:-]/g, "").trim()}</strong></td>
  //                     <td>{value}</td>
  //                   </tr>
  //                 ))}
  //               </tbody>
  //             </table>
  //           </div>
  //         )}

  //         <div className="product-actions">
  //           <button className="add-to-cart-btn" onClick={addToCart}>🛒 Add to Cart</button>
  //           <button
  //             className={`wishlist-btn ${wishlist.includes(product.id) ? 'filled' : 'empty'}`}
  //             onClick={() => handleWishlistToggle(product)}
  //           >
  //             {wishlist.includes(product.id) ? "❤️ Wishlisted" : "🤍 Wishlist"}
  //           </button>
  //         </div>
  //       </div>
  //     </div>

  //     {showMessage && (
  //       <div className={`message-box ${messageType}`}>
  //         {messageType === "success" ? (
  //           <>
  //             <span className="icon">✔️</span>
  //             <p>{message}</p>
  //           </>
  //         ) : (
  //           <>
  //             <span className="icon">⚠️</span>
  //             <p>{message}</p>
  //           </>
  //         )}
  //         <button onClick={closeMessageBox}>OK</button>
  //       </div>
  //     )}
  //   </div>
  // );




  return (
    <div className="product-details-container">
      <div className="product-card-vertical">

        <img src={product.image} alt={product.title} className="product-image-top" />

        <div className="product-info-block">
          <h2 className="product-title">{product.title}</h2>
          <p className="product-category">📂 {product.category}</p>

          {/* <div className="price-rating-row">
          <span className="product-price">₹{product.price}</span>
          <span className="product-rating">⭐ {product.rating.rate} ({product.rating.count} reviews)</span>
        </div>

        <p className="product-description">{product.description}</p> */}
          <div className="price-rating-row">
            <span className="product-price">₹{product.price}</span>
            <span className="product-rating">⭐ {product.rating.rate} ({product.rating.count} reviews)</span>
          </div>

          <div className="product-actions below-price">
            <button className="add-to-cart-btn" onClick={addToCart}>🛒 Add to Cart</button>
            <button
              className={`wishlist-btn ${wishlist.includes(product.id) ? 'filled' : 'empty'}`}
              onClick={() => handleWishlistToggle(product)}
            >
              {wishlist.includes(product.id) ? "❤️ Wishlisted" : "🤍 Wishlist"}
            </button>
          </div>

          <p className="product-description">{product.description}</p>


          {product.about && (
            <div className="product-section">
              <h4>🧵 About this product</h4>
              {/* <ul className="about-list">
                {product.about.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul> */}
              <ul className="about-list">
                {product.about.map((point, index) => {
                  const [key, ...rest] = point.split(":");
                  const value = rest.join(":").trim();

                  return (
                    <li key={index}>
                      <span className="about-key">{key}:</span> {value}
                    </li>
                  );
                })}
              </ul>

            </div>
          )}

          {product.specs && (
            <div className="product-section">
              <h4>📋 Specifications</h4>
              <table className="specs-table">
                <tbody>
                  {Object.entries(product.specs).map(([key, value], index) => (
                    <tr key={index}>
                      <td><strong>{key.replace(/[:-]/g, "").trim()}</strong></td>
                      <td>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* <div className="product-actions">
            <button className="add-to-cart-btn" onClick={addToCart}>🛒 Add to Cart</button>
            <button
              className={`wishlist-btn ${wishlist.includes(product.id) ? 'filled' : 'empty'}`}
              onClick={() => handleWishlistToggle(product)}
            >
              {wishlist.includes(product.id) ? "❤️ Wishlisted" : "🤍 Wishlist"}
            </button>
          </div> */}
        </div>
      </div>

      {/* Floating Message Box (Keep as-is) */}
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
