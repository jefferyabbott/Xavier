import React from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../services/auth/authSlice.js";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    navigate("/login");
    dispatch(logout());
  };

  return (
    <nav className='navbar navbar-dark bg-dark header'>
      <div className='container-fluid'>
        <div className='navbar-brand logo'>
          <img
            className='logo'
            src='/logo192.png'
            alt='Xavier satellite logo'
          />
          <h1>Xavier</h1>
        </div>
        <ul>
          {user ? (
            <li>
              <button className='btn' onClick={onLogout}>
                <FaSignOutAlt /> Logout
              </button>
            </li>
          ) : (
            <li></li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
