import { useState } from "react";

function ReturnCar() {
  const [rentalId, setRentalId] = useState("");
  const [message, setMessage] = useState("");

  const handleReturn = async () => {
    const response = await fetch("http://127.0.0.1:5000/return-car", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rental_id: rentalId }),
    });

    const data = await response.json();
    setMessage(data.message);
  };

  return (
    <div>
      <h2>Return Your Car</h2>
      <input
        type="text"
        placeholder="Enter Rental ID"
        value={rentalId}
        onChange={(e) => setRentalId(e.target.value)}
      />
      <button onClick={handleReturn}>Return Car</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ReturnCar;