import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./All.css";

const Wish = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return;
    const token = localStorage.getItem("token");


      fetch(`https://ecom-production-8da0.up.railway.app/wishlist/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
      .then((res) => res.json())
      .then((data) => setWishlistItems(data))
      .catch((err) => console.error("Error loading wishlist:", err));
  }, [userId]);

  const removeFromWishlist = async (productId) => {
    const token = localStorage.getItem("token");

    try {
      await fetch(`https://ecom-production-8da0.up.railway.app/wishlist/${userId}/${productId}`, {
        method: "DELETE",
          headers: {
    Authorization: `Bearer ${token}`
  }
      });

      setWishlistItems((prev) => prev.filter((item) => item.product_id !== productId));
    } catch (err) {
      console.error("Error removing from wishlist:", err);
    }
  };

  if (!userId) {
    return <p className="p-4">Please log in to view your wishlist.</p>;
  }

  return (
    <div className="p-4">
      <h3 className="mb-4">❤️ My Wishlist</h3>
      {wishlistItems.length === 0 ? (
        <p>You haven't added any items to your wishlist yet.</p>
      ) : (
        <div className="d-flex flex-wrap gap-4">
          {wishlistItems.map((item) => (
            <div key={item.product_id} className="card product-card" style={{ width: "18rem" }}>
              <div className="image-container" onClick={() => navigate(`/products/${item.product_id}`)}>
                <img
                  src={item.product_image}
                  className="card-img-top product-image"
                  alt={item.product_name}
                />
              </div>
              <div className="card-body">
                <h5 className="card-title">{item.product_name}</h5>
                <p className="card-text fw-bold price">₹{item.product_price}</p>
                <div className="d-flex justify-content-between">
                  <button
                    className="btn btn-danger"
                    onClick={() => removeFromWishlist(item.product_id)}
                  >
                    Remove ❤️
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/products/${item.product_id}`)}
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wish;
