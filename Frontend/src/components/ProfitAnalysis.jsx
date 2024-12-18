import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import './ProfitAnalysis.css';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const ProfitAnalysis = () => {
    const [profitData, setProfitData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfitData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3500/billing/history', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                // Process bill data to calculate monthly profits
                const monthlyProfits = calculateMonthlyProfits(response.data.data);
                setProfitData(monthlyProfits);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching bill history:', err);
                setError('Failed to load profit data');
                setLoading(false);
            }
        };

        fetchProfitData();
    }, []);

    const calculateMonthlyProfits = (bills) => {
        // Get the last 6 months
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June', 
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        // Create an object to store monthly profits
        const monthlyProfits = {};

        // Calculate profits for each bill
        bills.forEach(bill => {
            const billDate = new Date(bill.createdAt);
            const monthKey = `${billDate.getFullYear()}-${billDate.getMonth()}`;
            const profit = bill.price - bill.totalBuyingPrice;

            if (!monthlyProfits[monthKey]) {
                monthlyProfits[monthKey] = 0;
            }
            monthlyProfits[monthKey] += profit;
        });

        // Get the last 6 months
        const currentDate = new Date();
        const labels = [];
        const profits = [];

        for (let i = 5; i >= 0; i--) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
            const monthLabel = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
            
            labels.push(monthLabel);
            profits.push(monthlyProfits[monthKey] || 0);
        }

        return { labels, profits };
    };

    const chartData = {
        labels: profitData?.labels || [],
        datasets: [
            {
                label: 'Monthly Profit (₹)',
                data: profitData?.profits || [],
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
                backgroundColor: 'rgba(75, 192, 192, 0.2)'
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Monthly Profit Analysis'
            }
        }
    };

    // Calculate total profit
    const totalProfit = profitData?.profits.reduce((a, b) => a + b, 0) || 0;
    const averageMonthlyProfit = totalProfit / 6;

    if (loading) {
        return (
            <div className="profit-analysis-container">
                <div className="loading-container">
                    <p>Loading profit data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="profit-analysis-container">
                <div className="error-container">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="profit-main">
        
        <div className="profit-analysis-container">
            <h1 className="profit-analysis-header">Profit Analysis</h1>
            <div className="profit-chart-container">
                <Line data={chartData} options={chartOptions} />
                <div className="profit-summary">
                    <div className="profit-summary-item">
                        <h3>Total Profit</h3>
                        <div className="value">₹{totalProfit.toFixed(2)}</div>
                    </div>
                    <div className="profit-summary-item">
                        <h3>Avg. Monthly Profit</h3>
                        <div className="value">₹{averageMonthlyProfit.toFixed(2)}</div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
};

export default ProfitAnalysis;