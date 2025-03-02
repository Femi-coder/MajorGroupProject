from flask import Flask, jsonify, request
from flask_restful import Api, Resource
from datetime import datetime
import uuid
from enum import Enum
import pymongo
from bson import ObjectId
from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class TransactionStatus(Enum):
    PENDING = "pending"
    AUTHORIZED = "authorized"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"
    CANCELLED = "cancelled"

class TransactionType(Enum):
    RENTAL_PAYMENT = "rental_payment"
    DEPOSIT = "deposit"
    REFUND = "refund"
    LATE_FEE = "late_fee"

class MongoDBAtlasConnection:
    _instance = None

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def __init__(self):
        # MongoDB Atlas connection string should be in environment variables
        self.connection_string = os.getenv('MONGODB_ATLAS_URI')
        if not self.connection_string:
            raise ValueError("MongoDB Atlas URI not found in environment variables")
        
        # Create connection with MongoDB Atlas
        self.client = MongoClient(self.connection_string)
        
        # Access the database
        self.db = self.client.eco_wheels_db
        
        # Set up indexes
        self._setup_indexes()

    def _setup_indexes(self):
        # Create indexes for better query performance
        self.db.transactions.create_index([("transaction_id", pymongo.ASCENDING)], unique=True)
        self.db.transactions.create_index([("user_id", pymongo.ASCENDING)])
        self.db.transactions.create_index([("rental_id", pymongo.ASCENDING)])
        self.db.transactions.create_index([("status", pymongo.ASCENDING)])
        self.db.transactions.create_index([("created_at", pymongo.DESCENDING)])

class TransactionSystem:
    def __init__(self):
        # Get MongoDB Atlas connection
        mongo_connection = MongoDBAtlasConnection.get_instance()
        self.db = mongo_connection.db
        
        # Initialize collections
        self.transactions = self.db.transactions
        self.rentals = self.db.rentals
        self.users = self.db.users
        self.vehicles = self.db.vehicles

    def create_transaction(self, user_id, rental_id, amount, transaction_type):
        """Create a new transaction record in MongoDB Atlas"""
        try:
            transaction = {
                "transaction_id": str(uuid.uuid4()),
                "user_id": user_id,
                "rental_id": rental_id,
                "amount": amount,
                "type": transaction_type.value,
                "status": TransactionStatus.PENDING.value,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
                "metadata": {}
            }
            
            # Insert with retry logic for MongoDB Atlas
            max_retries = 3
            for attempt in range(max_retries):
                try:
                    result = self.transactions.insert_one(transaction)
                    return str(result.inserted_id)
                except pymongo.errors.AutoReconnect:
                    if attempt == max_retries - 1:
                        raise
                    continue

        except pymongo.errors.DuplicateKeyError:
            raise ValueError("Transaction with this ID already exists")
        except Exception as e:
            raise Exception(f"Error creating transaction: {str(e)}")

    def get_transaction(self, transaction_id):
        """Retrieve a transaction from MongoDB Atlas"""
        try:
            transaction = self.transactions.find_one({"transaction_id": transaction_id})
            if not transaction:
                raise ValueError("Transaction not found")
            return transaction
        except Exception as e:
            raise Exception(f"Error retrieving transaction: {str(e)}")

    def process_payment(self, transaction_id, payment_details):
        """Process payment with MongoDB Atlas transaction support"""
        try:
            # Start a session for transaction
            with self.db.client.start_session() as session:
                with session.start_transaction():
                    # Verify payment details
                    if not self._verify_payment_details(payment_details):
                        raise ValueError("Invalid payment details")

                    # Update transaction status
                    result = self.transactions.update_one(
                        {"transaction_id": transaction_id},
                        {
                            "$set": {
                                "status": TransactionStatus.AUTHORIZED.value,
                                "updated_at": datetime.utcnow(),
                                "payment_method": payment_details.get("payment_method"),
                                "metadata.payment_reference": payment_details.get("reference")
                            }
                        },
                        session=session
                    )

                    if result.modified_count == 0:
                        raise ValueError("Transaction not found or already processed")

                    # Complete the transaction
                    self._complete_transaction(transaction_id, session)
                    return True

        except Exception as e:
            self._handle_payment_failure(transaction_id, str(e))
            return False

    def _complete_transaction(self, transaction_id, session):
        """Complete transaction with session support"""
        transaction = self.transactions.find_one(
            {"transaction_id": transaction_id},
            session=session
        )
        
        if transaction["type"] == TransactionType.RENTAL_PAYMENT.value:
            self.rentals.update_one(
                {"_id": ObjectId(transaction["rental_id"])},
                {
                    "$set": {
                        "payment_status": "paid",
                        "updated_at": datetime.utcnow()
                    }
                },
                session=session
            )

        self.transactions.update_one(
            {"transaction_id": transaction_id},
            {
                "$set": {
                    "status": TransactionStatus.COMPLETED.value,
                    "updated_at": datetime.utcnow()
                }
            },
            session=session
        )

# API Routes
class TransactionAPI(Resource):
    def __init__(self):
        self.transaction_system = TransactionSystem()

    def post(self):
        """Create a new transaction"""
        data = request.get_json()
        try:
            transaction_id = self.transaction_system.create_transaction(
                data["user_id"],
                data["rental_id"],
                data["amount"],
                TransactionType(data["type"])
            )
            return jsonify({
                "status": "success",
                "transaction_id": transaction_id,
                "message": "Transaction created successfully"
            })
        except Exception as e:
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 400

    def get(self, transaction_id):
        """Get transaction details"""
        try:
            transaction = self.transaction_system.get_transaction(transaction_id)
            return jsonify({
                "status": "success",
                "data": transaction
            })
        except Exception as e:
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 404

# Example setup code
def setup_transaction_api():
    app = Flask(__name__)
    api = Api(app)
    
    # Add routes
    api.add_resource(TransactionAPI, 
                    '/api/transactions',
                    '/api/transactions/<string:transaction_id>')
    
    return app