import React, { useState } from 'react'
import './Register.css'
import logo from '../assets/logo.png'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirm_password: ''
    });
    const [error, setError] = useState('');

    function addScript() {
        const script = document.createElement('script');
        script.src = "https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"; 
        script.async = true;
        document.body.appendChild(script);
    }
    
    addScript();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError(''); // Clear error when user types
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3500/register', formData);
            if (response.data.success) {
                // Registration successful
                alert(response.data.message);
                navigate('/login'); // Redirect to login page
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setError('Passwords do not match');
            } else {
                setError('Registration failed. Please try again.');
            }
        }
    };

    return (
        <div className="auth-container">
            <div className="logo1">
                <img src={logo} alt="" />
            </div>
            <div className="screen-1" id='sp'>
                <form onSubmit={handleSubmit}>
                    <div className="name">
                        <label htmlFor="name">User Name</label>
                        <div className="input-group">
                            <ion-icon name="person-outline"></ion-icon>
                            <input 
                                type="text" 
                                name="name" 
                                placeholder="Username"
                                value={formData.name}
                                onChange={handleChange}
                                required 
                            />
                        </div>
                    </div>
                    <div className="email">
                        <label htmlFor="email">Email Address</label>
                        <div className="input-group">
                            <ion-icon name="mail-outline"></ion-icon>
                            <input 
                                type="email" 
                                name="email" 
                                placeholder="Username@gmail.com"
                                value={formData.email}
                                onChange={handleChange}
                                required 
                            />
                        </div>
                    </div>
                    <div className="password">
                        <label htmlFor="password">Password</label>
                        <div className="input-group">
                            <ion-icon name="lock-closed-outline"></ion-icon>
                            <input 
                                type="password" 
                                name="password" 
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required 
                            />
                        </div>
                    </div>
                    <div className="confirm-password">
                        <label htmlFor="confirm_password">Confirm Password</label>
                        <div className="input-group">
                            <ion-icon name="lock-closed-outline"></ion-icon>
                            <input 
                                type="password" 
                                name="confirm_password" 
                                placeholder="Confirm password"
                                value={formData.confirm_password}
                                onChange={handleChange}
                                required 
                            />
                        </div>
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <button type="submit" className="login">Register</button>
                    <div className="footer">
                        <span onClick={() => navigate('/login')}>Already have an account? Login</span>
                        <span>Forgot Password?</span>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register
