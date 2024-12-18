import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './billinghistory.css';

const BillingHistory = () => {
  const [bills, setBills] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBillingHistory = async () => {
      try {
        const response = await axios.get('http://localhost:3500/billing/history');
        console.log('Received bills:', response.data);
        // Access the data array from the response
        setBills(response.data.data || []);
        setError(null);
      } catch (error) {
        console.error('Error fetching billing history:', error);
        setError('Failed to load billing history. Please try again later.');
        setBills([]); // Set empty array on error
      }
    };

    fetchBillingHistory();
  }, []);

  if (error) {
    return (
      <div className="billing-history-container">
        <h1 className="billing-history-title">Billing History</h1>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="billing-history-container">
      <h1 className="billing-history-title">Billing History</h1>
      
      {bills.length === 0 ? (
        <div className="error-message">No billing history found.</div>
      ) : (
        <table className="billing-table">
          <thead>
            <tr>
              <th>Index No.</th>
              <th>Customer Name</th>
              <th>Mobile</th>
              <th>Address</th>
              <th>Medicines</th>
              <th>Total Price</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill, index) => (
              <tr key={bill._id || index}>
                <td>{index + 1}</td>
                <td>{bill.name || 'N/A'}</td>
                <td>{bill.mobile || 'N/A'}</td>
                <td>{bill.address || 'N/A'}</td>
                <td className="medicines-list">
                  {Array.isArray(bill.medicines) 
                    ? bill.medicines.map(med => `${med.name || 'N/A'} (${med.quantity || 0})`).join(', ')
                    : 'No medicines'
                  }
                </td>
                <td className="price-column">₹{bill.price || 0}</td>
                <td>{bill.createdAt ? new Date(bill.createdAt).toLocaleDateString() : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BillingHistory;
