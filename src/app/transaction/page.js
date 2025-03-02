"use client";  // ✅ Mark the file as a client component

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";

export default function TransactionPage() {
    const searchParams = useSearchParams();
    const transactionId = searchParams.get("transactionId");

    const [transaction, setTransaction] = useState(null);
    const [transactionStatus, setTransactionStatus] = useState("");

    useEffect(() => {
        if (!transactionId) return;

        fetch(`http://127.0.0.1:5000/api/transactions/${transactionId}`)
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    setTransactionStatus(`Transaction not found: ${data.error}`);
                } else {
                    setTransaction(data.transaction);
                }
            })
            .catch(error => {
                setTransactionStatus(`Error fetching transaction: ${error.message}`);
            });
    }, [transactionId]);

    return (
        <Box sx={{ p: 4, textAlign: "center", backgroundColor: "white", borderRadius: "10px" }}>
            <Typography variant="h3">Transaction Summary</Typography>

            {transaction ? (
                <>
                    <Typography variant="h5">Transaction ID: {transaction.transaction_id}</Typography>
                    <Typography variant="h5">Vehicle: {transaction.vehicle_name || "N/A"}</Typography>
                    <Typography variant="h5">Price: ${transaction.amount}</Typography>
                    <Typography variant="h5">Pickup: {transaction.pickup}</Typography>
                    <Typography variant="h5">Dropoff: {transaction.dropoff}</Typography>
                    <Typography variant="h5">Rental Start: {transaction.start}</Typography>
                    <Typography variant="h5">Rental End: {transaction.end}</Typography>
                </>
            ) : (
                <Typography variant="h6" sx={{ color: "red" }}>
                    {transactionStatus}
                </Typography>
            )}

            <Button
                variant="contained"
                sx={{ mt: 3, backgroundColor: "#2E3B4E", color: "white" }}
                onClick={() => window.location.href = "/"}
            >
                Return to Home
            </Button>
        </Box>
    );
}
