import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './All.css';

function Nav({ userId, handleLogout }) {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    let interval;

    const fetchCartCount = () => {
      if (userId) {
        axios
        .get(`http://localhost:5000/api/cart/count/${userId}`)
          //.get(`https://ecom-production-ca19.up.railway.app/api/cart/count/${userId}`)
          .then((res) => setCartCount(res.data.count))
          .catch((err) => console.error("Error fetching cart count:", err));
      }
    };

    


    fetchCartCount();
    if (userId) interval = setInterval(fetchCartCount, 500);

    return () => clearInterval(interval);
  }, [userId]);

  const logoutUser = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    handleLogout();
    navigate('/login');
  };

  // Collapse navbar on mobile after link click
  // const collapseNavbar = () => {
  //   const navbarToggler = document.querySelector('.navbar-toggler');
  //   const navbarCollapse = document.getElementById('navbarSupportedContent');
  //   if (navbarCollapse.classList.contains('show')) {
  //     navbarToggler.click();
  //   }
  // };

//   const collapseNavbar = () => {
//   const navbarToggler = document.querySelector('.navbar-toggler');
//   const navbarCollapse = document.getElementById('navbarSupportedContent');

//   if (window.innerWidth < 992 && navbarCollapse.classList.contains('show')) {
//     setTimeout(() => {
//       navbarToggler.click();
//     }, 50); // gives Bootstrap time to register the state
//   }
// };


const collapseNavbar = () => {
  const navbarCollapse = document.getElementById('navbarSupportedContent');

  if (window.innerWidth < 992 && navbarCollapse?.classList.contains('show')) {
    const collapseInstance =
      bootstrap.Collapse.getInstance(navbarCollapse) ||
      new bootstrap.Collapse(navbarCollapse, { toggle: false });

    collapseInstance.hide();
  }
};


// useEffect(() => {
//   const handleOutsideClick = (e) => {
//     const navbarCollapse = document.getElementById('navbarSupportedContent');
//     const navbarToggler = document.querySelector('.navbar-toggler');

//     if (!navbarCollapse || !navbarToggler) return;

//     const isNavbarOpen = navbarCollapse.classList.contains('show');
//     const isClickInsideMenu = navbarCollapse.contains(e.target);
//     const isClickOnToggler = navbarToggler.contains(e.target);

//     if (isNavbarOpen && !isClickInsideMenu && !isClickOnToggler) {
//       collapseNavbar(); // ✅ Call your existing function
//     }
//   };

//   document.addEventListener('click', handleOutsideClick);
//   return () => document.removeEventListener('click', handleOutsideClick);
// }, []);


useEffect(() => {
  const handleOutsideClick = (e) => {
    const navbarCollapse = document.getElementById('navbarSupportedContent');
    const navbarToggler = document.querySelector('.navbar-toggler');

    if (!navbarCollapse || !navbarToggler) return;

    const isNavbarOpen = navbarCollapse.classList.contains('show');
    const isClickInsideMenu = navbarCollapse.contains(e.target);
    const isClickOnToggler = navbarToggler.contains(e.target);

    if (isNavbarOpen && (!isClickInsideMenu || isClickOnToggler)) {
      collapseNavbar(); // ✅ Close if clicked outside or on toggler
    }
  };

  document.addEventListener('click', handleOutsideClick);
  return () => document.removeEventListener('click', handleOutsideClick);
}, []);







  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/" onClick={collapseNavbar}>Shopping</Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {['Home', 'Products', 'Contact', 'Creator'].map((page) => (
              <li className="nav-item" key={page}>
                <Link className="nav-link" to={`/${page.toLowerCase()}`} onClick={collapseNavbar}>
                  {page}
                </Link>
              </li>
            ))}
            <li className="nav-item">
              <Link className="nav-link" to="/orders" onClick={collapseNavbar}>
                My Orders
              </Link>
            </li>
                        <li className="nav-item">
              <Link className="nav-link" to="/wishlist" onClick={collapseNavbar}>
                Wishlist
              </Link>
            </li>
          </ul>

          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {!userId ? (
              <li className="nav-item">
                <Link className="nav-link" to="/login" onClick={collapseNavbar}>
                  Login
                </Link>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard" onClick={collapseNavbar}>
                    User Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <button className="nav-link btn btn-link" onClick={() => { logoutUser(); collapseNavbar(); }}>
                    Logout
                  </button>
                </li>
              </>
            )}
            <li className="nav-item">
              <Link className="nav-link position-relative" to="/cart" onClick={collapseNavbar}>
                Cart 🛒
                {cartCount > 0 && (
                  <span className="cart-badge position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cartCount}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
