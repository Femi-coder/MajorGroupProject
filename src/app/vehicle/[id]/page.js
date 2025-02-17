"use client";

import { useParams } from "next/navigation"; // ✅ Correct way for App Router
import { useEffect, useState } from "react";
import { Box, Typography, Card, CardMedia, CardContent, Button } from "@mui/material";

const vehiclesData = [
  { id: 1, make: "BYD", model: "Dolphin", year: 2022, price: 50, image: "https://www.byd.com/content/dam/byd-site/eu/electric-cars/dolphin/xl/Dolphin-exterior-04-SkiingwhiteUrbangrey-xl.jpg", details: "Electric car with 300 miles range." },
  { id: 2, make: "Tesla", model: "Model S", year: 2021, price: 45, image: "https://static1.topspeedimages.com/wordpress/wp-content/uploads/2023/06/tesla-model-s-plaid-2.jpg", details: "Luxury electric sedan with autopilot." },
  { id: 3, make: "Tesla", model: "Model 3", year: 2020, price: 40, image: "https://www.tesla.com/ownersmanual/images/GUID-B5641257-9E85-404B-9667-4DA5FDF6D2E7-online-en-US.png", details: "Affordable Tesla with high efficiency." },
  { id: 4, make: "Tesla", model: "Model X", year: 2023, price: 70, image: "https://images.prismic.io/carwow/c340a77d-af56-4562-abfb-bd5518ccb292_2023+Tesla+Model+X+front+quarter+moving.jpg", details: "Spacious electric SUV with Falcon doors." },
  { id: 5, make: "Tesla", model: "Model Y", year: 2022, price: 80, image: "https://images.hgmsites.net/lrg/2022-tesla-model-y-performance-awd-angular-front-exterior-view_100833533_l.jpg", details: "Compact SUV with advanced technology." },
];

const VehicleDetails = () => {
  const { id } = useParams(); // ✅ UseParams for App Router
  const [vehicle, setVehicle] = useState(null);

  useEffect(() => {
    if (id) {
      const selectedVehicle = vehiclesData.find(v => v.id === parseInt(id));
      setVehicle(selectedVehicle);
    }
  }, [id]);

  if (!vehicle) {
    return <Typography variant="h5" sx={{ textAlign: "center", mt: 5 }}>Loading...</Typography>;
  }

  return (
    <Box sx={{ p: 4, textAlign: "center" }}>
      <Card sx={{ maxWidth: 600, mx: "auto", boxShadow: 3 }}>
        <CardMedia
          component="img"
          height="300"
          image={vehicle.image}
          alt={`${vehicle.make} ${vehicle.model}`}
          sx={{ objectFit: "cover" }}
        />
        <CardContent>
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>{vehicle.make} {vehicle.model}</Typography>
          <Typography variant="h6">Year: {vehicle.year}</Typography>
          <Typography variant="h6" color="primary">Price: ${vehicle.price}/day</Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>{vehicle.details}</Typography>
          <Button variant="contained" sx={{ mt: 3, width: "100%" }}>Rent This Car</Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default VehicleDetails;
