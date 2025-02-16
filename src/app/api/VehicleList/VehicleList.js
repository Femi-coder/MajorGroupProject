import React, { useState, useEffect } from "react";
import { Card, CardContent, CardMedia } from "@mui/material";
import { Button } from "@mui/material";
import { Input } from "@mui/material";
import { Select, MenuItem } from "@mui/material";

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("price");

  useEffect(() => {
    // Fetch vehicle data (Updated with correct vehicle details)
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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Choose Your Vehicle</h1>
      <div className="flex gap-4 mb-4">
        <Input 
          placeholder="Search by make or model" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select value={sort} onChange={(e) => setSort(e.target.value)}>
          <MenuItem value="price">Sort by Price</MenuItem>
          <MenuItem value="year">Sort by Year</MenuItem>
          <MenuItem value="name">Sort by Name</MenuItem>
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVehicles.map((vehicle) => (
          <Card key={vehicle.id} className="p-4">
            <CardMedia
              component="img"
              height="200"
              image={vehicle.image}
              alt={`${vehicle.make} ${vehicle.model}`}
            />
            <CardContent>
              <h2 className="text-xl font-bold">{vehicle.make} {vehicle.model}</h2>
              <p>Year: {vehicle.year}</p>
              <p>Price: ${vehicle.price}/day</p>
              <Button variant="contained" className="mt-2">Rent Now</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VehicleList;
