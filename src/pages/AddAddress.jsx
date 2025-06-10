import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddAddress.css";
import { useNavigate } from "react-router-dom";


const AddAddress = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    pincode: "",
    village: "",
    district: "",
    state: "",
    addressLine: "",
    landmark: ""
  });

  const [message, setMessage] = useState("");
  const [villages, setVillages] = useState([]);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();




  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Autofill district, state, and list villages on pincode change
  useEffect(() => {
    const fetchAddressDetails = async () => {
      if (formData.pincode.length === 6 && /^\d{6}$/.test(formData.pincode)) {
        try {
          const res = await axios.get(`https://api.postalpincode.in/pincode/${formData.pincode}`);
          const data = res.data[0];

          if (data.Status === "Success" && data.PostOffice.length > 0) {
            const postOffices = data.PostOffice;

            setVillages(postOffices.map((p) => p.Name));
            setFormData((prev) => ({
              ...prev,
              district: postOffices[0].District,
              state: postOffices[0].State,
              village: "" // reset previously selected village
            }));
          } else {
            setMessage("Invalid Pincode or no location found.");
            setVillages([]);
          }
        } catch (error) {
          console.error("Failed to fetch location from pincode:", error);
          setMessage("Error fetching location from pincode.");
        }
      }
    };

    fetchAddressDetails();
  }, [formData.pincode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const { name, phone, pincode, district, state, village, addressLine } = formData;

    if (!name || !phone || !pincode || !district || !state || !village || !addressLine) {
      setMessage("Please fill all required fields.");
      return;
    }

    if (!/^\d{6}$/.test(pincode)) {
      setMessage("Pincode must be a 6-digit number.");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      setMessage("Phone number must be a 10-digit number.");
      return;
    }

    try {
      await axios.post(
        // "http://localhost:5000/api/address",
        "http://152.57.239.121:5000/api/address",
        {
          ...formData,
          city: formData.village,
          userId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      setMessage("Address added successfully!");
      setTimeout(() => {
        navigate(-1); // Go back to previous page
      }, 1500);
      setFormData({
        name: "",
        phone: "",
        pincode: "",
        village: "",
        district: "",
        state: "",
        addressLine: "",
        landmark: ""
      });
      setVillages([]);
    } catch (err) {
      console.error(err);
      setMessage("Failed to add address.");
    }
  };

  return (
    <div className="add-address-container">
      <h2>Add New Address</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit} className="address-form">
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required />
        <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" required />
        <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="Pincode" required />

        {villages.length > 0 && (
          <select name="village" value={formData.village} onChange={handleChange} required>
            <option value="">Select Village/Post Office</option>
            {villages.map((village, index) => (
              <option key={index} value={village}>{village}</option>
            ))}
          </select>
        )}

        <input type="text" name="district" value={formData.district} readOnly placeholder="District" />
        <input type="text" name="state" value={formData.state} readOnly placeholder="State" />
        <textarea name="addressLine" value={formData.addressLine} onChange={handleChange} placeholder="Address Line" required />
        <input type="text" name="landmark" value={formData.landmark} onChange={handleChange} placeholder="Landmark (optional)" />
        <button type="submit">Add Address</button>
      </form>
    </div>
  );
};

export default AddAddress;
