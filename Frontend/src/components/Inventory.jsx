import React, { useState, useEffect } from 'react';
import './Inventory.css'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useMedicineContext } from '../context/MedicineContext';
import { useSearch } from '../context/SearchContext';

const Inventory = ()=>{
    const [inventoryItems, setInventoryItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCounters, setShowCounters] = useState({});
    const { selectedMedicines, updateMedicineSelection } = useMedicineContext();
    const { searchTerm } = useSearch();
    const [editingItem, setEditingItem] = useState(null);
    const [editFormData, setEditFormData] = useState({
        name: '',
        description: '',
        buyingPrice: '',
        sellingPrice: '',
        location: '',
        quantity: ''
    });

    useEffect(() => {
        fetchInventory();
    }, [selectedMedicines]);

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
                initialCounters[item.name] = selectedMedicines[item.name] > 0;
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

    const handleIncrement = (itemName) => {
        const item = inventoryItems.find(item => item.name === itemName);
        const newCount = Math.min((selectedMedicines[itemName] || 0) + 1, item?.quantity || 0);
        updateMedicineSelection(itemName, newCount, item);
    };

    const handleDecrement = (itemName) => {
        const item = inventoryItems.find(item => item.name === itemName);
        const newCount = Math.max((selectedMedicines[itemName] || 0) - 1, 0);
        updateMedicineSelection(itemName, newCount, item);
        
        if (newCount === 0) {
            setShowCounters(prev => ({
                ...prev,
                [itemName]: false
            }));
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item.name);
        setEditFormData({
            name: item.name,
            description: item.description,
            buyingPrice: item.buyingPrice,
            sellingPrice: item.sellingPrice,
            location: item.location,
            quantity: item.quantity
        });
    };

    const handleDelete = async (medicineName) => {
        if (window.confirm(`Are you sure you want to delete ${medicineName}?`)) {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    alert('Please login to delete medicines');
                    return;
                }
                
                const response = await axios.delete(`http://localhost:3500/inventory/delete`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    data: { name: medicineName }
                });
                
                if (response.data.success) {
                    setInventoryItems(prevItems => prevItems.filter(item => item.name !== medicineName));
                    alert('Medicine deleted successfully');
                } else {
                    alert('Failed to delete medicine');
                }
            } catch (error) {
                console.error('Error deleting medicine:', error);
                if (error.response?.status === 401) {
                    alert('Session expired. Please login again.');
                } else {
                    alert('Failed to delete medicine. Please try again.');
                }
            }
        }
    };

    const handleEditSubmit = async (medicineName) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Please login to edit medicines');
                return;
            }

            console.log('Editing medicine:', {
                originalName: medicineName,
                editFormData: editFormData
            });

            const response = await axios.put(`http://localhost:3500/inventory/update`, 
                {
                    originalName: medicineName,
                    ...editFormData
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                const updatedItems = inventoryItems.map(item => 
                    item.name === medicineName ? response.data.data : item
                );
                setInventoryItems(updatedItems);
                setEditingItem(null);
                alert('Medicine updated successfully');
            } else {
                alert('Failed to update medicine');
            }
        } catch (error) {
            console.error('Error updating medicine:', {
                error: error,
                response: error.response,
                request: error.request
            });
            if (error.response?.status === 401) {
                alert('Session expired. Please login again.');
            } else {
                alert(`Failed to update medicine: ${error.message}`);
            }
        }
    };

    const handleEditCancel = () => {
        setEditingItem(null);
        setEditFormData({
            name: '',
            description: '',
            buyingPrice: '',
            sellingPrice: '',
            location: '',
            quantity: ''
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const highlightText = (text) => {
        if (!searchTerm) return text;
        
        const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
        return parts.map((part, index) => 
            part.toLowerCase() === searchTerm.toLowerCase() 
                ? <span key={index} style={{ backgroundColor: '#ffff00' }}>{part}</span> 
                : part
        );
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
                <div className="inventory-header">
                    <h1>Inventory Items</h1>
                </div>
                <div className="inventory-grid">
                    {inventoryItems.length === 0 ? (
                        <div className="no-items">No inventory items found</div>
                    ) : (
                        inventoryItems.map((item) => (
                            <div key={item.name} className="inventory-card">
                                {editingItem === item.name ? (
                                    <div className="edit-form">
                                        <input
                                            type="text"
                                            name="name"
                                            value={editFormData.name}
                                            onChange={handleInputChange}
                                            placeholder="Medicine Name"
                                        />
                                        <textarea
                                            name="description"
                                            value={editFormData.description}
                                            onChange={handleInputChange}
                                            placeholder="Description"
                                        />
                                        <input
                                            type="number"
                                            name="buyingPrice"
                                            value={editFormData.buyingPrice}
                                            onChange={handleInputChange}
                                            placeholder="Buying Price"
                                        />
                                        <input
                                            type="number"
                                            name="sellingPrice"
                                            value={editFormData.sellingPrice}
                                            onChange={handleInputChange}
                                            placeholder="Selling Price"
                                        />
                                        <input
                                            type="text"
                                            name="location"
                                            value={editFormData.location}
                                            onChange={handleInputChange}
                                            placeholder="Location"
                                        />
                                        <input
                                            type="number"
                                            name="quantity"
                                            value={editFormData.quantity}
                                            onChange={handleInputChange}
                                            placeholder="Quantity"
                                        />
                                        <div className="edit-buttons">
                                            <button onClick={() => handleEditSubmit(item.name)}>Save</button>
                                            <button onClick={handleEditCancel}>Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="card-content">
                                        <h2 className="card-title">{highlightText(item.name)}</h2>
                                        <p className="card-description">{highlightText(item.description)}</p>
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
                                                <span className="detail-value">{highlightText(item.location)}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Quantity:</span>
                                                <span className="detail-value">{item.quantity}</span>
                                            </div>
                                            {showCounters[item.name] ? (
                                                <div className="counter-container">
                                                    <button 
                                                        className="counter-btn" 
                                                        onClick={() => handleDecrement(item.name)}
                                                    >
                                                        -
                                                    </button>
                                                    <span className="count-display">{selectedMedicines[item.name] || 0}</span>
                                                    <button 
                                                        className="counter-btn" 
                                                        onClick={() => handleIncrement(item.name)}
                                                        disabled={selectedMedicines[item.name] === item.quantity}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            ) : (
                                                <></>
                                            )}
                                        </div>
                                        <div className="action-buttons">
                                            <button 
                                                className="edit-btn"
                                                onClick={() => handleEdit(item)}
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                className="delete-btn"
                                                onClick={() => handleDelete(item.name)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
};

export default Inventory;