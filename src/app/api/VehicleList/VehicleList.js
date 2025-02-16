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
    // Fetch vehicle data (Replace with actual API call)
    const fetchVehicles = async () => {
        const data = [
          { id: 1, make: "Toyota", model: "Camry", year: 2022, price: 50, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/2018_Toyota_Camry_%28AXVH71R%29_Ascent_sedan_%282018-10-31%29_01.jpg/800px-2018_Toyota_Camry_%28AXVH71R%29_Ascent_sedan_%282018-10-31%29_01.jpg" },
          { id: 2, make: "Honda", model: "Civic", year: 2021, price: 45, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/2022_Honda_Civic_SR_VTEC_CVT_1.5_Front.jpg/800px-2022_Honda_Civic_SR_VTEC_CVT_1.5_Front.jpg" },
          { id: 3, make: "Ford", model: "Focus", year: 2020, price: 40, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/2019_Ford_Focus_ST-Line_X_EcoBoost_1.0_Front.jpg/800px-2019_Ford_Focus_ST-Line_X_EcoBoost_1.0_Front.jpg" },
          { id: 4, make: "Tesla", model: "Model 3", year: 2023, price: 70, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Tesla_Model_3_parked%2C_front_driver_side.jpg/800px-Tesla_Model_3_parked%2C_front_driver_side.jpg" },
          { id: 5, make: "BMW", model: "X5", year: 2022, price: 80, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/BMW_X5_xDrive30d_M_Sport_%28G05%29_%E2%80%93_f_03062021.jpg/800px-BMW_X5_xDrive30d_M_Sport_%28G05%29_%E2%80%93_f_03062021.jpg" },
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
