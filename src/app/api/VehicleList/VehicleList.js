import React, { useState, useEffect } from "react";
import { Card, CardContent, CardMedia, Typography, Box } from "@mui/material";
import { Button } from "@mui/material";
import { Input } from "@mui/material";
import { Select, MenuItem } from "@mui/material";

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("price");

  useEffect(() => {
    const fetchVehicles = async () => {
      const data = [
        { id: 1, make: "BYD", model: "Dolphin", year: 2022, price: 50, image: "https://www.byd.com/content/dam/byd-site/eu/electric-cars/dolphin/xl/Dolphin-exterior-04-SkiingwhiteUrbangrey-xl.jpg" },
        { id: 2, make: "Tesla", model: "Model S", year: 2021, price: 45, image: "https://static1.topspeedimages.com/wordpress/wp-content/uploads/2023/06/tesla-model-s-plaid-2.jpg" },
        { id: 3, make: "Tesla", model: "Model 3", year: 2020, price: 40, image: "https://www.tesla.com/ownersmanual/images/GUID-B5641257-9E85-404B-9667-4DA5FDF6D2E7-online-en-US.png" },
        { id: 4, make: "Tesla", model: "Model X", year: 2023, price: 70, image: "https://images.prismic.io/carwow/c340a77d-af56-4562-abfb-bd5518ccb292_2023+Tesla+Model+X+front+quarter+moving.jpg" },
        { id: 5, make: "Tesla", model: "Model Y", year: 2022, price: 80, image: "https://images.hgmsites.net/lrg/2022-tesla-model-y-performance-awd-angular-front-exterior-view_100833533_l.jpg" },
      ];
      setVehicles(data);
      setFilteredVehicles(data);
    };
    fetchVehicles();
  }, []);

  useEffect(() => {
    let filtered = vehicles.filter(vehicle =>
      `${vehicle.make} ${vehicle.model}`.toLowerCase().includes(search.toLowerCase())
    );
    
    if (sort === "price") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === "year") {
      filtered.sort((a, b) => b.year - a.year);
    } else if (sort === "name") {
      filtered.sort((a, b) => (a.make + a.model).localeCompare(b.make + b.model));
    }
    
    setFilteredVehicles(filtered);
  }, [search, sort, vehicles]);

  return (
    <Box sx={{ p: 4, textAlign: "center", backgroundColor: "#f5f5f5" }}>
      <Typography variant="h3" sx={{ fontWeight: "bold", mb: 4 }}>Choose Your Vehicle</Typography>
      <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mb: 4 }}>
        <Input 
          placeholder="Search by make or model" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: "300px", p: 1, borderRadius: "5px", backgroundColor: "white" }}
        />
        <Select value={sort} onChange={(e) => setSort(e.target.value)} sx={{ width: "200px", backgroundColor: "white" }}>
          <MenuItem value="price">Sort by Price</MenuItem>
          <MenuItem value="year">Sort by Year</MenuItem>
          <MenuItem value="name">Sort by Make</MenuItem>
        </Select>
      </Box>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 4 }}>
        {filteredVehicles.map((vehicle) => (
          <Card key={vehicle.id} sx={{ maxWidth: 345, mx: "auto", boxShadow: 3 }}>
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
              <Button variant="contained" sx={{ mt: 2, width: "100%" }}>Rent Now</Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default VehicleList;
