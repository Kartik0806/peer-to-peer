import React, { use, useState, createContext, } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, TextField, Button, Paper, Tab, Tabs } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../providers/authProvider.jsx';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';


// console.log('API_URL:', process.env.NODE_ENV);
const AuthPage = () => {
    const { user, setUser, loading } = useAuth();
    const navigate = useNavigate();
    const [tab, setTab] = useState(0);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleTabChange = (event, newValue) => {
        setTab(newValue);
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword
        };

        try {
            const response = await axios.post(`${API_URL}/${tab === 0 ? 'login' : 'register'}`, payload, {
                withCredentials: true});
            const data = response.data;

            setUser(data.userCredential.user);
            navigate('/');

        } catch (error) {
            console.log('auth.jsx:', error);
        }

    };

    return (
        <Container component="main" maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
            <Paper 
                elevation={3}
                sx={{
                    padding: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    backgroundColor: '#1e1e1e',
                    color: 'white',
                }}
            >
                <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
                    {tab === 0 ? 'Sign In' : 'Sign Up'}
                </Typography>

                <Tabs 
                    value={tab} 
                    onChange={handleTabChange}
                    sx={{ 
                        mb: 3,
                        '& .MuiTab-root': { color: '#ffffff80' },
                        '& .Mui-selected': { color: 'white' }
                    }}
                >
                    <Tab label="Login" />
                    <Tab label="Register" />
                </Tabs>

                <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                color: 'white',
                                '& fieldset': { borderColor: '#ffffff3b' },
                                '&:hover fieldset': { borderColor: '#ffffff8a' },
                            },
                            '& .MuiInputLabel-root': { color: '#ffffff8a' }
                        }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handleInputChange}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                color: 'white',
                                '& fieldset': { borderColor: '#ffffff3b' },
                                '&:hover fieldset': { borderColor: '#ffffff8a' },
                            },
                            '& .MuiInputLabel-root': { color: '#ffffff8a' }
                        }}
                    />
                    {tab === 1 && (
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    color: 'white',
                                    '& fieldset': { borderColor: '#ffffff3b' },
                                    '&:hover fieldset': { borderColor: '#ffffff8a' },
                                },
                                '& .MuiInputLabel-root': { color: '#ffffff8a' }
                            }}
                        />
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ 
                            mt: 3, 
                            mb: 2,
                            backgroundColor: '#2196f3',
                            '&:hover': {
                                backgroundColor: '#1976d2'
                            }
                        }}
                    >
                        {tab === 0 ? 'Sign In' : 'Sign Up'}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default AuthPage;