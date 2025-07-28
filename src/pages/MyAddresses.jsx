// MyAddresses.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyAddresses.css";
import { Link } from "react-router-dom";


const MyAddresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [error, setError] = useState("");

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!userId || !token) {
      setError("User not authenticated.");
      return;
    }

    fetchAddresses();
  }, [userId, token]);

  const fetchAddresses = () => {
    axios
       .get(`https://ecom-production-8da0.up.railway.app/api/address/user/${userId}`, {
      //.get(`https://ecom-production-ca19.up.railway.app/api/address/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setAddresses(res.data.addresses);
      })
      .catch((err) => {
        setError("Failed to load addresses.");
        console.error(err);
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;

    axios
      .delete(`https://ecom-production-8da0.up.railway.app/api/address/${id}`, {
      //.delete(`https://ecom-production-ca19.up.railway.app/api/address/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        fetchAddresses();
      })
      .catch((err) => {
        setError("Failed to delete address.");
        console.error(err);
      });
  };

  const handleEdit = (id) => {
    window.location.href = `/edit-address/${id}`; // redirect to edit page
  };

  return (
    <div className="address-list-container">
      <h2>My Saved Addresses</h2>
      {error && <p className="error">{error}</p>}
      {addresses.length === 0 && !error && <p>No addresses found.</p>}
      <ul>
        {addresses.map((address) => (
          <li key={address.id} className="address-card">
            <p><strong>{address.name}</strong></p>
            <p>{address.addressLine}</p>
            <p>{address.landmark}</p>
            <p>{address.city}, {address.state} - {address.pincode}</p>
            <p>📞 {address.phone}</p>
            <div className="address-actions">
              <button onClick={() => handleEdit(address.id)} className="edit-btn">Edit</button>
              <button onClick={() => handleDelete(address.id)} className="delete-btn">Delete</button>
            </div>
          </li>
        ))}
      </ul>
      <div style={{ textAlign: "right", marginBottom: "1rem" }}>
        <Link
          to="/addaddress"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          ➕ Add New Address
        </Link>
      </div>

    </div>
  );
};

export default MyAddresses;
