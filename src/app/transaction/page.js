"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function TransactionPage() {
    const searchParams = useSearchParams();
    const [transaction, setTransaction] = useState(null);
    const [transactionStatus, setTransactionStatus] = useState("Loading...");

    const transactionId = searchParams.get("transactionId");
    const userName = searchParams.get("userName") || "Guest";  // ✅ Get username from URL
    const vehicleName = searchParams.get("vehicleName") || "N/A";  // ✅ Get vehicle name from URL

    useEffect(() => {
        if (!transactionId) return;

        fetch(`http://127.0.0.1:5000/api/transactions/${transactionId}`)
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

    return (
        <Box sx={{ textAlign: "center", mt: 5 }}>
            <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2 }}>
                Transaction Summary
            </Typography>

            {transaction ? (
                <>
                    <Typography variant="h6">
                        Transaction ID: {transaction.transaction_id}
                    </Typography>
                    <Typography variant="h6">
                        Hello, {userName}!
                    </Typography>
                    <Typography variant="h6">
                        Vehicle: {vehicleName}
                    </Typography>
                    <Typography variant="h6">Price: ${transaction.amount}</Typography>
                    <Typography variant="h6">Pickup: {transaction.pickup}</Typography>
                    <Typography variant="h6">Dropoff: {transaction.dropoff}</Typography>
                    <Typography variant="h6">Rental Start: {transaction.start}</Typography>
                    <Typography variant="h6">Rental End: {transaction.end}</Typography>

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
                </>
            ) : (
                <Typography variant="h6" sx={{ color: "red" }}>
                    {transactionStatus}
                </Typography>
            )}
        </Box>
    );
}
