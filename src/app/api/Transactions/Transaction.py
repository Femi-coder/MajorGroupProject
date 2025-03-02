from flask import jsonify, request
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
        self.connection_string = os.getenv("MONGODB_ATLAS_URI", "mongodb+srv://Femi:password_123@ecowheelsdublin.zpsyu.mongodb.net")
        if not self.connection_string:
            raise ValueError("MongoDB Atlas URI not found in environment variables")
        
        # Create connection with MongoDB Atlas
        self.client = MongoClient(self.connection_string)
        self.db = self.client["carrental"]
        
        # Set up indexes for performance
        self._setup_indexes()

    def _setup_indexes(self):
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
        self.transactions = self.db["transactions"]
        self.rentals = self.db["rentals"]
        self.vehicles = self.db["vehicles"]

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
                "updated_at": datetime.utcnow()
            }
            
            # Insert with retry logic for MongoDB Atlas
            for attempt in range(3):  # Retry up to 3 times
                try:
                    result = self.transactions.insert_one(transaction)
                    return str(result.inserted_id)
                except pymongo.errors.AutoReconnect:
                    if attempt == 2:
                        raise  # Raise error after last attempt
                    continue

        except pymongo.errors.DuplicateKeyError:
            raise ValueError("Transaction with this ID already exists")
        except Exception as e:
            raise Exception(f"Error creating transaction: {str(e)}")

    def get_transaction(self, transaction_id):
        """Retrieve a transaction from MongoDB Atlas"""
        transaction = self.transactions.find_one({"transaction_id": transaction_id}, {"_id": 0})
        if not transaction:
            raise ValueError("Transaction not found")
        return transaction
