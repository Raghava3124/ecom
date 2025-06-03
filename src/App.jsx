import './App.css';
import Nav from './pages/Nav';
import Card from './pages/Card';
import { Route, Routes, useNavigate } from 'react-router';
import Home from './pages/Home';
import Products from './pages/Products';
import Contact from './pages/Contact';
import ProductDEtails from './pages/ProductDEtails';
import Creator from './pages/Creator';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Error from './pages/Error';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserDashboard from './pages/UserDashboard';
import { useState, useEffect } from 'react';
import Payments from './pages/Payments';
import Orders from './pages/Orders';
import MyAddresses from './pages/MyAddresses';
import AddAddress from './pages/AddAddress';
import ViewOrders from './pages/ViewOrders';
import EditAddress from './pages/EditAddress';
import isTokenExpired from './util/auth';
// import { Link, useNavigate } from "react-router-dom";

function App() {
  const [userId, setUserId] = useState(null);
  const [isLogged, setIsLogged] = useState(0);

  const navigate = useNavigate();


  // useEffect(() => {
  //   const id = localStorage.getItem("userId");
  //   if (id) {
  //     setUserId(id);
  //     setIsLogged(1);
  //   } else {
  //     setIsLogged(0);
  //   }
  // }, []);


    useEffect(() => {
    const id = localStorage.getItem("userId");
    if (id) {
      setUserId(id);
      setIsLogged(1);
    } else {
      setIsLogged(0);
    }

    if (isTokenExpired()) {
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            navigate("/login");
        }
  }, []);




  const handleLogout = () => {
    setUserId(null);
    setIsLogged(0);
  };

  const handleLogin = (id) => {
    setUserId(id);
    setIsLogged(1);
  };

  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  // const [cartCount, setCartCount] = useState(0);

  // const updateCartCount = async () => {
  //   if (userId) {
  //     try {
  //       const res = await axios.get(`http://localhost:5000/api/cart/count/${userId}`);
  //       setCartCount(res.data.count);
  //     } catch (error) {
  //       console.error("Failed to fetch cart count", error);
  //     }
  //   }
  // };

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setMessage(`${product.title} is already in the cart.`);
      setMessageType('warning');
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
      setMessage(`${product.title} added to the cart.`);
      setMessageType('success');
    }
    setShowMessage(true);
  };

  const closeMessageBox = () => {
    setShowMessage(false);
    setMessage('');
    setMessageType('');
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (

    <div>
      <Nav cartCount={cart.length} userId={userId} handleLogout={handleLogout} isLogged={isLogged} />
      {/* <Nav cartCount={cartCount} userId={userId} handleLogout={handleLogout} isLogged={isLogged} /> */}

      <Routes>
        <Route path="/home" element={<Home addToCart={addToCart} />} />
        <Route path="/" element={<Home addToCart={addToCart} />} />
        <Route path="/products/:id" element={<ProductDEtails addToCart={addToCart} cart={cart} />} />
        <Route path="/products" element={<Card addToCart={addToCart} cart={cart} />} />
        {/* <Route path="/products" element={<Card userId={userId} updateCartCount={updateCartCount} />} />
        <Route path="/products/:id" element={<ProductDEtails userId={userId} updateCartCount={updateCartCount} />} /> */}
        <Route path="/payments" element={<Payments />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/vieworder/:orderId" element={<ViewOrders />} />
        <Route path="/edit-address/:id" element={<EditAddress/>} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/creator" element={<Creator />} />
        <Route path="/myaddresses" element={<MyAddresses />} />
        <Route path="/addaddress" element={<AddAddress />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<UserDashboard userId={userId} />} />
        <Route path="/cart" element={<Cart cart={cart} updateCart={setCart} />} />
        <Route path="/checkout" element={<Checkout cart={cart} calculateTotal={calculateTotal} updateCart={setCart} />} />
        <Route path="*" element={<Error />} />
      </Routes>

      {showMessage && (
        <div className={`message-box ${messageType}`}>
          {messageType === 'success' ? (
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
}

export default App;
