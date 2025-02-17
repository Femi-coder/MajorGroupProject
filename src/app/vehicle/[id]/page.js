"use client";

import { useState, useEffect } from "react";
import { Box, Typography, Card, CardMedia, CardContent, Button, Modal, Fade, Backdrop } from "@mui/material";

// ✅ Vehicle Data
const vehiclesData = [
  { 
    id: 1, 
    make: "BYD", 
    model: "Dolphin", 
    category: "(Group X) BYD Dolphin or similar",
    type: "Full-Size, SUV, Automatic, Aircon (Group X) FFAR",
    passengers: 5,
    luggage: "3 Large Suitcases, 2 Small Suitcases",
    transmission: "Automatic Transmission",
    airConditioning: "Air Conditioning",
    fuelConsumption: "7.1 l/100km (approximate)",
    damageExcess: "3500 EUR",
    theftExcess: "3500 EUR",
    image: "https://www.byd.com/content/dam/byd-site/eu/electric-cars/dolphin/xl/Dolphin-exterior-04-SkiingwhiteUrbangrey-xl.jpg",
    notes: [
      "Optional extras such as SuperCover are available to purchase at the location.",
      "Excess amounts are based on standard inclusions, rates which include Collision Damage Waiver and Theft Protection.",
      "Pre-Pay Online: Allows you to reserve your vehicle and save money by pre-paying online.",
      "Pay at location: Allows you to reserve your vehicle and pay at the counter upon collection.",
      "Some vehicles may require a minimum age between 25 and 30 years and have restrictions on payment methods (up to 2 credit cards).",
      "The vehicles shown are examples. Specific models within a car class may vary in availability and features."
    ]
  }
];

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setVehicles(vehiclesData);
  }, []);

  // ✅ Open Modal Directly (No Navigation)
  const handleOpen = (vehicle, event) => {
    event.preventDefault(); // 🚨 Prevents navigation
    setSelectedVehicle(vehicle);
    setOpen(true);
  };

  // ✅ Close Modal
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ p: 4, textAlign: "center", backgroundColor: "#f5f5f5" }}>
      <Typography variant="h3" sx={{ fontWeight: "bold", mb: 4 }}>Choose Your Vehicle</Typography>
      
      {/* ✅ Vehicle List */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 4 }}>
        {vehicles.map((vehicle) => (
          <Card 
            key={vehicle.id} 
            sx={{ maxWidth: 345, mx: "auto", boxShadow: 3, cursor: "pointer" }}
            onClick={(event) => handleOpen(vehicle, event)} // ✅ Prevent navigation
          >
            <CardMedia
              component="img"
              height="200"
              image={vehicle.image}
              alt={`${vehicle.make} ${vehicle.model}`}
              sx={{ objectFit: "cover" }}
            />
            <CardContent>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>{vehicle.make} {vehicle.model}</Typography>
              <Typography variant="body1">Year: {vehicle.year}</Typography>
              <Typography variant="body1" color="primary">Price: ${vehicle.price}/day</Typography>
              <Button 
                variant="contained" 
                sx={{ mt: 2, width: "100%" }} 
                onClick={(event) => handleOpen(vehicle, event)} // ✅ Also ensure button does not navigate
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* ✅ Vehicle Details Modal (Overlay) */}
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={open}>
          <Box 
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "90%",
              maxWidth: "800px",
              bgcolor: "white",
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
              outline: "none"
            }}
          >
            {selectedVehicle && (
              <>
                {/* ✅ Close Button */}
                <Button 
                  onClick={handleClose} 
                  sx={{ position: "absolute", top: 10, right: 10, color: "#555", fontSize: "16px" }}
                >
                  ✕ CLOSE
                </Button>

                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                  {selectedVehicle.category}
                </Typography>
                <Typography variant="subtitle1" sx={{ color: "gray", mb: 2 }}>
                  {selectedVehicle.type}
                </Typography>

                <Box sx={{ display: "flex", gap: 2 }}>
                  {/* Left: Image */}
                  <CardMedia
                    component="img"
                    image={selectedVehicle.image}
                    alt={selectedVehicle.model}
                    sx={{ width: "50%", borderRadius: 2 }}
                  />

                  {/* Right: Details */}
                  <Box sx={{ width: "50%" }}>
                    <ul style={{ paddingLeft: "20px", color: "#222", fontSize: "16px" }}>
                      <li><strong>{selectedVehicle.passengers}</strong> Passengers</li>
                      <li>{selectedVehicle.luggage}</li>
                      <li>{selectedVehicle.transmission}</li>
                      <li>{selectedVehicle.airConditioning}</li>
                      <li>Fuel Consumption: {selectedVehicle.fuelConsumption}</li>
                      <li>Damage Excess: {selectedVehicle.damageExcess}</li>
                      <li>Theft Excess: {selectedVehicle.theftExcess}</li>
                    </ul>
                  </Box>
                </Box>

                {/* Notes Section */}
                <Box 
                  sx={{ 
                    mt: 3, 
                    p: 2, 
                    backgroundColor: "#f9f9f9", 
                    borderRadius: 2, 
                    boxShadow: "0px 4px 8px rgba(0,0,0,0.1)"
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "#222", mb: 1 }}>
                    Please Note
                  </Typography>
                  <ul style={{ paddingLeft: "20px", color: "#444", fontSize: "15px" }}>
                    {selectedVehicle.notes.map((note, index) => (
                      <li key={index}>{note}</li>
                    ))}
                  </ul>
                </Box>
              </>
            )}
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default VehicleList;
