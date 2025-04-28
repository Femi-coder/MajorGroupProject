"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import FrontendMapComponent from "../api/mapapi/FrontendMapComponent";



function TransactionContent() {
    const searchParams = useSearchParams();
    const [transaction, setTransaction] = useState(null);
    const [transactionStatus, setTransactionStatus] = useState("Loading...");
    const [returnMessage, setReturnMessage] = useState("");
    const [isReturning, setIsReturning] = useState(false);
    const [finalPrice, setFinalPrice] = useState(null);

    // Get data from URL parameters
    const transactionId = searchParams.get("transactionId");
    const userName = searchParams.get("userName") || "Guest";  
    const vehicleName = searchParams.get("vehicleName") || "N/A";  
    const price = searchParams.get("price") || "N/A";
    const pickup = searchParams.get("pickup") || "N/A";
    const dropoff = searchParams.get("dropoff") || "N/A";
    const start = searchParams.get("start") || "N/A";
    const end = searchParams.get("end") || "N/A";

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
    
        doc.setFontSize(18);
        doc.text("Eco Wheels Dublin - Transaction Summary", 14, 22);
    
        const tableData = [
            ["Name", userName],
            ["Vehicle", vehicleName],
            ["Price", `$${finalPrice || price}`],
            ["Pickup", pickup],
            ["Dropoff", dropoff],
            ["Start Date", start],
            ["End Date", end],
            ["Transaction ID", transactionId],
        ];
    
        autoTable(doc,{
            startY: 30,
            head: [["Field", "Value"]],
            body: tableData
        });
    
        doc.save(`EcoWheels_Transaction_${transactionId}.pdf`);
    };
    

    useEffect(() => {
        if (!transactionId) {
            setTransactionStatus("Invalid transaction ID.");
            return;
        }

        fetch(`https://flask-api1-1-j42x.onrender.com/api/transactions/${transactionId}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    setTransactionStatus(`Transaction not found: ${data.error}`);
                } else {
                    setTransaction(data.transaction);
                }
            })
            .catch((error) => {
                setTransactionStatus(`Error fetching transaction: ${error.message}`);
            });
    }, [transactionId]);

    // Apply Student Share discount if applicable
    useEffect(() => {
        if (!price || price === "N/A") return; // Prevents running if price isn't set

        const isStudentShare = localStorage.getItem("student_share_registered") === "true";

        if (isStudentShare) {
            const discountedPrice = (parseFloat(price) * 0.85).toFixed(2);
            setFinalPrice(discountedPrice);
        } else {
            setFinalPrice(price);
        }
    }, [price]);

    const handleReturnCar = async () => {
        setIsReturning(true);

        try {
            const response = await fetch("http://127.0.0.1:5000/api/return-car", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ transaction_id: transactionId }),
            });

            const data = await response.json();

            if (response.ok) {
                setReturnMessage(` Success: ${data.message} ${data.late_fee ? `Late Fee: €${data.late_fee}` : ""}`);
                setTransaction({ ...transaction, status: "returned" }); // Update UI
            } else {
                setReturnMessage(` Error: ${data.error}`);
            }
        } catch (error) {
            setReturnMessage(" Server error. Please try again.");
        }

        setIsReturning(false);
    };

    return (
        <Box sx={{ textAlign: "center", mt: 5 }}>
            <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2 }}>
                Transaction Summary
            </Typography>

            {transaction ? (
                <>
                    <Typography variant="h6">
                        <strong>Hello, {userName}!</strong>
                    </Typography>
                    <Typography variant="h6">
                        <strong>Vehicle:</strong> {vehicleName}
                    </Typography>
                    <Typography variant="h6">
                        <strong>Price:</strong> 
                        {localStorage.getItem("student_share_registered") === "true" ? (
                            <>
                                <span style={{ textDecoration: "line-through", color: "red", marginRight: "8px" }}>
                                    ${price}
                                </span>
                                <span> ${finalPrice || price}</span>
                            </>
                        ) : (
                            `$${finalPrice || price}`
                        )}
                    </Typography>
                    <Typography variant="h6">
                        <strong>Pickup:</strong> {pickup}
                    </Typography>
                    <Typography variant="h6">
                        <strong>Dropoff:</strong> {dropoff}
                    </Typography>
                    <Typography variant="h6">
                        <strong>Rental Start:</strong> {start}
                    </Typography>
                    <Typography variant="h6">
                        <strong>Rental End:</strong> {end}
                    </Typography>
                    {transaction.status === "active" && (
                        <Button
                            variant="contained"
                            onClick={handleReturnCar}
                            disabled={isReturning}
                            sx={{ mt: 3, backgroundColor: "red", color: "white" }}
                        >
                            {isReturning ? "Processing..." : "Return Car"}
                        </Button>
                    )}
                    <Button variant="outlined"
                sx={{ mt: 2, borderColor: "#2E3B4E", color: "#2E3B4E" }}
                    onClick={handleDownloadPDF}
                    >
                    Download PDF
                    </Button>

                    {returnMessage && <Typography sx={{ mt: 2, color: "green" }}>{returnMessage}</Typography>}

                    <Button
                        variant="contained"
                        sx={{
                            mt: 3,
                            backgroundColor: "#2E3B4E",
                            color: "white",
                            ":hover": {
                                backgroundColor: "#4C5E72",
                            },
                        }}
                        onClick={() => window.location.href = "/"}
                    >
                        RETURN TO HOME
                    </Button>
                    <FrontendMapComponent />
                </>
            ) : (
                <Typography variant="h6" sx={{ color: "red" }}>
                    {transactionStatus}
                </Typography>
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
