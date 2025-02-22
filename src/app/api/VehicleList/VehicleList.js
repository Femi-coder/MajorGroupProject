"use client";

import { useState, useEffect } from "react";
import { Box, Typography, Card, CardMedia, CardContent, Button, Modal, Fade, Backdrop } from "@mui/material";

const VehicleList = ({ username }) => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("/api/vehicles")
      .then(res => res.json())
      .then(data => setVehicles(data))
      .catch(error => console.error("Error fetching vehicles:", error));
  }, []);

  // ✅ Open Modal
  const handleOpen = (event, vehicle) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedVehicle(vehicle);
    setOpen(true);
  };

  // ✅ Close Modal
  const handleClose = () => {
    setOpen(false);
  };

  // ✅ Rent Vehicle Function
  const handleRent = (carId) => {
    fetch("/api/rent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ carId: Number(carId) })
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            setVehicles(prevVehicles => 
                prevVehicles.map(vehicle =>
                    vehicle.carId === carId ? { ...vehicle, availability: false } : vehicle
                )
            );
            alert("Vehicle has been rented!");
            setOpen(false);
        }
    })
    .catch(error => console.error("Error renting vehicle:", error));
};


  return (
    <Box sx={{ p: 4, textAlign: "center", backgroundColor: "#f5f5f5" }}>
      {username && (
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2, color: "#2E3B4E" }}>
          Hello, {username}!
        </Typography>
      )}
      <Typography variant="h3" sx={{ fontWeight: "bold", mb: 4 }}>Choose Your Vehicle</Typography>

      {/* ✅ Vehicle List */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 4 }}>
        {vehicles.map((vehicle) => (
          <Card key={vehicle.carId} sx={{ maxWidth: 345, mx: "auto", boxShadow: 3, cursor: "pointer" }} onClick={(event) => handleOpen(event, vehicle)}>
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
              <Button variant="contained" sx={{ mt: 2, width: "100%" }} disabled={!vehicle.availability}>
                {vehicle.availability ? "Rent Now" : "Unavailable"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* ✅ Vehicle Details Modal */}
      <Modal open={open} onClose={handleClose} closeAfterTransition BackdropComponent={Backdrop} BackdropProps={{ timeout: 500 }}>
        <Fade in={open}>
          <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "90%", maxWidth: "800px", bgcolor: "white", borderRadius: 2, boxShadow: 24, p: 4, outline: "none" }}>
            {selectedVehicle && (
              <>
                <Button onClick={handleClose} sx={{ position: "absolute", top: 10, right: 10, color: "#555", fontSize: "16px" }}>
                  ✕ CLOSE
                </Button>

                <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", md: "row" } }}>
                  <CardMedia component="img" image={selectedVehicle.image} alt={selectedVehicle.model} sx={{ width: { xs: "100%", md: "50%" }, borderRadius: 2 }} />

                  <Box sx={{ width: { xs: "100%", md: "50%" } }}>
                    <Typography variant="h5" sx={{ fontWeight: "bold", color: "#222", fontSize: "24px", textShadow: "1px 1px 3px rgba(0, 0, 0, 0.2)", mb: 2 }}>
                      {selectedVehicle.make} {selectedVehicle.model} ({selectedVehicle.year})
                    </Typography>
                    <Typography variant="body1" color="primary" sx={{ fontSize: "18px", mb: 2 }}>
                      Price: ${selectedVehicle.price}/day
                      </Typography>
                            <ul style={{ paddingLeft: "20px", color: "#444", fontSize: "16px" }}>
                                <li><strong>Transmission:</strong> {selectedVehicle.transmission}</li>
                                <li><strong>Seats:</strong> {selectedVehicle.seats}</li>
                                <li><strong>Type:</strong> {selectedVehicle.type}</li>
                                <li><strong>Fuel:</strong> {selectedVehicle.fuel}</li>
                                <li><strong>Range:</strong> {selectedVehicle.range}</li>
                  </ul>
                  </Box>
                </Box>

                <Box sx={{ textAlign: "center", mt: 3 }}>
                  <Button variant="contained" color="primary" sx={{ width: "50%" }} disabled={!selectedVehicle.availability} onClick={() => handleRent(selectedVehicle.carId)}>
                    Rent This Vehicle
                  </Button>
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
