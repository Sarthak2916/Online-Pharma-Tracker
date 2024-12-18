import React, { useState } from 'react';
import './AddInventory.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddInventory = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        buyingPrice: '',
        sellingPrice: '',
        location: '',
        quantity: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Convert prices and quantity to numbers for number inputs
        if (name === 'buyingPrice' || name === 'sellingPrice' || name === 'quantity') {
            setFormData(prevState => ({
                ...prevState,
                [name]: value === '' ? '' : Number(value)
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const validateForm = () => {
        if (!formData.name.trim()) return 'Name is required';
        if (!formData.description.trim()) return 'Description is required';
        if (!formData.buyingPrice || formData.buyingPrice <= 0) return 'Buying price must be greater than 0';
        if (!formData.sellingPrice || formData.sellingPrice <= 0) return 'Selling price must be greater than 0';
        if (!formData.location.trim()) return 'Location is required';
        if (!formData.quantity || formData.quantity < 0) return 'Quantity must be 0 or greater';
        if (formData.description.length > 100) return 'Description must be less than 100 characters';
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('http://localhost:3500/inventory/add', formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data && response.data.success) {
                // Show success message or notification
                navigate('/Inventory');
            } else {
                throw new Error(response.data.message || 'Failed to add inventory item');
            }
        } catch (error) {
            console.error('Error adding inventory:', error);
            setError(
                error.response?.data?.message || 
                error.message || 
                'Failed to add inventory item. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-inventory-container">
            <div className="add-inventory-header">
                <h1>Add New Inventory Item</h1>
            </div>
            <div className="add-inventory-form">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter item name"
                            maxLength={50}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            placeholder="Enter item description"
                            maxLength={100}
                        />
                        <small className="character-count">
                            {formData.description.length}/100 characters
                        </small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="buyingPrice">Buying Price</label>
                        <input
                            type="number"
                            id="buyingPrice"
                            name="buyingPrice"
                            value={formData.buyingPrice}
                            onChange={handleChange}
                            required
                            placeholder="Enter buying price"
                            min="0"
                            step="0.01"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="sellingPrice">Selling Price</label>
                        <input
                            type="number"
                            id="sellingPrice"
                            name="sellingPrice"
                            value={formData.sellingPrice}
                            onChange={handleChange}
                            required
                            placeholder="Enter selling price"
                            min="0"
                            step="0.01"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="location">Location</label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                            placeholder="Enter storage location"
                            maxLength={50}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="quantity">Quantity</label>
                        <input
                            type="number"
                            id="quantity"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            required
                            min="0"
                            placeholder="Enter quantity"
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <div className="form-actions">
                        <button 
                            type="submit" 
                            className="submit-button"
                            disabled={loading}
                        >
                            {loading ? 'Adding...' : 'Add Item'}
                        </button>
                        <button 
                            type="button" 
                            className="cancel-button"
                            onClick={() => navigate('/Inventory')}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddInventory;