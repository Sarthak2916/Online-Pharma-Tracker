import React from 'react';
import { IoLocationOutline, IoCallOutline } from 'react-icons/io5';
import { SlEnvolope } from 'react-icons/sl';
import { CiClock2 } from 'react-icons/ci';
import './contact.css';

const Contact = () => {
    const contactInfo = [
        {
            icon: <IoLocationOutline />,
            title: 'Our Address',
            details: 'Chitkara University, Rajpura, Punjab, India'
        },
        {
            icon: <IoCallOutline />,
            title: 'Call Us',
            details: '+918219312588\n+919050415092'
        },
        {
            icon: <SlEnvolope />,
            title: 'Email Us',
            details: 'sarthaksharma6896@gmail.com\nsehdevpratap9050@gmail.com'
        },
        {
            icon: <CiClock2 />,
            title: 'Business Hours',
            details: 'Monday-Friday\n9:00 AM - 5:00 PM'
        }
    ];

    return (
        <div className="contact-mainContainer">
        
        <div className="contact-container">
            <h1 className="contact-header">Contact Information</h1>
            <div className="contact-info-grid">
                {contactInfo.map((contact, index) => (
                    <div key={index} className="contact-card">
                        <div className="contact-icon">{contact.icon}</div>
                        <div className="contact-details">
                            <h3>{contact.title}</h3>
                            <p>{contact.details}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        </div>
    );
};

export default Contact;