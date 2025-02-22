'use client';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { useState } from 'react';
import VehicleList from '../api/VehicleList/VehicleList.js';

export default function MyApp() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [showFirstPage, setShowFirstPage] = useState(true);
    const [showRegister, setShowRegister] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showStudentShare, setShowStudentShare] = useState(false);
    const [showMapApi, setShowMapApi] = useState(false);
    const [showReviews, setShowReviews] = useState(false);
    const [showRent, setShowRent] = useState(false);
    const [showContact, setShowContact] = useState(false);
    const [showVehicles, setShowVehicles] = useState(false);
    const [username, setUsername] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [studentShareRegistered, setStudentShareRegistered] = useState(false);
    const [studentShareDetails, setStudentShareDetails] = useState(null);



    const resetPages = () => {
    const runShowVehicles = () => {
        resetPages();
    };

        setShowFirstPage(false);
        setShowRegister(false);
        setShowLogin(false);
        setShowStudentShare(false);
        setShowMapApi(false);
        setShowReviews(false);
        setShowRent(false);
        setShowContact(false);
        setShowVehicles(false);

    };

    const runShowFirst = () => {
        resetPages();
        setShowFirstPage(true);
    };

    const runShowRegister = () => {
        resetPages();
        setShowRegister(true);
    };

    const runShowLogin = () => {
        resetPages();
        setShowLogin(true);
    };

    const runShowStudentShare = () => {
        resetPages();
        setShowStudentShare(true);
    };

    const runShowMapApi = () => {
        if (!loggedIn) {
            alert("You must be logged in to access the Map API.");
            runShowLogin();
            return;
        }
        resetPages();
        setShowMapApi(true);
    };

    const runShowReviews = () => {
        resetPages();
        setShowReviews(true);
    };

    const runShowRent = () => {
        if (!loggedIn) {
            alert("You must be logged in to access the Rent page.");
            runShowLogin();
            return;
        }
        resetPages();
        setShowRent(true);
    };

    const runShowContact = () => {
        if (!loggedIn) {
            alert("You must be logged in to access the Contact Page.");
            return;
        }
        resetPages();
        setShowContact(true);
    };

    const runShowVehicles = () => {
        if (!loggedIn) {
            alert("You must be logged in to access the Vehicles Page.");
            runShowLogin();
            return;
        }
        resetPages();
        setShowVehicles(true);
    };
    

    const handleLogin = () => {
        const email = document.querySelector('input[name="email"]').value;
        const password = document.querySelector('input[name="password"]').value;

        fetch('/api/carlogin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    alert(data.error);
                } else {
                    alert('Login successful!');
                    setLoggedIn(true);
                    setUserEmail(email);
                    setUsername(data.username || 'User');
                    setStudentShareRegistered(data.studentShareRegistered || false);
                    runShowFirst();
                }
            })
            .catch((err) => console.error('Error during login:', err));
    };
    const handleLogout = () => {
        setLoggedIn(false);
        setUsername('');
        setUserEmail('');
        setStudentShareRegistered(false);
        setStudentShareDetails(null);
        alert('You have been logged out.');
        runShowFirst();
    };
    const handleShowStudentShare = () => {
        resetPages(); // Reset other pages before displaying Student Share
    
        if (loggedIn) {
            fetch('/api/getStudentShareDetails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: userEmail }),
            })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    setStudentShareRegistered(false);
                    setStudentShareDetails(null);
                } else {
                    setStudentShareRegistered(true);
                    setStudentShareDetails(data); // Store student details
                }
                setShowStudentShare(true);
            })
            .catch((err) => console.error('Error fetching Student Share details:', err));
        } else {
            setShowStudentShare(true); // If not logged in, still allow viewing the page
        }
    };
    
    
    const handleStudentShareRegister = () => {
        const studentID = document.querySelector('input[name="studentID"]').value;
        const drivingLicense = document.querySelector('input[name="drivingLicense"]').value;
    
        if (!studentID || !drivingLicense) {
            alert("Please enter both Student ID and Driving License Number.");
            return;
        }
    
        fetch('/api/studentshare', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: username,
                email: userEmail,
                studentID,
                drivingLicense,
            }),
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.error) {
                alert(data.error);
            } else {
                alert('You have successfully registered for Student Share!');
                setStudentShareRegistered(true);
                setStudentShareDetails({ studentID, drivingLicense }); // ✅ Immediately update the state
            }
        })
        .catch((err) => console.error('Error during Student Share registration:', err));
    };
    

    const handleRegister = () => {
        const name = document.querySelector('input[name="name"]').value;
        const address = document.querySelector('input[name="address"]').value;
        const email = document.querySelector('input[name="email"]').value;
        const password = document.querySelector('input[name="password"]').value;
        const confirmPassword = document.querySelector('input[name="confirm-password"]').value;

        fetch('/api/carregister', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, address, email, password, confirmPassword }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    alert(data.error);
                } else {
                    alert('Registration successful!');
                    runShowLogin(); // Redirect to login page after registration
                }
            })
            .catch((err) => console.error('Error during registration:', err));
    };

    return (
        <Box
    sx={{
        position: 'relative', // Change from absolute to relative
        width: '100vw',
        minHeight: '100vh', // Ensure full height
        backgroundColor: '#2E3B4E',
        color: 'lightgreen',
        overflowY: 'auto', // ✅ Enables vertical scrolling
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
        {!loggedIn && (
            <>
                <Button color="inherit" sx={{ fontWeight: 'bold' }} onClick={runShowRegister}>
                    Register
                </Button>
                <Button color="inherit" sx={{ fontWeight: 'bold' }} onClick={runShowLogin}>
                    Login
                </Button>
            </>
        )}
        {loggedIn && (
            <Button color="inherit" sx={{ fontWeight: 'bold' }} onClick={handleLogout}>
                Logout
            </Button>
        )}
        <Button color="inherit" sx={{ fontWeight: 'bold' }} onClick={handleShowStudentShare}>
    Student Share
</Button>
<Button color="inherit" sx={{ fontWeight: 'bold' }} onClick={runShowMapApi}>
    Map API
</Button>
<Button color="inherit" sx={{ fontWeight: 'bold' }} onClick={runShowReviews}>
    Reviews
</Button>
<Button color="inherit" sx={{ fontWeight: 'bold' }} onClick={runShowRent}>
    Rent
</Button>
<Button color="inherit" sx={{ fontWeight: 'bold' }} onClick={runShowContact}>
    Contact
</Button>
<Button color="inherit" sx={{ fontWeight: 'bold' }} onClick={runShowVehicles}>
    Vehicles
</Button>

                </Toolbar>
            </AppBar>

            {showFirstPage && (
    <Box
        sx={{
            p: 4,
            textAlign: 'center',
            border: '1px dashed grey',
            margin: '20px',
            backgroundColor: 'white',
            borderRadius: '10px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        }}
    >
        <Typography variant="h3" sx={{ color: '#2E3B4E', fontWeight: 'bold', mb: 2 }}>
            Welcome to Eco Wheels Dublin 
        </Typography>
        {loggedIn && (
            <Typography variant="h5" sx={{ mt: 1, color: '#2E3B4E' }}>
                Hello, {username}!
            </Typography>
        )}
        <Typography variant="h5" sx={{ mt: 2, color: '#2E3B4E', mb: 4 }}>
            Rent your eco-friendly car today!
        </Typography>

        {/* Car Listings */}
        <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: 2,
            }}
        >
            <Box
                sx={{
                    width: '300px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                }}
            >
                <img
                    src="https://changinglanes.ie/wp-content/uploads/2024/01/BYD-SEAL-1-scaled.jpg"
                    alt="Electric Car 1"
                    style={{ width: '100%', height: 'auto' }}
                />
                <Typography sx={{ p: 2, fontWeight: 'bold', color: '#2E3B4E' }}>
                    Affordable Rentals
                </Typography>
            </Box>

            <Box
                sx={{
                    width: '300px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                }}
            >
                <img
                    src="https://c.ndtvimg.com/2021-11/1316no38_mg-zs-ev_625x300_26_November_21.jpg"
                    alt="Electric Car 2"
                    style={{ width: '100%', height: 'auto' }}
                />
                <Typography sx={{ p: 2, fontWeight: 'bold', color: '#2E3B4E' }}>
                    Eco-Friendly Fleet
                </Typography>
            </Box>

            <Box
                sx={{
                    width: '300px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                }}
            >
                <img
                    src="https://car-images.bauersecure.com/wp-images/2697/kia_ev6_best_electric_cars_2024.jpg"
                    alt="Electric Car 3"
                    style={{ width: '100%', height: 'auto' }}
                />
                <Typography sx={{ p: 2, fontWeight: 'bold', color: '#2E3B4E' }}>
                    Convenient Locations
                </Typography>
            </Box>
        </Box>

        {/* Buttons for Explore Rent Options & Student Share (Side by Side) */}
        {loggedIn && (
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: '#2E3B4E',
                        color: 'white',
                        ':hover': {
                            backgroundColor: '#4C5E72',
                        },
                    }}
                    onClick={runShowVehicles} // Navigate to Vehicles Page
                >
                    Explore Rental Options
                </Button>

                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: '#2E3B4E',
                        color: 'white',
                        ':hover': {
                            backgroundColor: '#4C5E72',
                        },
                    }}
                    onClick={handleShowStudentShare} // Navigate to Student Share section
                >
                    Join Student Share
                </Button>
            </Box>
        )}
    </Box>
)}



            {showRegister && (
                <Box
                    sx={{
                        p: 4,
                        border: '1px dashed grey',
                        margin: '20px',
                        backgroundColor: 'white',
                        borderRadius: '10px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    }}
                >
                    <Typography variant="h3" sx={{ color: '#2E3B4E', fontWeight: 'bold' }}>
                        Register
                    </Typography>
                    <FormControl sx={{ mt: 2, mb: 2 }}>
                        <FormLabel>Name</FormLabel>
                        <Input name="name" type="text" placeholder="Enter your name" />
                    </FormControl>
                    <FormControl sx={{ mt: 2, mb: 2 }}>
                        <FormLabel>Address</FormLabel>
                        <Input name="address" type="text" placeholder="Enter your address" />
                    </FormControl>
                    <FormControl sx={{ mt: 2, mb: 2 }}>
                        <FormLabel>Email</FormLabel>
                        <Input name="email" type="email" placeholder="Enter your email" />
                    </FormControl>
                    <FormControl sx={{ mt: 2, mb: 2 }}>
                        <FormLabel>Password</FormLabel>
                        <Input name="password" type="password" placeholder="Enter your password" />
                    </FormControl>
                    <FormControl sx={{ mt: 2, mb: 2 }}>
                        <FormLabel>Confirm Password</FormLabel>
                        <Input name="confirm-password" type="password" placeholder="Confirm your password" />
                    </FormControl>
                    <Button
                        variant="contained"
                        sx={{
                            mt: 3,
                            backgroundColor: '#2E3B4E',
                            color: 'white',
                            ':hover': {
                                backgroundColor: '#4C5E72',
                            },
                        }}
                        onClick={handleRegister}
                    >
                        Register
                    </Button>
                </Box>
            )}

            {showLogin && (
                <Box
                    sx={{
                        p: 4,
                        border: '1px dashed grey',
                        margin: '20px',
                        backgroundColor: 'white',
                        borderRadius: '10px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    }}
                >
                    <Typography variant="h3" sx={{ color: '#2E3B4E', fontWeight: 'bold' }}>
                        Login
                    </Typography>
                    <FormControl sx={{ mt: 2, mb: 2 }}>
                        <FormLabel>Email</FormLabel>
                        <Input name="email" type="email" placeholder="Enter your email" />
                    </FormControl>
                    <FormControl sx={{ mt: 2, mb: 2 }}>
                        <FormLabel>Password</FormLabel>
                        <Input name="password" type="password" placeholder="Enter your password" />
                    </FormControl>
                    <Button
                        variant="contained"
                        sx={{
                            mt: 3,
                            backgroundColor: '#2E3B4E',
                            color: 'white',
                            ':hover': {
                                backgroundColor: '#4C5E72',
                            },
                        }}
                        onClick={handleLogin}
                    >
                        Login
                    </Button>
                </Box>
            )}

{showStudentShare && (
    <Box sx={{ p: 4, textAlign: 'center', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <Typography variant="h4" sx={{ color: '#2E3B4E', fontWeight: 'bold', mb: 2 }}>
            Hello, {username}!
        </Typography>

        {studentShareRegistered && studentShareDetails ? (
            <>
                <Typography variant="h3" sx={{ color: '#2E3B4E', fontWeight: 'bold', mb: 2 }}>
                    Student Share Details
                </Typography>
                <Typography sx={{ color: '#2E3B4E' }}>
                    <strong>Student ID:</strong> {studentShareDetails.studentID}
                </Typography>
                <Typography sx={{ color: '#2E3B4E' }}>
                    <strong>Driving License:</strong> {studentShareDetails.drivingLicense}
                </Typography>
            </>
        ) : (
            <>
                <Typography variant="h3" sx={{ color: '#2E3B4E', fontWeight: 'bold' }}>
                    Student Share Registration
                </Typography>
                <Typography sx={{ color: '#2E3B4E', mb: 2 }}>
                    Please register for Student Share before accessing shared cars.
                </Typography>

                <FormControl sx={{ mt: 2, mb: 2 }}>
                    <FormLabel>Student ID</FormLabel>
                    <Input name="studentID" type="text" placeholder="Enter your Student ID" required />
                </FormControl>
                <FormControl sx={{ mt: 2, mb: 2 }}>
                    <FormLabel>Driving License Number</FormLabel>
                    <Input name="drivingLicense" type="text" placeholder="Enter your License Number" required />
                </FormControl>
                <Button
                    variant="contained"
                    sx={{
                        mt: 3,
                        backgroundColor: '#2E3B4E',
                        color: 'white',
                        ':hover': {
                            backgroundColor: '#4C5E72',
                        },
                    }}
                    onClick={handleStudentShareRegister}
                >
                    Register for Student Share
                </Button>
            </>
        )}

        {/* Back to Home Button */}
        <Box sx={{ mt: 4 }}>
            <Button
                variant="contained"
                sx={{
                    backgroundColor: '#2E3B4E',
                    color: 'white',
                    ':hover': {
                        backgroundColor: '#4C5E72',
                    },
                }}
                onClick={runShowFirst}
            >
                Back to Home
            </Button>
        </Box>
    </Box>
)}




            {showMapApi && (
                <Box sx={{ p: 4, textAlign: 'center', backgroundColor: 'white', borderRadius: '10px' }}>
                    <Typography variant="h3">Map API</Typography>
                    <Typography>Page under construction</Typography>
                </Box>
            )}

            {showReviews && (
                <Box sx={{ p: 4, textAlign: 'center', backgroundColor: 'white', borderRadius: '10px' }}>
                    <Typography variant="h3">Reviews</Typography>
                    <Typography>Page under construction</Typography>
                </Box>
            )}

{showRent && (
    <Box
        sx={{
            p: 4,
            textAlign: 'center',
            backgroundColor: 'white',
            borderRadius: '10px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            maxWidth: '50%',
            margin: 'auto',
        }}
    >
        {/* Rent Page Header */}
        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 3, color: '#2E3B4E' }}>
            Complete Your Rental Booking
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: '#555' }}>
            Please fill in the details below to complete your rental.
        </Typography>

        {/* Rental Form */}
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField label="Pickup Location" variant="outlined" required fullWidth />
            <TextField label="Drop-off Location" variant="outlined" required fullWidth />
            <TextField label="Rental Start Date" type="date" InputLabelProps={{ shrink: true }} required fullWidth />
            <TextField label="Rental End Date" type="date" InputLabelProps={{ shrink: true }} required fullWidth />

            {/* Submit Button */}
            <Button
                variant="contained"
                sx={{
                    backgroundColor: '#2E3B4E',
                    color: 'white',
                    fontWeight: 'bold',
                    p: 1.5,
                    borderRadius: '5px',
                    mt: 3,
                }}
            >
                Confirm Your Booking
            </Button>
        </Box>
    </Box>
)}



            {showVehicles && <VehicleList username={username} />}
            {showContact && (
                <Box sx={{ p: 4, textAlign: 'center', backgroundColor: 'white', borderRadius: '10px' }}>
                    <Typography variant="h3">Contact</Typography>
                    <Typography>Page under construction</Typography>
                </Box>
            )}
        </Box>
    );
}
