import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))
db = client["test"]

bikes_col = db.bikes
rentals_col = db.rentals
users_col = db.users
reviews_col = db.reviews

