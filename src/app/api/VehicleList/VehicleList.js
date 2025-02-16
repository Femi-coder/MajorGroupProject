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
        { id: 2, make: "Tesla", model: "Model S", year: 2023, price: 45, image: "https://static1.topspeedimages.com/wordpress/wp-content/uploads/2023/06/tesla-model-s-plaid-2.jpg" },
        { id: 3, make: "Tesla", model: "Model 3", year: 2022, price: 40, image: "https://www.tesla.com/ownersmanual/images/GUID-B5641257-9E85-404B-9667-4DA5FDF6D2E7-online-en-US.png" },
        { id: 4, make: "Tesla", model: "Model X", year: 2021, price: 70, image: "https://images.prismic.io/carwow/c340a77d-af56-4562-abfb-bd5518ccb292_2023+Tesla+Model+X+front+quarter+moving.jpg" },
        { id: 5, make: "Tesla", model: "Model Y", year: 2020, price: 80, image: "https://images.hgmsites.net/lrg/2022-tesla-model-y-performance-awd-angular-front-exterior-view_100833533_l.jpg" },
        { id: 6, make: "Audi", model: "Q6 E-Tron", year: 2025, price: 175, image: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQJQ94kMS27fDB0AHLvy60P-CPRpIeb524xYwCbwqRz6yhCZgE-" },
        { id: 7, make: "BMW", model: "iX", year: 2024, price: 205, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTugWhgSDy76DrH3wNjyvyweDBRXCYk3VnvtEWpIFHcgIMG-URA" },
        { id: 8, make: "BMW", model: "i4", year: 2022, price: 195, image: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTWHD-Mk5QG1j6_Cx8EKYhBH6o468cy_FgB5y_EdpbvYBAghh4n" },
        { id: 9, make: "Mini", model: "Electric", year: 2022, price: 75, image: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRBfyjKFeW0Nuf9AinLX9kfkheVU7Prq-a5S7fOPe-Imk2VWOg-" },
        { id: 10, make: "Ford", model: "Mustang Mach-E", year: 2021, price: 210, image: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSpGLYQMYbxoRQIZDjIbv7dl75Mxoenz4B_v1RA72huW8ysZGIS" },
        { id: 11, make: "Volkswagen", model: "ID.4", year: 2022, price: 145, image: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcR94dMA2TiqdgB099fUlZLZLVlSUv_d3rS4D4X3GgoQ75Qnpdxm" },
        { id: 12, make: "BMW", model: "i5", year: 2025, price: 200, image: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRqDRhoGT7E2UTug0F6wC9bXqrEjKmR31vn0RwvA3s2xk1R5fFq" },
        { id: 13, make: "Hyundai", model: "IONIQ 6", year: 2023, price: 99, image: "https://s7g10.scene7.com/is/image/hyundaiautoever/hyundai-ioniq-6-first-edition-presales-start-01:Content%20Banner%20Mobile?wid=767&hei=668" },
        { id: 14, make: "BMW", model: "i4", year: 2022, price: 195, image: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTWHD-Mk5QG1j6_Cx8EKYhBH6o468cy_FgB5y_EdpbvYBAghh4n" },
        { id: 15, make: "BMW", model: "i4", year: 2022, price: 195, image: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTWHD-Mk5QG1j6_Cx8EKYhBH6o468cy_FgB5y_EdpbvYBAghh4n" },
        { id: 16, make: "BMW", model: "i4", year: 2022, price: 195, image: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTWHD-Mk5QG1j6_Cx8EKYhBH6o468cy_FgB5y_EdpbvYBAghh4n" },
        { id: 17, make: "BMW", model: "i4", year: 2022, price: 195, image: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTWHD-Mk5QG1j6_Cx8EKYhBH6o468cy_FgB5y_EdpbvYBAghh4n" },
        { id: 18, make: "BMW", model: "i4", year: 2022, price: 195, image: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTWHD-Mk5QG1j6_Cx8EKYhBH6o468cy_FgB5y_EdpbvYBAghh4n" },
        { id: 19, make: "BMW", model: "i4", year: 2022, price: 195, image: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTWHD-Mk5QG1j6_Cx8EKYhBH6o468cy_FgB5y_EdpbvYBAghh4n" },
        { id: 20, make: "BMW", model: "i4", year: 2022, price: 195, image: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTWHD-Mk5QG1j6_Cx8EKYhBH6o468cy_FgB5y_EdpbvYBAghh4n" },
        { id: 21, make: "BMW", model: "i4", year: 2022, price: 195, image: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTWHD-Mk5QG1j6_Cx8EKYhBH6o468cy_FgB5y_EdpbvYBAghh4n" },
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
