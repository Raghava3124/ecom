import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import * as bootstrap from "bootstrap";
import "./All.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [categories, setCategories] = useState([]);
  const [carouselImages, setCarouselImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const navigate = useNavigate();
  // const token = localStorage.getItem("token");
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    if (!userId || !token) {
      // navigate("/login");
      // return;
      setMessage("Please log in to continue");
      setMessageType("warning");
      setShowMessage(true);
      return;
    }


    //   fetch(`https://ecom-production-8da0.up.railway.app/wishlist/${userId}`)
    //     .then(res => res.json())
    //     .then(data => {
    //       const ids = data.map(item => item.product_id);
    //       setWishlist(ids);
    //     })
    //     .catch(err => console.error("Error loading wishlist:", err));
    // }, []);




    fetch(`https://ecom-production-8da0.up.railway.app/wishlist/${userId}`, {
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






  useEffect(() => {
    98
    const fetchData = async () => {
      try {
        //const res = await fetch("https://fakestoreapi.com/products");
        const res = await fetch("/products.json");
        const data = await res.json();
        setProducts(data);
        setCategories([...new Set(data.map((item) => item.category))]);
        setCarouselImages(data.slice(0, 10));
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const carouselElement = document.querySelector("#productCarousel");
    if (carouselElement) {
      const carousel = new bootstrap.Carousel(carouselElement, {
        interval: 2000,
        pause: "hover",
        wrap: true,
      });
      carousel.cycle();
    }
  }, [carouselImages]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const closeMessageBox = () => {
    setShowMessage(false);
    setMessage("");
    setMessageType("");
  };






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
        await fetch(`https://ecom-production-8da0.up.railway.app/wishlist/${userId}/${product.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          },
        });
        setWishlist(wishlist.filter(id => id !== product.id));
      } else {
        await fetch("https://ecom-production-8da0.up.railway.app/wishlist", {
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







  const addToCartHandler = async (product) => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      setMessage("Please log in to add items to your cart.");
      setMessageType("warning");
      setShowMessage(true);
      return;
    }

    try {
      const res = await fetch(`https://ecom-production-8da0.up.railway.app/api/cart/${userId}`);
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

      await fetch(`https://ecom-production-8da0.up.railway.app/api/cart/${userId}`, {
        //await fetch(`https://ecom-production-ca19.up.railway.app/api/cart/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
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

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center mt-5"><h3>Loading products...</h3></div>;
  }

  return (

    <div className="container mt-4">
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

      {/* Carousel */}
      <div id="productCarousel" className="carousel slide mb-4" data-bs-ride="carousel">
        <div className="carousel-indicators">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              type="button"
              data-bs-target="#productCarousel"
              data-bs-slide-to={index}
              className={index === 0 ? "active" : ""}
              aria-label={`Slide ${index + 1}`}
              style={{
                backgroundColor: "black",
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                border: "2px solid black",
              }}
            >
              <span
                style={{
                  backgroundColor: "white",
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                }}
              ></span>
            </button>
          ))}
        </div>
        <div className="carousel-inner">
          {carouselImages.map((item, index) => (
            <div
              key={item.id}
              className={`carousel-item ${index === 0 ? "active" : ""}`}
              onClick={() => navigate(`/products/${item.id}`)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={item.image}
                className="d-block w-100"
                alt={item.title}
                style={{ height: "300px", objectFit: "contain" }}
              />
            </div>
          ))}
        </div>

        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#productCarousel"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon custom-arrow" aria-hidden="true"></span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#productCarousel"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon custom-arrow" aria-hidden="true"></span>
        </button>
      </div>

      {/* Shop by Category */}
      <h2 className="text-center mb-4">👇Shop by Category👇</h2>
      {categories.map((category) => {
        const filteredCategoryProducts = filteredProducts.filter(
          (item) => item.category === category
        );


        return (
          
          <div key={category} className="mb-5">
            <h3 className="mt-4 mb-3 text-capitalize">{category}</h3>
            <div className="d-flex justify-content-between flex-wrap">
              {filteredCategoryProducts.length > 0 ? (
                filteredCategoryProducts.map((item) => (
                  <div
                    key={item.id}
                    className="card product-card"
                    style={{ width: "18rem" }}
                  >
                    <div
                      className="wishlist-icon"
                      onClick={() => handleWishlistToggle(item)}
                      title={wishlist.includes(item.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                    >
                      {wishlist.includes(item.id) ? "❤️" : "🤍"}
                    </div>

                    <div className="image-container" onClick={() => navigate(`/products/${item.id}`)}>
                      <img
                        src={item.image}
                        className="card-img-top product-image"
                        alt={item.title}
                      />
                    </div>
                    <div className="card-body">
                      <h5 className="card-title">{item.title}</h5>
                      <p className="card-text">{item.description.substring(0, 100)}...</p>
                      <p className="card-text fw-bold price">₹{item.price}</p>
                      <button
                        className="btn btn-primary buy-now-btn"
                        onClick={() => addToCartHandler(item)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No products found for "{searchTerm}".</p>
              )}
            </div>
          </div>
              
        );
      })}

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

export default Home;
