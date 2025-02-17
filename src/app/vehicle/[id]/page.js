"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Box, Typography, Card, CardMedia, CardContent, Grid } from "@mui/material";

// ✅ Full vehicle data for dynamic rendering
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

const VehicleDetails = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);

  useEffect(() => {
    if (id) {
      const selectedVehicle = vehiclesData.find(v => v.id === parseInt(id));
      setVehicle(selectedVehicle);
    }
  }, [id]);

  if (!vehicle) {
    return <Typography variant="h5" sx={{ textAlign: "center", mt: 5 }}>Vehicle Not Found</Typography>;
  }

  return (
    <Box 
      sx={{ 
        p: 4, 
        maxWidth: 900, 
        mx: "auto", 
        backgroundColor: "#ffffff", 
        borderRadius: 2, 
        boxShadow: 3 
      }}
    >
      <Grid container spacing={2}>
        
        {/* Left Side: Image */}
        <Grid item xs={12} md={4}>
          <CardMedia
            component="img"
            image={vehicle.image}
            alt={`${vehicle.make} ${vehicle.model}`}
            sx={{ 
              width: "100%", 
              borderRadius: 2, 
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)" 
            }} // ✅ Improved shadow on image
          />
        </Grid>

        {/* Right Side: Details */}
        <Grid item xs={12} md={8}>
          <CardContent>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: "bold", 
                color: "#333", 
                textShadow: "1px 1px 3px rgba(0,0,0,0.2)" 
              }} // ✅ Darker, more readable text
            >
              {vehicle.category}
            </Typography>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: "#555", 
                mb: 2, 
                textShadow: "0px 1px 3px rgba(0,0,0,0.1)" 
              }} // ✅ Subtle shadow for readability
            >
              {vehicle.type}
            </Typography>
            
            {/* Specifications */}
            <ul style={{ paddingLeft: "20px", color: "#222", fontSize: "16px" }}>
              <li><strong>{vehicle.passengers}</strong> Passengers</li>
              <li>{vehicle.luggage}</li>
              <li>{vehicle.transmission}</li>
              <li>{vehicle.airConditioning}</li>
              <li>Fuel Consumption: {vehicle.fuelConsumption}</li>
              <li>Damage Excess: {vehicle.damageExcess}</li>
              <li>Theft Excess: {vehicle.theftExcess}</li>
            </ul>
          </CardContent>
        </Grid>
      </Grid>

      {/* Notes Section */}
      <Box 
        sx={{ 
          mt: 3, 
          p: 2, 
          backgroundColor: "#f9f9f9", 
          borderRadius: 2, 
          boxShadow: "0px 4px 8px rgba(0,0,0,0.1)"
        }} // ✅ Light gray background for notes
      >
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: "bold", 
            color: "#222", 
            mb: 1 
          }} // ✅ Darker text for contrast
        >
          Please Note
        </Typography>
        <ul style={{ paddingLeft: "20px", color: "#444", fontSize: "15px" }}>
          {vehicle.notes.map((note, index) => (
            <li key={index}>{note}</li>
          ))}
        </ul>
      </Box>
    </Box>
  );
};

export default VehicleDetails;
