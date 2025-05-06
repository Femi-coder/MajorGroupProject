from flask import Flask, request, jsonify  # Import Flask for web framework, request for handling incoming data, jsonify for returning JSON responses
from flask_cors import CORS  # Import CORS for enabling cross-origin resource sharing
from datetime import datetime  # Import datetime for date/time handling
import pymongo  # Import pymongo to interact with MongoDB
import os  # Import os for accessing environment variables

# Initialize Flask App
app = Flask(__name__)  # Create an instance of the Flask web application
CORS(app)  # Enable CORS for the Flask app, allowing it to accept requests from different origins

# MongoDB Connection: Fetch MongoDB URI from environment variables (or use a default value)
MONGO_URI = os.getenv("MONGODB_ATLAS_URI", "mongodb+srv://Femi:password_123@ecowheelsdublin.zpsyu.mongodb.net")
client = pymongo.MongoClient(MONGO_URI)  # Create a MongoClient instance to connect to MongoDB
db = client["carrental"]  # Access the "carrental" database
transactions_collection = db["transactions"]  # Access the "transactions" collection for transaction data
vehicles_collection = db["vehicles"]  # Access the "vehicles" collection for vehicle data

# Define Route for Returning Cars (POST request)
@app.route("/api/return-car", methods=["POST"])
def return_car():
    try:
        # Parse JSON data from the incoming request
        data = request.get_json()
        transaction_id = data.get("transaction_id")  # Get the transaction ID from the request body

        # Check if the transaction ID is provided
        if not transaction_id:
            return jsonify({"error": "Missing transaction_id"}), 400  # Return an error if the transaction ID is missing

        # Find the transaction in the database using the transaction ID
        transaction = transactions_collection.find_one({"transaction_id": transaction_id})
        if not transaction:
            return jsonify({"error": "Transaction not found"}), 404  # Return error if the transaction does not exist

        # Check if the car has already been returned
        if transaction.get("status") == "returned":
            return jsonify({"error": "Car already returned"}), 400  # Return error if the car has already been marked as returned

        # Convert the string 'end' date to a datetime object for comparison
        due_date = datetime.strptime(transaction.get("end"), "%Y-%m-%d")
        return_time = datetime.utcnow()  # Get the current UTC time (when the car is being returned)
        late_fee = 0  # Initialize the late fee

        # If the car is returned late, calculate the late fee
        if return_time > due_date:
            late_days = (return_time - due_date).days  # Calculate the number of late days
            late_fee = late_days * 20  # Charge €20 per late day

        # Update the transaction status in the database to reflect the car is returned
        transactions_collection.update_one(
            {"transaction_id": transaction_id},
            {
                "$set": {
                    "status": "returned",  # Set the status to "returned"
                    "return_time": return_time,  # Store the return time
                    "late_fee": late_fee  # Store the late fee if applicable
                }
            }
        )

        # Make the vehicle available again by updating its availability status
        vehicle_id = int(transaction["vehicle_id"])  # Convert vehicle ID to an integer
        vehicles_collection.update_one(
            {"carId": vehicle_id},
            {"$set": {"available": True}}  # Set the vehicle status to available
        )

        # Return a success response with the late fee (if applicable)
        return jsonify({
            "status": "success",
            "message": "Car returned successfully",  # Success message
            "late_fee": late_fee  # Include the late fee in the response if applicable
        }), 200  # HTTP status code for OK (success)

    except Exception as e:
        # Return an error response if an exception occurs during the process
        return jsonify({"error": str(e)}), 500  # HTTP status code for internal server error

# Run the Flask App
if __name__ == "__main__":
    app.run(debug=True, port=5000)  # Start the Flask app on port 5000 with debug mode enabled

