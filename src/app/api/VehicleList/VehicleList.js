'use client';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/joy/Typography';
import { useState } from 'react';
import VehicleList from '../components/VehicleList';

export default function MyApp() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [showFirstPage, setShowFirstPage] = useState(true);
    const [showVehicles, setShowVehicles] = useState(false);

    const resetPages = () => {
        setShowFirstPage(false);
        setShowVehicles(false);
    };

    const runShowFirst = () => {
        resetPages();
        setShowFirstPage(true);
    };

    const runShowVehicles = () => {
        resetPages();
        setShowVehicles(true);
    };

    return (
        <Box
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: '#2E3B4E',
                color: 'lightgreen',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <AppBar
                position="static"
                sx={{
                    backgroundColor: 'lightgreen',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                }}
            >
                <Toolbar>
                    <Typography variant="h4" component="div" sx={{ flexGrow: 1, color: '#2E3B4E', fontWeight: 'bold' }}>
                        Eco Wheels Dublin
                    </Typography>
                    <Button color="inherit" sx={{ fontWeight: 'bold' }} onClick={runShowFirst}>
                        Home
                    </Button>
                    <Button color="inherit" sx={{ fontWeight: 'bold' }} onClick={runShowVehicles}>
                        Vehicles
                    </Button>
                </Toolbar>
            </AppBar>

            {showFirstPage && (
                <Box sx={{ p: 4, textAlign: 'center', backgroundColor: 'white', borderRadius: '10px' }}>
                    <Typography variant="h3">Welcome to Eco Wheels Dublin</Typography>
                    <Typography variant="h5">Rent your eco-friendly car today!</Typography>
                </Box>
            )}

            {showVehicles && <VehicleList />}
        </Box>
    );
}
