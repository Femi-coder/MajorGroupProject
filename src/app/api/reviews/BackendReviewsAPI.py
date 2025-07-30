# Importing necessary libraries
from flask import Flask, jsonify, request  # Flask for web framework, jsonify for sending JSON responses, request to handle incoming requests
from pymongo import MongoClient  # MongoClient to connect with MongoDB
from flask_cors import CORS  # CORS to handle cross-origin requests

# MongoDB Configuration: Define MongoDB URI and database name
MONGO_URI = "mongodb+srv://Femi:password_123@ecowheelsdublin.zpsyu.mongodb.net"
DB_NAME = "carrental"

# Initialize MongoDB Connection
client = MongoClient(MONGO_URI)  # Connect to MongoDB using the URI
db = client[DB_NAME]  # Access the specific database in MongoDB
reviews_collection = db["reviews"]  # Access the "reviews" collection in the database

# Initialize Flask App: Set up the Flask application instance
app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing (CORS) to allow API requests from other origins

# Route to fetch all reviews (GET request)
@app.route("/api/reviews", methods=["GET"])
def get_reviews():
    try:
        # Fetch all reviews from the "reviews" collection, excluding the MongoDB "_id" field
        reviews = list(reviews_collection.find({}, {"_id": 0}))
        return jsonify(reviews), 200  # Return the reviews as a JSON response with status 200 (OK)
    except Exception as e:
        # If an error occurs, return an error message with status 500 (Internal Server Error)
        return jsonify({"error": str(e)}), 500

# Route to submit a new review (POST request)
@app.route("/api/reviews", methods=["POST"])
def add_review():
    try:
        # Get the JSON data sent in the request body
        data = request.get_json()
        
        # Extract the individual fields (name, vehicle, rating, comment)
        name = data.get("name")
        vehicle = data.get("vehicle")
        rating = data.get("rating")
        comment = data.get("comment")

        # Check if all required fields are provided, if not return an error response
        if not name or not vehicle or not rating or not comment:
            return jsonify({"error": "All fields are required"}), 400

        # Create a new review document
        new_review = {
            "name": name,
            "vehicle": vehicle,
            "rating": int(rating),  # Convert rating to integer
            "comment": comment
        }

        # Insert the new review into the MongoDB collection
        reviews_collection.insert_one(new_review)
        return jsonify({"message": "Review added successfully"}), 201  # Return success response with status 201 (Created)
    except Exception as e:
        # If an error occurs, return an error message with status 500 (Internal Server Error)
        return jsonify({"error": str(e)}), 500

# Run the Flask server: This will start the Flask application when the script is executed
if __name__ == "__main__":
    app.run(debug=True, port=5000)  # Run the app in debug mode on port 5000


