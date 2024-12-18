import React, { useState } from "react";
import './Billing.css';
import { useMedicineContext } from '../context/MedicineContext';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Billing = () => {
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        address: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { selectedMedicines, medicineDetails, resetMedicineSelection } = useMedicineContext();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const calculateTotalPrice = () => {
        return Object.entries(selectedMedicines).reduce((sum, [medicineId, quantity]) => {
            const medicine = medicineDetails[medicineId];
            return sum + (medicine?.sellingPrice || 0) * quantity;
        }, 0);
    };

    const calculateTotalBuyingPrice = () => {
        return Object.entries(selectedMedicines).reduce((sum, [medicineId, quantity]) => {
            const medicine = medicineDetails[medicineId];
            return sum + (medicine?.buyingPrice || 0) * quantity;
        }, 0);
    };

    const prepareMedicinesData = () => {
        return Object.entries(selectedMedicines).map(([medicineId, quantity]) => {
            const medicine = medicineDetails[medicineId];
            return {
                name: medicine.name,
                quantity: quantity,
                buyingPrice: medicine.buyingPrice
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const billData = {
                ...formData,
                medicines: prepareMedicinesData(),
                totalPrice: calculateTotalPrice(),
                totalBuyingPrice: calculateTotalBuyingPrice()
            };

            // First generate the bill
            const billResponse = await axios.post('http://localhost:3500/billing/new', billData);

            if (billResponse.data.success) {
                // Update quantities for each medicine
                const updatePromises = billData.medicines.map(medicine => 
                    axios.patch('http://localhost:3500/inventory/updateqty', {
                        name: medicine.name,
                        quantity: medicine.quantity
                    }, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    })
                );

                await Promise.all(updatePromises);

                alert('Bill generated successfully! SMS sent to customer.');
                // Clear form and selected medicines
                setFormData({
                    name: '',
                    mobile: '',
                    address: ''
                });
                // Reset medicine selection
                resetMedicineSelection();
            } else {
                throw new Error(billResponse.data.message || 'Failed to generate bill');
            }
        } catch (err) {
            setError(err.message || 'Failed to generate bill. Please try again.');
            console.error('Bill generation error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="billing-container">
            <div className="billing-form-container">
                <h2>Create New Bill</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Customer Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="mobile">Mobile Number</label>
                        <input
                            type="tel"
                            id="mobile"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleInputChange}
                            pattern="[0-9]{10}"
                            title="Please enter a valid 10-digit mobile number"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="address">Address</label>
                        <textarea
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="selected-medicines">
                    <div className="select-medicine-button">
                    <Link to="/billing/selectMedicine">
                    <div className="select-medicine-button-child">Select Medicines</div>
                </Link></div>
                        
                        {Object.entries(selectedMedicines).map(([medicineId, quantity]) => {
                            const medicine = medicineDetails[medicineId];
                            if (!medicine) return null;
                            return (
                                <div key={medicineId} className="selected-medicine-item">
                                    <span className="medicine-name">{medicine.name}</span>
                                    <span className="medicine-quantity">Qty: {quantity}</span>
                                    <span className="medicine-price">₹{medicine.sellingPrice * quantity}</span>
                                </div>
                            );
                        })}
                        <div className="total-price">
                            <span>Total Price:</span>
                            <span>₹{calculateTotalPrice()}</span>
                        </div>
                        {/* <div className="total-buying-price">
                            <span>Total Buying Price:</span>
                            <span>₹{calculateTotalBuyingPrice()}</span>
                        </div> */}
                    </div>

                    <button 
                        type="submit" 
                        className="submit-btn" 
                        disabled={loading || Object.keys(selectedMedicines).length === 0}
                    >
                        {loading ? 'Generating Bill...' : 'Generate Bill'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Billing;