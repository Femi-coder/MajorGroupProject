import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("price");

  useEffect(() => {
    // Fetch vehicle data (Replace with actual API call)
    const fetchVehicles = async () => {
      const data = [
        { id: 1, make: "Toyota", model: "Camry", year: 2022, price: 50 },
        { id: 2, make: "Honda", model: "Civic", year: 2021, price: 45 },
        { id: 3, make: "Ford", model: "Focus", year: 2020, price: 40 },
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
      <h1 className="text-2xl font-bold mb-4">Vehicle List</h1>
      <div className="flex gap-4 mb-4">
        <Input 
          placeholder="Search by make or model" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select onValueChange={setSort} defaultValue={sort}>
          <SelectItem value="price">Sort by Price</SelectItem>
          <SelectItem value="year">Sort by Year</SelectItem>
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVehicles.map((vehicle) => (
          <Card key={vehicle.id} className="p-4">
            <CardContent>
              <h2 className="text-xl font-bold">{vehicle.make} {vehicle.model}</h2>
              <p>Year: {vehicle.year}</p>
              <p>Price: ${vehicle.price}/day</p>
              <Button className="mt-2">Rent Now</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <div>
      <VehicleList />
    </div>
  );
}
