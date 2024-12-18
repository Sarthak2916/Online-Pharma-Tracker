import React, { useState } from "react";
import './Sidebar.css'
import { IoMdSearch } from "react-icons/io";
import { RxDashboard } from "react-icons/rx";
import { MdInventory2 } from "react-icons/md";
import { Link, useLocation } from 'react-router-dom';
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { IoReceiptOutline } from "react-icons/io5";
import { LuIndianRupee } from "react-icons/lu";
import { RiCustomerService2Line } from "react-icons/ri";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { MdLogin } from "react-icons/md";
import { BsCardList } from "react-icons/bs";
import { SlEnvolope } from "react-icons/sl";

const Sidebar = ()=>{
    const location = useLocation();
    const currentPath = location.pathname;
    const [openMenus, setOpenMenus] = useState({
        inventory: false,
        billing: false,
        profit: false,
        customer: false
    });

    const toggleMenu = (menu) => {
        setOpenMenus(prev => ({
            ...prev,
            [menu]: !prev[menu]
        }));
    };

    return(
        <>
        <aside id="sidebar" class="sidebar">
        <ul class="sidebar-nav" id="sidebar-nav">
          <li class="nav-item">
            {/* <a class={`nav-link ${currentPath === "/" ? "" : "collapsed"}`}>
              <Link to="/">
                <RxDashboard/>
                <span>Dashboard</span>
              </Link>
            </a> */}
          </li>

          <li class="nav-item">
            <a 
              class={`nav-link ${openMenus.inventory ? '' : 'collapsed'}`} 
              onClick={() => toggleMenu('inventory')}
            >
              <MdInventory2/>
              <span>Inventory</span>
              <IoIosArrowDown className="arrow-icon" />
            </a>
            <ul className={`nav-content ${openMenus.inventory ? 'show' : ''}`}>
              <li>
                <Link to="/Inventory"> 
                  <span>View Inventory</span>
                </Link>
              </li>
              <li>
                <Link to="/addInventory"> 
                  <span>Add Item</span>
                </Link>
              </li>
            </ul>
          </li>

          <li class="nav-item">
            <a 
              class={`nav-link ${openMenus.billing ? '' : 'collapsed'}`}
              onClick={() => toggleMenu('billing')}
            >
              <FaFileInvoiceDollar />
              <span>Billing</span>
              <IoIosArrowDown className="arrow-icon" />
            </a>
            <ul className={`nav-content ${openMenus.billing ? 'show' : ''}`}>
              <li>
                <Link to="/billing/new">
                  <span>New Bill</span>
                </Link>
              </li>
              <li>
                <Link to="/billing/history">
                  <span>Bill History</span>
                </Link>
              </li>
            </ul>
          </li>

          <li class="nav-item">
            <a 
              class={`nav-link ${openMenus.profit ? '' : 'collapsed'}`}
              onClick={() => toggleMenu('profit')}
            >
              <LuIndianRupee />
              <span>Profit</span>
              <IoIosArrowDown className="arrow-icon" />
            </a>
            <ul className={`nav-content ${openMenus.profit ? 'show' : ''}`}>
              {/* <li>
                <Link to="/profit/overview">
                  <span>Overview</span>
                </Link>
              </li> */}
              <li>
                <Link to="/profit/analysis">
                  <span>Analysis</span>
                </Link>
              </li>
            </ul>
          </li>

          <li class="nav-item">
            <a 
              class={`nav-link ${openMenus.customer ? '' : 'collapsed'}`}
              onClick={() => toggleMenu('customer')}
            >
              <RiCustomerService2Line />
              <span>Customer Outreach</span>
              <IoIosArrowDown className="arrow-icon" />
            </a>
            <ul className={`nav-content ${openMenus.customer ? 'show' : ''}`}>
              {/* <li>
                <Link to="/customer/contacts">
                  <span>Contacts</span>
                </Link>
              </li> */}
              <li>
                <Link to="/customer/messages">
                  <span>Messages</span>
                </Link>
              </li>
            </ul>
          </li>

          {/* <li class="nav-item">
            <a class="nav-link collapsed" href="users-profile.html">
              <i class="bi bi-person"></i>
              <span>Profile</span>
            </a>
          </li> */}

          <li class="nav-item">
            <Link to="/contact">
            <a class="nav-link collapsed" >
            <SlEnvolope />
              {/* <i class="bi bi-envelope"></i> */}
              <span>Contact</span>
            </a> </Link>
          </li>
          <li class="nav-item">
            <Link to="/login" >
            <a class="nav-link collapsed">
            <MdLogin />
              <span>Login</span>
            </a>
            </Link>
          </li>
          <li class="nav-item">
            <Link to="/register">
            <a class="nav-link collapsed">
            <BsCardList />
              <span>Register</span>
            </a>
            </Link>
          </li>

        </ul>
        </aside>
        </>
    )
}
export default Sidebar