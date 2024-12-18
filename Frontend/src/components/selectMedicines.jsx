import React, { useState, useEffect } from 'react';
import './selectMedicines.css'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useMedicineContext } from '../context/MedicineContext';

const selectedMedicines = ()=>{
    const [inventoryItems, setInventoryItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCounters, setShowCounters] = useState({});
    const { selectedMedicines, updateMedicineSelection } = useMedicineContext();

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const response = await axios.get('http://localhost:3500/inventory/view', {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });
                
                const items = response.data.viewMedicines;
                if (!Array.isArray(items)) {
                    throw new Error('Invalid data format received from server');
                }
                
                // Initialize counter visibility for each item
                const initialCounters = {};
                items.forEach(item => {
                    initialCounters[item._id] = selectedMedicines[item._id] > 0;
                });
                setShowCounters(initialCounters);
                setInventoryItems(items);
                setLoading(false);
            } catch (error) {
                console.error('Error details:', {
                    message: error.message,
                    response: error.response,
                    status: error.response?.status
                });
                setError(`Failed to fetch inventory items: ${error.message}`);
                setLoading(false);
            }
        };
        fetchInventory();
    }, [selectedMedicines]);

    const handleIncrement = (itemId) => {
        const item = inventoryItems.find(item => item._id === itemId);
        const newCount = Math.min((selectedMedicines[itemId] || 0) + 1, item?.quantity || 0);
        updateMedicineSelection(itemId, newCount, item);
    };

    const handleDecrement = (itemId) => {
        const item = inventoryItems.find(item => item._id === itemId);
        const newCount = Math.max((selectedMedicines[itemId] || 0) - 1, 0);
        updateMedicineSelection(itemId, newCount, item);
        
        if (newCount === 0) {
            setShowCounters(prev => ({
                ...prev,
                [itemId]: false
            }));
        }
    };

    const handleAddClick = (itemId) => {
        const item = inventoryItems.find(item => item._id === itemId);
        setShowCounters(prev => ({
            ...prev,
            [itemId]: true
        }));
        updateMedicineSelection(itemId, 1, item);
    };

    if (loading) {
        return (
            <div className="main-inventory">
                <div className="loading">Loading inventory items...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="main-inventory">
                <div className="error-message">{error}</div>
            </div>
        );
    }

    return(
        <>
            <div className="main-inventory">
                <div className="inventory-header-selectmed">

                    <h1>Select Medicines</h1>
                    <div className="select-medicine-button-proceed">
                    <Link to="/billing/new">
                    <div className="select-medicine-button-child">Proceed</div>
                </Link></div>
                </div>
                <div className="inventory-grid">
                    {inventoryItems.length === 0 ? (
                        <div className="no-items">No inventory items found</div>
                    ) : (
                        inventoryItems.map((item) => (
                            <div key={item._id} className="inventory-card">
                                <div className="card-content">
                                    <h2 className="card-title">{item.name}</h2>
                                    <p className="card-description">{item.description}</p>
                                    <div className="card-details">
                                        <div className="detail-item">
                                            <span className="detail-label">Buy Price:</span>
                                            <span className="detail-value">₹{item.buyingPrice}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Sell Price:</span>
                                            <span className="detail-value">₹{item.sellingPrice}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Location:</span>
                                            <span className="detail-value">{item.location}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Quantity:</span>
                                            <span className="detail-value">{item.quantity}</span>
                                        </div>
                                        {showCounters[item._id] ? (
                                            <div className="counter-container">
                                                <button 
                                                    className="counter-btn" 
                                                    onClick={() => handleDecrement(item._id)}
                                                >
                                                    -
                                                </button>
                                                <span className="count-display">{selectedMedicines[item._id] || 0}</span>
                                                <button 
                                                    className="counter-btn" 
                                                    onClick={() => handleIncrement(item._id)}
                                                    disabled={selectedMedicines[item._id] === item.quantity}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        ) : (
                                            <button 
                                                className="add-btn"
                                                onClick={() => handleAddClick(item._id)}
                                            >
                                                Add
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    )
}
export default selectedMedicines