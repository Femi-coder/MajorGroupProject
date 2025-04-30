"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import FrontendMapComponent from "../api/map/FrontendMapComponent";

function TransactionContent() {
  const searchParams = useSearchParams();
  const [transactionStatus, setTransactionStatus] = useState("Loading...");
  const [returnMessage, setReturnMessage] = useState("");
  const [isReturning, setIsReturning] = useState(false);
  const [daysRented, setDaysRented] = useState(null);
  const [finalPrice, setFinalPrice] = useState(null);
  const [isStudentShare, setIsStudentShare] = useState(false);

  const transactionId = searchParams.get("transactionId");
  const userName = searchParams.get("userName") || "Guest";
  const vehicleName = searchParams.get("vehicleName") || "N/A";
  const price = parseFloat(searchParams.get("price")) || 0;
  const pickup = searchParams.get("pickup") || "N/A";
  const dropoff = searchParams.get("dropoff") || "N/A";
  const start = searchParams.get("start") || "N/A";
  const end = searchParams.get("end") || "N/A";

  useEffect(() => {
    // Calculate days rented and apply discount
    const isStudent = localStorage.getItem("student_share_registered") === "true";
    setIsStudentShare(isStudent);

    if (start !== "N/A" && end !== "N/A") {
      const startDate = new Date(start);
      const endDate = new Date(end);
      const days = Math.max(1, (endDate - startDate) / (1000 * 60 * 60 * 24));

      setDaysRented(days);

      const total = price * days;
      const discounted = isStudent ? (total * 0.85).toFixed(2) : total.toFixed(2);
      setFinalPrice(discounted);
    }
  }, [start, end, price]);

  const handleReturnCar = async () => {
    setIsReturning(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/return-car", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transaction_id: transactionId }),
      });

      const data = await response.json();
      if (response.ok) {
        setReturnMessage(`Success: ${data.message} ${data.late_fee ? `Late Fee: €${data.late_fee}` : ""}`);
      } else {
        setReturnMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setReturnMessage("Server error. Please try again.");
    }

    setIsReturning(false);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Eco Wheels Dublin - Transaction Summary", 14, 22);

    const tableData = [
      ["Name", userName],
      ["Vehicle", vehicleName],
      ["Price per Day", isStudentShare ? `$${(price * 0.85).toFixed(2)} (Discounted)` : `$${price.toFixed(2)}`],
      ["Days Rented", daysRented || "N/A"],
      ["Total Price", `$${finalPrice || "N/A"}`],
      ["Pickup", pickup],
      ["Dropoff", dropoff],
      ["Start Date", start],
      ["End Date", end],
      ["Transaction ID", transactionId],
    ];

    autoTable(doc, {
      startY: 30,
      head: [["Field", "Value"]],
      body: tableData,
    });

    doc.save(`EcoWheels_Transaction_${transactionId}.pdf`);
  };

  return (
    <Box sx={{ textAlign: "center", mt: 5 }}>
      <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2 }}>
        Transaction Summary
      </Typography>

      {transactionId ? (
        <>
          <Typography variant="h6"><strong>Hello, {userName}!</strong></Typography>
          <Typography variant="h6"><strong>Vehicle:</strong> {vehicleName}</Typography>

          <Typography variant="h6">
            <strong>Price per day:</strong>{" "}
            {isStudentShare ? (
              <>
                <span style={{ textDecoration: "line-through", color: "red", marginRight: "8px" }}>${price.toFixed(2)}</span>
                <span>${(price * 0.85).toFixed(2)}</span>
              </>
            ) : (
              `$${price.toFixed(2)}`
            )}
          </Typography>

          <Typography variant="h6">
            <strong>Days Rented:</strong> {daysRented ?? "N/A"}
          </Typography>

          <Typography variant="h6">
            <strong>Total Price:</strong>{" "}
            {isStudentShare && finalPrice ? (
              <>
                <span style={{ textDecoration: "line-through", color: "red", marginRight: "8px" }}>
                  ${(price * daysRented).toFixed(2)}
                </span>
                <span>${finalPrice}</span>
              </>
            ) : (
              `$${finalPrice ?? "N/A"}`
            )}
          </Typography>

          <Typography variant="h6"><strong>Pickup:</strong> {pickup}</Typography>
          <Typography variant="h6"><strong>Dropoff:</strong> {dropoff}</Typography>
          <Typography variant="h6"><strong>Rental Start:</strong> {start}</Typography>
          <Typography variant="h6"><strong>Rental End:</strong> {end}</Typography>

          <Button
            variant="contained"
            onClick={handleReturnCar}
            disabled={isReturning}
            sx={{ mt: 3, backgroundColor: "red", color: "white" }}
          >
            {isReturning ? "Processing..." : "Return Car"}
          </Button>

          <Button variant="outlined" sx={{ mt: 2, borderColor: "#2E3B4E", color: "#2E3B4E" }} onClick={handleDownloadPDF}>
            Download PDF
          </Button>

          {returnMessage && <Typography sx={{ mt: 2, color: "green" }}>{returnMessage}</Typography>}

          <Button
            variant="contained"
            sx={{ mt: 3, backgroundColor: "#2E3B4E", color: "white", ":hover": { backgroundColor: "#4C5E72" } }}
            onClick={() => window.location.href = "/"}
          >
            RETURN TO HOME
          </Button>

          <FrontendMapComponent />
        </>
      ) : (
        <Typography variant="h6" sx={{ color: "red" }}>{transactionStatus}</Typography>
      )}
    </Box>
  );
}

export default function TransactionPage() {
  return (
    <Suspense fallback={<Typography variant="h6">Loading...</Typography>}>
      <TransactionContent />
    </Suspense>
  );
}
