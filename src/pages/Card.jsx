import React, { useEffect, useState } from "react";
import "./All.css";
import { useNavigate } from "react-router";

const Card = ({ addToCart, cart }) => {
  const [prod, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const navigate = useNavigate();

  // useEffect(() => {
  //   fetch("https://fakestoreapi.com/products")
  //     .then((res) => res.json())
  //     .then((data) => setProducts(data));
  // }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };



  useEffect(() => {
    fetch("/products.json") // ✅ Local file from public folder
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Failed to load local products:", err));
  }, []);






  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

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





  const handleAddToCart = async (product) => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      setMessage("Please log in to add items to your cart.");
      setMessageType("warning");
      setShowMessage(true);
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/cart/${userId}`);
      //const res = await fetch(`https://ecom-production-ca19.up.railway.app/api/cart/${userId}`);
      const existingCart = await res.json();

      const found = existingCart.find((item) => item.product_id === product.id);

      let updatedCart;

      if (found) {
        updatedCart = existingCart.map((item) =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        setMessage(`${product.title} is already in the cart. Quantity increased.`);
        setMessageType("warning");
      } else {
        const newItem = {
          userId: userId,
          product_id: product.id,
          product_name: product.title,
          product_price: product.price,
          product_image: product.image,
          quantity: 1,
        };
        updatedCart = [...existingCart, newItem];
        setMessage(`${product.title} added to the cart.`);
        setMessageType("success");
      }

      await fetch(`http://localhost:5000/api/cart/${userId}`, {
        //await fetch(`https://ecom-production-ca19.up.railway.app/api/cart/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedCart),
      });

      setShowMessage(true);
    } catch (error) {
      console.error("Error updating cart:", error);
      setMessage("Something went wrong while adding to the cart.");
      setMessageType("warning");
      setShowMessage(true);
    }
  };

  const closeMessageBox = () => {
    setShowMessage(false);
    setMessage("");
    setMessageType("");
  };

  const filteredProducts = prod.filter((pd) =>
    pd.title.toLowerCase().includes(searchTerm.toLowerCase())
  );














  const handleWishlistToggle = async (product) => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

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


  return (

      <div className="p-4">
        {/* Search Bar */}
        <div className="mb-4 d-flex justify-content-end">
          <input
            type="text"
            className="form-control"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ width: "300px" }}
          />
        </div>

        {/* Product Cards */}
        <div className="d-flex justify-content-between flex-wrap">
          {filteredProducts.map((pd) => (
            <div
              key={pd.id}
              className="card product-card"
              style={{ width: "18rem" }}
            >
              <div
                className="wishlist-icon"
                onClick={() => handleWishlistToggle(pd)}
                title={wishlist.includes(pd.id) ? "Remove from Wishlist" : "Add to Wishlist"}
              >
                {wishlist.includes(pd.id) ? "❤️" : "🤍"}
              </div>



              <div className="image-container" onClick={() => navigate(`/products/${pd.id}`)}>
                <img
                  src={pd.image}
                  className="card-img-top product-image"
                  alt={pd.title}
                />
              </div>
              <div className="card-body">
                <h5 className="card-title">{pd.title}</h5>
                <p className="card-text">
                  {pd.description.substring(0, 100)}...
                </p>
                <p className="card-text fw-bold price">₹{pd.price}</p>
                <div className="d-flex justify-content-between">
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/products/${pd.id}`)}
                  >
                    View
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={() => handleAddToCart(pd)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
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

export default Card;
