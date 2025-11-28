import pymongo
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Test MongoDB connection
mongodb_uri = os.getenv('MONGODB_URI')
print(f"Testing connection to: {mongodb_uri[:50]}...")

try:
    client = pymongo.MongoClient(mongodb_uri)
    
    # Test the connection
    client.admin.command('ping')
    print("✅ MongoDB connection successful!")
    
    # List databases
    dbs = client.list_database_names()
    print(f"Available databases: {dbs}")
    
    # Test our specific database
    db = client['aku_kesepian']
    collections = db.list_collection_names()
    print(f"Collections in 'aku_kesepian': {collections}")
    
    client.close()
    
except Exception as e:
    print(f"❌ MongoDB connection failed: {e}")