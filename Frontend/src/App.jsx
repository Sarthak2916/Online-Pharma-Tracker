import { useEffect, useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { MedicineProvider } from './context/MedicineContext';
import { SearchProvider } from './context/SearchContext';
import Login from './components/Login/Login.jsx'
import Register from './components/Register/Register.jsx'
import Home from './components/Home.jsx'
import Navbar from './components/Navbar.jsx'
import Sidebar from './components/Sidebar.jsx'
import Inventory from './components/Inventory.jsx'
import AddInventory from './components/AddInventory.jsx'
import Billing from './components/Billing';
import BillingHistory from './components/Billing.History.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import SelectMedicines from './components/selectMedicines';
import Message from './components/message';
import ProfitAnalysis from './components/ProfitAnalysis';
import Contact from './components/contact';
function App() {
  return (
    <SearchProvider>
      <Router>
        <MedicineProvider>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes */}
              
              <Route path="/Inventory" element={
                <ProtectedRoute>
                  <><Navbar /><Sidebar /><Inventory /></>
                </ProtectedRoute>
              } />
              
              <Route path="/addInventory" element={
                <ProtectedRoute>
                  <><Navbar /><Sidebar /><AddInventory /></>
                </ProtectedRoute>
              } />
              
              <Route path="/billing/new" element={
                <ProtectedRoute>
                  <><Navbar /><Sidebar /><Billing /></>
                </ProtectedRoute>
              } />
              
              <Route path="/billing/history" element={
                <ProtectedRoute>
                  <><Navbar /><Sidebar /><BillingHistory /></>
                </ProtectedRoute>
              } />

              <Route path="/billing/selectMedicine" element={
                <ProtectedRoute>
                  <><Navbar /><Sidebar /><SelectMedicines /></>
                </ProtectedRoute>
              } />
              <Route path="/customer/messages" element={
                <ProtectedRoute>
                  <><Navbar /><Sidebar /><Message /></>
                </ProtectedRoute>
              } />
              <Route path="/profit/analysis" element={
                <ProtectedRoute>
                  <><Navbar /><Sidebar /><ProfitAnalysis /></>
                </ProtectedRoute>
              } />
              <Route path="/contact" element={
                <ProtectedRoute>
                  <><Navbar /><Sidebar /><Contact /></>
                </ProtectedRoute>
              } />

              {/* Redirect to login for unknown routes */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </MedicineProvider>
      </Router>
    </SearchProvider>
  )
}

export default App
