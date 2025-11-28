from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

# Connect to MongoDB Atlas
MONGO_URI = os.getenv('MONGODB_URI')
DATABASE_NAME = os.getenv('DATABASE_NAME', 'aku_kesepian')
client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]

# Check admin status
admin_email = "maskiryz23@gmail.com"
user = db.users.find_one({"email": admin_email})

if user:
    print(f"\n✅ User found: {admin_email}")
    print(f"   Username: {user.get('username')}")
    print(f"   Is Admin: {user.get('is_admin', False)}")
    print(f"   Email: {user.get('email')}")
    
    if not user.get('is_admin'):
        print(f"\n⚠️ User is NOT admin. Updating...")
        result = db.users.update_one(
            {"email": admin_email},
            {"$set": {"is_admin": True}}
        )
        print(f"✅ Updated! Modified count: {result.modified_count}")
    else:
        print(f"\n✅ User is already admin!")
else:
    print(f"\n❌ User not found: {admin_email}")
    print("Please register first with this email!")

client.close()
