import { useState } from "react";

function TransactionPage({ userId, rentalId, amount }) {
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [transactionStatus, setTransactionStatus] = useState("");

  const handlePayment = async () => {
    const response = await fetch("http://127.0.0.1:5000/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        rental_id: rentalId,
        amount: amount,
        type: "rental_payment",
        payment_method: paymentMethod,
      }),
    });

    const data = await response.json();
    if (data.status === "success") {
      setTransactionStatus("Payment Successful! Your transaction ID: " + data.transaction_id);
    } else {
      setTransactionStatus("Payment Failed: " + data.message);
    }
  };

  return (
    <div>
      <h2>Complete Your Payment</h2>
      <p>Amount: ${amount}</p>
      <label>Choose Payment Method:</label>
      <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
        <option value="credit_card">Credit Card</option>
        <option value="paypal">PayPal</option>
      </select>
      <button onClick={handlePayment}>Pay Now</button>
      {transactionStatus && <p>{transactionStatus}</p>}
    </div>
  );
}

export default TransactionPage;