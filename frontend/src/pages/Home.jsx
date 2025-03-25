import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Home = () => {
    const [meetCode, setMeetCode] = useState('');
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            const response = await axios.get(`${API_URL}/logout`, {
                withCredentials: true
            });
            navigate('/auth');

        }
        catch (error) {
            console.log('Error In Logout:', error);
        }
    };

    const handleJoinMeet = () => {
        if (meetCode.trim()) {
            try {
                const response = axios.post(`${API_URL}/meet`, {
                    "meetCode": meetCode
                }, {
                    withCredentials: true
                });
            }
            catch (error) { 
                console.error('Error In Join Meet:', error);
            }
            finally {
                navigate(`/meet/${meetCode}`);
            }

        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6">Welcome to Video Meet</h1>
                
                <div className="space-y-4">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Enter meet code"
                            value={meetCode}
                            onChange={(e) => setMeetCode(e.target.value)}
                            className="p-2 border rounded"
                        />
                        <button
                            onClick={handleJoinMeet}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Join Meet
                        </button>
                    </div>

                    <button
                        onClick={() => navigate('/create-meet')}
                        className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        Create New Meet
                    </button>

                    <button
                        onClick={handleLogout}
                        className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;