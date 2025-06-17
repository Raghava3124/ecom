import React, { useEffect, useState } from 'react';

const Products = () => {
  const [prod, setProducts] = useState([]);

  const fetchData = () => {
    fetch('/products.json') // local file in public folder
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error loading local products:", err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", padding: "20px" }}>
      {prod.map((pd) => (
        <div key={pd.id} style={{ border: "1px solid #ccc", padding: "10px", width: "200px" }}>
          <img src={pd.image} alt={pd.title} height={100} style={{ objectFit: "contain", width: "100%" }} />
          <h5>{pd.title.slice(0, 40)}...</h5>
          <p><strong>₹{pd.price}</strong></p>
        </div>
      ))}
    </div>
  );
};

export default Products;
