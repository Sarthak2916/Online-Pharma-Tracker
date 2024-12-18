import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './message.css';

const Message = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState('');

    // Fetch previous messages
    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await axios.get('http://localhost:3500/customer/messages');
            console.log('Fetched messages:', response.data);
            setMessages(response.data.data || []);
        } catch (error) {
            console.error('Error fetching messages:', error);
            setError('Failed to load message history');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) {
            setError('Please enter a message');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess('');

        try {
            console.log('Sending message:', message);
            const response = await axios.post('http://localhost:3500/customer/send-message', { 
                message: message.trim() 
            });
            console.log('Send message response:', response.data);
            
            if (response.data.success) {
                setSuccess('Messages sent successfully!');
                setMessage('');
                // Refresh message history
                fetchMessages();
            } else {
                setError(response.data.message || 'Failed to send messages');
            }
        } catch (error) {
            console.error('Error sending messages:', error.response || error);
            setError(error.response?.data?.message || 'Failed to send messages. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="message-container">
            <h1>Send Message to All Customers</h1>
            
            <form onSubmit={handleSubmit} className="message-form">
                <div className="form-group">
                    <label htmlFor="message">Message:</label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        placeholder="Enter your message here..."
                        rows="4"
                    />
                </div>
                
                <button type="submit" disabled={loading || !message.trim()}>
                    {loading ? 'Sending...' : 'Send Message'}
                </button>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
            </form>

            <div className="message-history">
                <h2>Message History</h2>
                {messages.length === 0 ? (
                    <p>No messages sent yet.</p>
                ) : (
                    <table className="message-table">
                        <thead>
                            <tr>
                                <th>Index</th>
                                <th>Message</th>
                                <th>Recipients</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {messages.map((msg, index) => (
                                <tr key={msg._id}>
                                    <td>{index + 1}</td>
                                    <td>{msg.message}</td>
                                    <td>{msg.recipients?.length || 0} customers</td>
                                    <td>{new Date(msg.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Message;