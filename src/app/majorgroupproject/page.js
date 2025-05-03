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
import axios from "axios";
import { useRouter } from 'next/navigation';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";


import { useState, useEffect } from 'react';
import VehicleList from '../api/VehicleList/VehicleList.js';


export default function MyApp() {
    const router = useRouter()
    const [loggedIn, setLoggedIn] = useState(false);
    const [showFirstPage, setShowFirstPage] = useState(true);
    const [showRegister, setShowRegister] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showStudentShare, setShowStudentShare] = useState(false);
    const [showReviews, setShowReviews] = useState(false);
    const [showRent, setShowRent] = useState(false);
    const [showContact, setShowContact] = useState(false);
    const [showVehicles, setShowVehicles] = useState(false);
    const [username, setUsername] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [studentShareRegistered, setStudentShareRegistered] = useState(false);
    const [studentShareDetails, setStudentShareDetails] = useState(null);
    const [selectedRentVehicle, setSelectedRentVehicle] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [formData, setFormData] = useState({ name: "", vehicle: "", rating: "", comment: "" });
    const [pickup, setPickup] = useState('');
    const [dropoff, setDropoff] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [studentShareLoggedIn, setStudentShareLoggedIn] = useState(false);
    const [vehicles, setVehicles] = useState([]);
    const [showAdminPage, setShowAdminPage] = useState(false);
    const [adminLoggedIn, setAdminLoggedIn] = useState(false);
    const [transactions, setTransactions] = useState([]);



    useEffect(() => {
        const storedEmail = localStorage.getItem("user_email");
        const storedUsername = localStorage.getItem("username");
        const isStudentShare = localStorage.getItem("student_share_registered") === "true";
    
        if (storedEmail && storedUsername) {
            setUserEmail(storedEmail);
            setUsername(storedUsername);
    
            if (isStudentShare) {
                setStudentShareLoggedIn(true);
                setStudentShareRegistered(true);
                setLoggedIn(false); 
            } else {
                setLoggedIn(true);
                setStudentShareLoggedIn(false);
                setStudentShareRegistered(false); 
            }
        }
    }, []);
    useEffect(() => {
        if (showAdminPage) {
            fetchAdminVehicles();
        }
    }, [showAdminPage]);

    useEffect(() => {
        if (adminLoggedIn && showAdminPage) {
          fetchAdminTransactions();
        }
      }, [adminLoggedIn, showAdminPage]);

    useEffect(() => {
        // Check if admin is already logged in
        const storedAdmin = localStorage.getItem("admin_logged_in");
        if (storedAdmin === "true") {
            setAdminLoggedIn(true);
        }
    }, []);
    

    const resetPages = () => {
        setShowFirstPage(false);
        setShowRegister(false);
        setShowLogin(false);
        setShowStudentShare(false);
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

    const runShowReviews = () => {
        resetPages();
        setShowReviews(true);
    };

    

    const fetchAdminVehicles = async () => {
        try {
            const response = await fetch("/api/admin");
            const text = await response.text(); // Get raw response before parsing
            console.log("Raw response from server:", text);
    
            if (!response.ok) {
                console.error(`Server Error: ${response.status} - ${response.statusText}`);
                throw new Error(`Failed to fetch vehicles: ${response.statusText}`);
            }
    
            const data = text ? JSON.parse(text) : []; // Ensure parsing only if content exists
    
            if (!Array.isArray(data)) {
                console.error("Unexpected response format:", data);
                setVehicles([]); // Reset vehicles to prevent crashing
            } else {
                setVehicles(data);
            }
        } catch (error) {
            console.error("Error fetching vehicles:", error);
            setVehicles([]); 
        }
    };
    const fetchAdminTransactions = async () => {
        try {
          const res = await fetch("/api/adminTransactions");
          const data = await res.json();
          setTransactions(data);
        } catch (error) {
          console.error("Failed to load admin transactions:", error);
        }
      };
    
    

    const runShowRent = (vehicle = null) => {
        const storedEmail = localStorage.getItem("user_email"); // Fetch stored email
        const isStudentShare = localStorage.getItem("student_share_registered") === "true"; // Check if Student Share user
    
        if (!loggedIn && !isStudentShare && !storedEmail) {
            alert("You must be logged in to access the Rent page.");
            runShowLogin();
            return;
        }
    
        setSelectedRentVehicle(vehicle);
        resetPages();
        setShowRent(true);
    };
    const toggleVehicleAvailability = async (carId, currentStatus) => {
        try {
            console.log(`Updating vehicle ${carId} availability to ${!currentStatus}`);
    
            const response = await fetch('/api/admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ carId, available: !currentStatus }),
            });
    
            // Check response status
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Error: ${response.status} - ${response.statusText}`, errorText);
                alert("Failed to update vehicle availability.");
                return;
            }
    
            //  Parse JSON response safely
            const data = await response.json();
            console.log(" Success:", data);
    
            alert("Vehicle availability updated successfully!");
            fetchAdminVehicles();
        } catch (error) {
            console.error(' Error updating vehicle availability:', error);
            alert("Something went wrong. Please try again.");
        }
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
        const storedEmail = localStorage.getItem("user_email"); // Get email from storage
        const isStudentShare = localStorage.getItem("student_share_registered") === "true"; //  Check if Student Share user
    
        if (!loggedIn && !storedEmail && !isStudentShare) {
            alert("You must be logged in to access the Vehicles Page.");
            runShowLogin();
            return;
        }
    
        resetPages();
        setShowVehicles(true);
    };
    

    const handleLogin = async () => {
        const email = document.querySelector('input[name="email"]').value;
        const password = document.querySelector('input[name="password"]').value;
    
        try {
            const response = await fetch('/api/carlogin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
    
            const data = await response.json();
    
            if (data.error) {
                alert(data.error);
                return;
            }
    
            alert('Login successful!');
    
            //  Reset all states
            setLoggedIn(true);
            setStudentShareLoggedIn(false);  // Ensure Student Share login is off
            setStudentShareRegistered(false);
            setStudentShareDetails(null);
            setUserEmail(email);
            setUsername(data.username || 'User');
    
            //  Clear any Student Share session data
            localStorage.removeItem("student_share_registered");
            localStorage.removeItem("student_share_details");
    
            //  Store normal user login details
            localStorage.setItem("user_email", email);
            localStorage.setItem("username", data.username || 'User');
    
            //  Redirect to the home page
            runShowFirst();
    
        } catch (error) {
            console.error('Error during login:', error);
        }
    };
    
    
    useEffect(() => {
        axios.get("https://flask-api2-pifn.onrender.com/api/reviews")
            .then(response => setReviews(response.data))
            .catch(error => console.error("Error fetching reviews:", error));
    }, []);
    // Handle input changes
const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
};

// Submit a new review
const handleSubmit = (e) => {
    e.preventDefault();

    fetch("https://flask-api2-pifn.onrender.com/api/reviews", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: formData.name,
            vehicle: formData.vehicle,
            rating: formData.rating,
            comment: formData.comment
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log("Review added:", data);
        if (data.message) {
            alert("Review submitted successfully!");
            setReviews([...reviews, formData]);
            setFormData({ name: "", vehicle: "", rating: "", comment: "" });
        } else {
            alert("Error: " + data.error);
        }
    })
    .catch(error => console.error("Error adding review:", error));
};
const handleConfirmBooking = async () => {
    if (!selectedRentVehicle || !selectedRentVehicle.carId || !pickup || !dropoff || !startDate || !endDate) {
        alert("Please fill in all details!");
        return;
    }

    try {
        const storedUsername = localStorage.getItem("username"); // Fetch stored username
        const storedEmail = localStorage.getItem("user_email"); //  Fetch stored email
        const isStudentShare = localStorage.getItem("student_share_registered") === "true"; //  Check if Student Share user

        let finalPrice = selectedRentVehicle.price;
        if (isStudentShare) {
            finalPrice = (finalPrice * 0.85).toFixed(2); //  Apply 15% discount for Student Share members
        }

        const response = await fetch("https://flask-api1-1-j42x.onrender.com/api/transactions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_email: storedEmail,  // Send email to backend
                user_name: storedUsername,
                vehicle_id: selectedRentVehicle.carId,
                vehicle_name: `${selectedRentVehicle.make} ${selectedRentVehicle.model}`,
                amount: finalPrice,  //  Send the discounted price if applicable
                pickup,
                dropoff,
                start: startDate,
                end: endDate
            }),
        });

        const data = await response.json();
        if (response.ok) {
            alert("Booking Confirmed! Redirecting to Transaction Summary...");

            router.push(
                `/transaction?userName=${encodeURIComponent(storedUsername)}&vehicleName=${encodeURIComponent(selectedRentVehicle.make + " " + selectedRentVehicle.model)}&price=${encodeURIComponent(finalPrice)}&pickup=${encodeURIComponent(pickup)}&dropoff=${encodeURIComponent(dropoff)}&start=${encodeURIComponent(startDate)}&end=${encodeURIComponent(endDate)}&transactionId=${encodeURIComponent(data.transaction_id)}`
            );
        } else {
            alert(`Transaction Failed: ${data.error}`);
        }
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
};


const handleLogout = () => {
    setLoggedIn(false);
    setStudentShareLoggedIn(false);
    setUsername('');
    setUserEmail('');
    setStudentShareRegistered(false);
    setStudentShareDetails(null);

    //  Clear all stored session data
    localStorage.clear();

    alert('You have been logged out.');
    runShowFirst(); // Redirect to Home after logout
};


const handleStudentShareLogout = () => {
    setStudentShareLoggedIn(false);
    setUsername('');
    setUserEmail('');
    setStudentShareRegistered(false);
    setStudentShareDetails(null);

    //  Clear stored session data for Student Share
    localStorage.removeItem("user_email");
    localStorage.removeItem("username");
    localStorage.removeItem("student_share_registered");

    alert('You have been logged out from Student Share.');
    runShowFirst(); // Redirect to Home after logout
};


const handleShowStudentShare = () => {
    resetPages();

    if (loggedIn || studentShareLoggedIn) {
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
                setStudentShareDetails(data);
                setStudentShareLoggedIn(true);
                setUserEmail(data.email);
                setUsername(data.name);

                //  Store in localStorage
                localStorage.setItem("user_email", data.email);
                localStorage.setItem("username", data.name);
                localStorage.setItem("student_share_registered", "true");
            }
            setShowStudentShare(true);
        })
        .catch((err) => console.error('Error fetching Student Share details:', err));
    } else {
        setShowStudentShare(true);
    }
};
    
    
    
    
const handleStudentShareRegister = () => {
    const registerForm = document.querySelector('#studentShareRegisterForm');

    if (!registerForm) {
        alert("Form not found.");
        return;
    }

    const name = registerForm.querySelector('input[name="registerName"]').value.trim();
    const email = registerForm.querySelector('input[name="registerEmail"]').value.trim();
    const studentID = registerForm.querySelector('input[name="registerStudentID"]').value.trim();
    const drivingLicense = registerForm.querySelector('input[name="registerDrivingLicense"]').value.trim();
    const password = registerForm.querySelector('input[name="registerPassword"]').value.trim();
    const confirmPassword = registerForm.querySelector('input[name="registerConfirmPassword"]').value.trim();

    if (!name || !email || !studentID || !drivingLicense || !password || !confirmPassword) {
        alert("All fields in the registration form are required.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    fetch('/api/studentshare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, studentID, drivingLicense, password }),
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            alert('You have successfully registered for Student Share!');

            //  Store user data in localStorage
            localStorage.setItem("user_email", email);
            localStorage.setItem("username", name);
            localStorage.setItem("student_share_registered", "true");

            //  Set the correct states
            setLoggedIn(false); // Logout normal user
            setStudentShareLoggedIn(true); //  Mark Student Share as logged in
            setUserEmail(email);
            setUsername(name);
            setStudentShareRegistered(true);
            setStudentShareDetails({ name, email, studentID, drivingLicense });

            setTimeout(() => {
                runShowVehicles();
            }, 300);
        }
    })
    .catch(err => console.error('Error during Student Share registration:', err));
};

const handleStudentShareLogin = () => {
    const email = document.querySelector('input[name="loginEmail"]').value.trim();
    const password = document.querySelector('input[name="loginPassword"]').value.trim();


    if (!email|| !password) {
        alert("Please enter your email.");
        return;
    }

    fetch('/api/getStudentShareDetails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    })
    .then((res) => res.json())
    .then((data) => {
        if (data.error) {
            alert("Invalid email or password.");
        } else {
            alert("Student Share Login successful!");

            //  Reset normal user login states
            setLoggedIn(false);
            setStudentShareLoggedIn(true);
            setStudentShareRegistered(true);
            setStudentShareDetails(data);
            setUserEmail(email);
            setUsername(data.name);

            //Remove normal user session data
            localStorage.removeItem("user_email");
            localStorage.removeItem("username");

            // Store Student Share session details
            localStorage.setItem("user_email", email);
            localStorage.setItem("username", data.name);
            localStorage.setItem("student_share_registered", "true");

            // Redirect to vehicles page
            runShowVehicles();
        }
    })
    .catch((err) => console.error("Error during Student Share login:", err));
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
    const handleAdminLogin = async () => {
        const email = prompt("Enter admin email:")?.trim().toLowerCase();
        const password = prompt("Enter admin password:")?.trim();
    
        if (!email || !password) {
            alert("Please enter both email and password.");
            return;
        }
    
        try {
            const response = await fetch("/api/adminLogin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                alert("Admin login successful!");
                localStorage.setItem("admin_logged_in", "true");
                localStorage.setItem("admin_name", data.name || "Admin");
                setAdminLoggedIn(true);
            } else {
                alert("Login failed: " + data.error);
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert("Something went wrong. Please try again.");
        }
    };
    
    
    const handleAdminLogout = () => {
        localStorage.removeItem("admin_logged_in");
        setAdminLoggedIn(false);
        setShowAdminPage(false);
        alert("Logged out successfully.");
    };

    return (
        <Box
    sx={{
        position: 'relative',
        width: '100vw',
        minHeight: '100%',
        backgroundColor: '#2E3B4E',
        color: 'lightgreen',
        overflowY: 'auto', // Enables vertical scrolling
        display: 'flex',
        flexDirection: 'column',
    }}
>

<AppBar position="static" sx={{ backgroundColor: 'lightgreen' }}>
    <Toolbar>
        <Typography variant="h4" component="div" sx={{ flexGrow: 1, color: '#2E3B4E', fontWeight: 'bold' }}>
            Eco Wheels Dublin
        </Typography>

        <Button color="inherit" sx={{ fontWeight: 'bold' }} onClick={runShowFirst}>
            Home
        </Button>

       {/* Show Register & Login if NO user is logged in */}
{!loggedIn && !studentShareLoggedIn ? (
    <>
        <Button color="inherit" sx={{ fontWeight: 'bold' }} onClick={runShowRegister}>
            Register
        </Button>
        <Button color="inherit" sx={{ fontWeight: 'bold' }} onClick={runShowLogin}>
            Login
        </Button>
    </>
) : null}

{loggedIn && (
    <Button color="inherit" sx={{ fontWeight: 'bold' }} onClick={handleLogout}>
        Logout (Normal User)
    </Button>
)}

{studentShareLoggedIn && (
    <Button color="inherit" sx={{ fontWeight: 'bold' }} onClick={handleStudentShareLogout}>
        Logout (Student Share User)
    </Button>
)}

<Button color="inherit" sx={{ fontWeight: 'bold' }} onClick={handleShowStudentShare}>
    Student Share
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
{/*  Shows Admin Login button when NOT logged in */}
{!adminLoggedIn && (
    <Button color="inherit" sx={{ fontWeight: 'bold' }}
        onClick={handleAdminLogin}
    >
        Admin Login
    </Button>
)}

{/*Show "Go to Admin Panel" button when logged in */}
{adminLoggedIn && (
    <>
        <Button
            variant="contained"
            sx={{ mt: 2, backgroundColor: "#2E3B4E", color: "white", ml: 2 }}
            onClick={() => setShowAdminPage(true)}
        >
            Go to Admin Panel
        </Button>

        {/* Shows Logout button for Admin */}
        <Button
            variant="contained"
            sx={{ mt: 2, backgroundColor: "red", color: "white", ml: 2 }}
            onClick={handleAdminLogout}
        >
            Logout Admin
        </Button>
    </>
)}




    </Toolbar>
</AppBar>



{showFirstPage && (
  <Box sx={{ p: 0, backgroundColor: '#F4F6F8', minHeight: '100vh' }}>
    {/* HERO SECTION */}
    <Box
      sx={{
        width: '100%',
        py: 10,
        px: 2,
        textAlign: 'center',
        background: 'linear-gradient(to right, #1C1F26, #2E3B4E)',
        color: 'white',
      }}
    >
      <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
        ⚡ Eco Wheels Dublin
      </Typography>
      <Typography variant="h6" sx={{ maxWidth: '720px', mx: 'auto', lineHeight: 1.6 }}>
        Green, clean & affordable electric car rentals tailored for students and eco-conscious drivers in Dublin.
      </Typography>

      {loggedIn && (
        <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            sx={{ backgroundColor: '#4CAF50', color: 'white', fontWeight: 'bold', px: 3 }}
            onClick={runShowVehicles}
          >
            🚗 Explore Rentals
          </Button>
          <Button
            variant="outlined"
            sx={{ borderColor: '#fff', color: '#fff', fontWeight: 'bold', px: 3 }}
            onClick={handleShowStudentShare}
          >
            🎓 Student Share
          </Button>
          <Typography
            variant="h6"
            sx={{
              mt: 1,
              px: 3,
              py: 1,
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '10px',
              fontWeight: 'bold',
            }}
          >
            👋 Welcome, {username}
          </Typography>
        </Box>
      )}
    </Box>

    {/* FEATURES / CAR SECTION */}
    <Box
      sx={{
        py: 8,
        px: 3,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 4,
        backgroundColor: '#fff',
      }}
    >
      {[
        {
          title: 'Affordable Rentals',
          img: 'https://changinglanes.ie/wp-content/uploads/2024/01/BYD-SEAL-1-scaled.jpg',
        },
        {
          title: 'Eco-Friendly Fleet',
          img: 'https://c.ndtvimg.com/2021-11/1316no38_mg-zs-ev_625x300_26_November_21.jpg',
        },
        {
          title: 'Convenient Locations',
          img: 'https://car-images.bauersecure.com/wp-images/2697/kia_ev6_best_electric_cars_2024.jpg',
        },
        {
          title: 'Charging Included',
          img: 'https://timestech.in/wp-content/uploads/2019/09/Electric-Vehicle.jpg',
        },
      ].map((car, index) => (
        <Box
          key={index}
          sx={{
            width: { xs: '90%', sm: '45%', md: '300px' },
            borderRadius: '12px',
            overflow: 'hidden',
            backgroundColor: '#F9F9F9',
            boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s ease',
            ':hover': {
              transform: 'scale(1.03)',
            },
          }}
        >
          <img src={car.img} alt={car.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
          <Typography sx={{ p: 2, fontWeight: 'bold', textAlign: 'center', color: '#2E3B4E' }}>
            {car.title}
          </Typography>
        </Box>
      ))}
    </Box>

    {/* CTA SECTION */}
    <Box
      sx={{
        py: 8,
        px: 3,
        textAlign: 'center',
        backgroundColor: '#F4F6F8',
        borderTop: '1px solid #ddd',
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2E3B4E', mb: 2 }}>
        🚀 Ready to Drive Green?
      </Typography>
      <Typography variant="body1" sx={{ maxWidth: '640px', mx: 'auto', mb: 4 }}>
        Join our movement toward sustainability. Register now and get behind the wheel of your future.
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#2E3B4E',
            color: 'white',
            px: 4,
            py: 1.5,
            fontWeight: 'bold',
            borderRadius: '8px',
            ':hover': { backgroundColor: '#1A232F' },
          }}
          onClick={runShowRegister}
        >
          🔥 Register as a User
        </Button>

        <Button
          variant="outlined"
          sx={{
            borderColor: '#2E3B4E',
            color: '#2E3B4E',
            px: 4,
            py: 1.5,
            fontWeight: 'bold',
            borderRadius: '8px',
            ':hover': {
              backgroundColor: '#eeeeee',
            },
          }}
          onClick={handleShowStudentShare}
        >
          💼 Student Share Sign Up
        </Button>
      </Box>
    </Box>
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
    <Box sx={{ p: 4, textAlign: "center", backgroundColor: "white", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
        <Typography variant="h4" sx={{ color: "#2E3B4E", fontWeight: "bold", mb: 2 }}>
            Hello, {username || "Guest"}!
        </Typography>

        {studentShareRegistered && studentShareDetails ? (
            <>
                <Typography variant="h3" sx={{ color: "#2E3B4E", fontWeight: "bold", mb: 2 }}>
                    You are a Student Share Member!
                </Typography>
                <Typography sx={{ color: "#2E3B4E" }}>
                    <strong>Student ID:</strong> {studentShareDetails.studentID}
                </Typography>
                <Typography sx={{ color: "#2E3B4E" }}>
                    <strong>Driving License:</strong> {studentShareDetails.drivingLicense}
                </Typography>
                <Button
                    variant="contained"
                    sx={{ mt: 3, backgroundColor: "#2E3B4E", color: "white", ":hover": { backgroundColor: "#4C5E72" } }}
                    onClick={runShowVehicles}
                >
                    Go to Vehicles
                </Button>
            </>
        ) : (
            <>
                <Typography variant="h3" sx={{ color: "#2E3B4E", fontWeight: "bold", mb: 2 }}>
                Student Share Login
            </Typography>
            <FormControl sx={{ mt: 2, mb: 2 }}>
                <FormLabel>Email Address</FormLabel>
                <Input name="loginEmail" type="email" placeholder="Enter your email" required />
            </FormControl>
            <FormControl sx={{ mt: 2, mb: 2 }}>
                <FormLabel>Password</FormLabel>
                <Input name="loginPassword" type="password" placeholder="Enter your password" required />
            </FormControl>

                <Button
                    variant="contained"
                    sx={{ mt: 2, backgroundColor: "#2E3B4E", color: "white", ":hover": { backgroundColor: "#4C5E72" } }}
                    onClick={handleStudentShareLogin}
                >
                    Login
                </Button>

                {/* Student Share Registration Form */}
                <Typography variant="h3" sx={{ color: "#2E3B4E", fontWeight: "bold", mt: 4 }}>
                    Or Register for Student Share
                </Typography>
                <Box component="form" id="studentShareRegisterForm" sx={{ mt: 4 }}>
                    <FormControl sx={{ mt: 2, mb: 2 }}>
                        <FormLabel>Full Name</FormLabel>
                        <Input name="registerName" type="text" placeholder="Enter your full name" required />
                    </FormControl>
                    <FormControl sx={{ mt: 2, mb: 2 }}>
                        <FormLabel>Email Address</FormLabel>
                        <Input name="registerEmail" type="email" placeholder="Enter your email" required />
                    </FormControl>
                    <FormControl sx={{ mt: 2, mb: 2 }}>
                        <FormLabel>Student ID</FormLabel>
                        <Input name="registerStudentID" type="text" placeholder="Enter your Student ID" required />
                    </FormControl>
                    <FormControl sx={{ mt: 2, mb: 2 }}>
                        <FormLabel>Driving License Number</FormLabel>
                        <Input name="registerDrivingLicense" type="text" placeholder="Enter your License Number" required />
                    </FormControl>
                    <FormControl sx={{ mt: 2, mb: 2 }}>
                    <FormLabel>Password</FormLabel>
                    <Input name="registerPassword" type="password" placeholder="Enter a password" required />
                </FormControl>
                <FormControl sx={{ mt: 2, mb: 2 }}>
                    <FormLabel>Confirm Password</FormLabel>
                    <Input name="registerConfirmPassword" type="password" placeholder="Confirm your password" required />
                </FormControl>
                    <Button
                        variant="contained"
                        sx={{ mt: 3, backgroundColor: "#2E3B4E", color: "white", ":hover": { backgroundColor: "#4C5E72" } }}
                        onClick={handleStudentShareRegister}
                    >
                        Register for Student Share
                    </Button>
                </Box>

                {/* Back to Home Button */}
                <Box sx={{ mt: 4 }}>
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: "#2E3B4E", color: "white", ":hover": { backgroundColor: "#4C5E72" } }}
                        onClick={runShowFirst}
                    >
                        Back to Home
                    </Button>
                </Box>
            </>
        )}
    </Box>
)}


{showReviews && (
    <Box 
        sx={{ 
            p: 4, 
            textAlign: "center", 
            backgroundColor: "white", 
            borderRadius: "10px", 
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)", 
            maxWidth: "800px", 
            margin: "auto" 
        }}
    >
        <Typography variant="h3" sx={{ color: "#2E3B4E", fontWeight: "bold", mb: 3 }}>
            Vehicle Reviews
        </Typography>

        {/* Fetch and Display Reviews */}
        {reviews.length > 0 ? (
            reviews.map((review, index) => (
                <Box 
                    key={index} 
                    sx={{ 
                        backgroundColor: "#f5f5f5", 
                        padding: 3, 
                        borderRadius: "10px", 
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)", 
                        mb: 2 
                    }}
                >
                    <Typography variant="h5" sx={{ fontWeight: "bold", color: "#2E3B4E" }}>
                        {review.vehicle} - ⭐ {review.rating}/5
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#555", fontStyle: "italic" }}>
                        "{review.comment}"
                    </Typography>
                    <Typography variant="caption" sx={{ display: "block", color: "gray" }}>
                        - {review.name}
                    </Typography>
                </Box>
            ))
        ) : (
            <Typography variant="body1" sx={{ color: "#555", fontStyle: "italic" }}>
                No reviews yet. Be the first to review!
            </Typography>
        )}

        {/* Review Form */}
        <Box 
            component="form" 
            sx={{ mt: 4, textAlign: "left" }} 
            onSubmit={handleSubmit}
        >
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#2E3B4E", mb: 2 }}>
                Submit Your Review
            </Typography>
            
            <TextField 
                label="Your Name" 
                variant="outlined" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                fullWidth 
                sx={{ mb: 2 }} 
            />
            <TextField 
                label="Vehicle Name" 
                variant="outlined" 
                name="vehicle" 
                value={formData.vehicle} 
                onChange={handleChange} 
                required 
                fullWidth 
                sx={{ mb: 2 }} 
            />
            <TextField 
                label="Rating (1-5)" 
                variant="outlined" 
                name="rating" 
                type="number" 
                value={formData.rating} 
                onChange={handleChange} 
                required 
                fullWidth 
                sx={{ mb: 2 }} 
            />
            <TextField 
                label="Write your review..." 
                variant="outlined" 
                name="comment" 
                value={formData.comment} 
                onChange={handleChange} 
                multiline 
                rows={3} 
                required 
                fullWidth 
                sx={{ mb: 2 }} 
            />
            <Button 
                type="submit" 
                variant="contained" 
                sx={{ backgroundColor: "#2E3B4E", color: "white", ":hover": { backgroundColor: "#4C5E72" } }}
            >
                Submit Review
            </Button>
        </Box>
    </Box>
)}



{showContact && (
    <Box
        sx={{
            p: 5,
            textAlign: 'center',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
            maxWidth: '600px',
            margin: 'auto',
            mt: 5,
        }}
    >
        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2, color: '#2E3B4E' }}>
            Contact Us
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: '#555' }}>
            Have any questions? Fill in the form below and we’ll get back to you as soon as possible.
        </Typography>

        {/* Contact Form */}
        <Box
            component="form"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2.5,
                textAlign: 'left',
            }}
            onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const name = formData.get('name').trim();
                const email = formData.get('email').trim();
                const phone = formData.get('phone').trim();
                const subject = formData.get('subject').trim();
                const message = formData.get('message').trim();

                if (!name || !email || !phone || !subject || !message) {
                    alert('Please fill in all fields before submitting.');
                    return;
                }
                try {
                    const res = await fetch('/api/contact', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ name, email, phone, subject, message }),
                    });
                
                    const data = await res.json();
                    if (res.ok) {
                        alert('Message sent successfully!');
                        e.target.reset();
                      } else {
                        alert(data.error || 'Something went wrong.');
                      }
                    } catch (err) {
                      console.error('Submission error:', err);
                      alert('An error occurred. Please try again.');
                    }
                  }}
        >
            <TextField label="Full Name" name="name" variant="outlined" required fullWidth />
            <TextField label="Email Address" name="email" type="email" variant="outlined" required fullWidth />
            <TextField label="Phone Number" name="phone" type="tel" variant="outlined" required fullWidth />
            <TextField label="Subject" name="subject" variant="outlined" required fullWidth />
            <TextField label="Message" name="message" multiline rows={4} variant="outlined" required fullWidth />

            {/* Submit Button */}
            <Button
                type="submit"
                variant="contained"
                sx={{
                    backgroundColor: '#2E3B4E',
                    color: 'white',
                    fontWeight: 'bold',
                    p: 1.5,
                    borderRadius: '5px',
                    mt: 2,
                    ':hover': {
                        backgroundColor: '#4C5E72',
                    },
                }}
            >
                Send Message
            </Button>
        </Box>
    </Box>
)}



{showRent && selectedRentVehicle && (
    <Box
        sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            backgroundColor: "#2E3B4E",
            padding: "20px",
        }}
    >
        <Box
            sx={{
                width: "90%",
                maxWidth: "600px",
                backgroundColor: "white",
                borderRadius: "10px",
                padding: "20px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.2)", // Softer shadow
                textAlign: "center",
            }}
        >
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#2E3B4E", mb: 2 }}>
                {selectedRentVehicle.make} {selectedRentVehicle.model} ({selectedRentVehicle.year})
            </Typography>
            <img 
                src={selectedRentVehicle.image} 
                alt={selectedRentVehicle.model} 
                style={{ width: "100%", borderRadius: "10px", marginBottom: "20px" }} 
            />
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "#2E3B4E", mb: 1 }}>
                Price: ${selectedRentVehicle.price}/day
            </Typography>

            {/* Rental Form */}
            <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField label="Pickup Location" variant="outlined" value={pickup} onChange={(e) => setPickup(e.target.value)} required fullWidth sx={{ mb: 2 }} />
            <TextField label="Drop-off Location" variant="outlined" value={dropoff} onChange={(e) => setDropoff(e.target.value)} required fullWidth sx={{ mb: 2 }} />
            <TextField label="Rental Start Date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} InputLabelProps={{ shrink: true }} required fullWidth sx={{ mb: 2 }} />
            <TextField label="Rental End Date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} InputLabelProps={{ shrink: true }} required fullWidth sx={{ mb: 2 }} />
     <Button variant="contained"
    sx={{
        backgroundColor: "#2E3B4E",
        color: "white",
        fontWeight: "bold",
        padding: "10px",
        borderRadius: "5px",
        mt: 2,
    }}
    onClick={handleConfirmBooking}
>
    Confirm Your Booking
</Button>

            </Box>
        </Box>
    </Box>
)}
{adminLoggedIn && showAdminPage && (
  <Box sx={{ p: 4, textAlign: "center", backgroundColor: "#f5f5f5" }}>
    <Typography variant="h3" sx={{ fontWeight: "bold", mb: 4 }}>
      Admin Dashboard - Manage Vehicles
    </Typography>

    {/* VEHICLES TABLE */}
    <TableContainer component={Paper} sx={{ maxWidth: "900px", margin: "auto", mb: 6 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Vehicle</strong></TableCell>
            <TableCell><strong>Year</strong></TableCell>
            <TableCell><strong>Price ($/day)</strong></TableCell>
            <TableCell><strong>Availability</strong></TableCell>
            <TableCell><strong>Action</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vehicles.map((vehicle) => (
            <TableRow key={vehicle.carId}>
              <TableCell>{vehicle.make} {vehicle.model}</TableCell>
              <TableCell>{vehicle.year}</TableCell>
              <TableCell>${vehicle.price}</TableCell>
              <TableCell>{vehicle.available ? "Available" : "Unavailable"}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: vehicle.available ? "red" : "green", color: "white" }}
                  onClick={() => toggleVehicleAvailability(vehicle.carId, vehicle.available)}
                >
                  {vehicle.available ? "Set Unavailable" : "Set Available"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    {/* TRANSACTIONS TABLE */}
    <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }}>
      All Transactions
    </Typography>

    <TableContainer component={Paper} sx={{ maxWidth: "1100px", margin: "auto" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>User</strong></TableCell>
            <TableCell><strong>Email</strong></TableCell>
            <TableCell><strong>Vehicle</strong></TableCell>
            <TableCell><strong>Price</strong></TableCell>
            <TableCell><strong>Pickup</strong></TableCell>
            <TableCell><strong>Dropoff</strong></TableCell>
            <TableCell><strong>Start</strong></TableCell>
            <TableCell><strong>End</strong></TableCell>
            <TableCell><strong>Transaction ID</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((t, index) => (
            <TableRow key={index}>
              <TableCell>{t.user_name}</TableCell>
              <TableCell>{t.user_email}</TableCell>
              <TableCell>{t.vehicle_name}</TableCell>
              <TableCell>${t.amount}</TableCell>
              <TableCell>{t.pickup}</TableCell>
              <TableCell>{t.dropoff}</TableCell>
              <TableCell>{t.start}</TableCell>
              <TableCell>{t.end}</TableCell>
              <TableCell>{t.transaction_id}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
)}






{showVehicles && <VehicleList username={username} runShowRent={runShowRent} />}
            

        </Box>
    );
}
