import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import logo from '../assets/logo.png';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    // Add ionicons script
    React.useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js";
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3500/login', formData);
            if (response.data.success) {
                // Store token and user info
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                
                // Clear any existing errors
                setError('');
                
                // Redirect to inventory
                navigate('/Inventory');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed. Please try again.');
        }
    };

    return (

        <div className="auth-container" style={{overflow:'hidden'}}>
            <div className="logo1">
                <img src={logo} alt="" height={750} width={750}/>
            </div>
            <div className="screen-1" id="sp">
                <form onSubmit={handleSubmit}>
                    {error && <div className="error-message">{error}</div>}
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
                                className="pas" 
                                type="password" 
                                name="password" 
                                placeholder="············"
                                value={formData.password}
                                onChange={handleChange}
                                required 
                            />
                        </div>
                    </div>
                    <button type="submit" className="login">Login</button>
                    <div className="footer">
                        <Link to="/register"><span>Signup</span></Link>
                        <span>Forgot Password?</span>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
