import React, { useState, useEffect } from "react";
import './Navbar.css'
import logo from '../assets/mini-logo.png'
import { IoMdSearch } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import { useSearch } from '../context/SearchContext';

const Navbar = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [username, setUsername] = useState("Login");
    const navigate = useNavigate();
    const { setSearchTerm } = useSearch();
    const [searchInput, setSearchInput] = useState('');

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchTerm(searchInput);
    };

    return (
        <>
            <nav className="nav-bar">
                <div className="main-nav">
                    <div className="nav-logo">
                        <img src={logo} alt=""/>
                        <div className="logo-title">Online Pharma Tracker</div>
                    </div>
                    <div className="nav-search">
                        <div className="nav-search-input">
                            <form className="search-form d-flex align-items-center" onSubmit={handleSearch}>
                                <input 
                                    type="text" 
                                    name="query" 
                                    placeholder="Search" 
                                    title="Enter search keyword"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                />
                                <button type="submit" title="Search"><IoMdSearch/></button>
                            </form>
                        </div>
                    </div>
                    <div 
                        className="userName-login" 
                        onClick={() => setShowDropdown(!showDropdown)}
                    >
                        <FaUserCircle/>
                        <span className="username"></span>
                        {showDropdown && (
                            <div className="dropdown-menu">
                                <button onClick={handleLogout}>Logout<IoIosLogOut /></button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;