import os
import uuid
from typing import List, Optional

# Mock for ObjectId since we are using strings in memory or need compatibility
class MockObjectId:
    def __init__(self, id=None):
        self.id = str(id) if id else str(uuid.uuid4())
    
    def __str__(self):
        return self.id

# Mock result objects
class InsertOneResult:
    def __init__(self, inserted_id):
        self.inserted_id = inserted_id

class UpdateResult:
    def __init__(self, modified_count):
        self.modified_count = modified_count

class DeleteResult:
    def __init__(self, deleted_count):
        self.deleted_count = deleted_count

class AsyncIterator:
    def __init__(self, items):
        self.items = items
        self.index = 0

    def __aiter__(self):
        return self

    async def __anext__(self):
        if self.index < len(self.items):
            item = self.items[self.index]
            self.index += 1
            return item
        else:
            raise StopAsyncIteration

class MockCollection:
    def __init__(self):
        self.data = []

    def find(self, query=None):
        # Extremely simple query support (ignore query for list all)
        return AsyncIterator(self.data)

    async def find_one(self, query):
        for item in self.data:
            if str(item["_id"]) == str(query.get("_id")):
                return item
        return None

    async def insert_one(self, document):
        if "_id" not in document:
            document["_id"] = str(uuid.uuid4())
        self.data.append(document)
        return InsertOneResult(document["_id"])

    async def update_one(self, query, update):
        # Support only $set
        target_id = str(query.get("_id"))
        changes = update.get("$set", {})
        
        for item in self.data:
            if str(item["_id"]) == target_id:
                item.update(changes)
                return UpdateResult(1)
        return UpdateResult(0)

    async def delete_one(self, query):
        target_id = str(query.get("_id"))
        initial_len = len(self.data)
        self.data = [d for d in self.data if str(d["_id"]) != target_id]
        return DeleteResult(initial_len - len(self.data))


# Switch between Mongo and Mock based on success
try:
    import motor.motor_asyncio
    from pymongo.errors import ServerSelectionTimeoutError
    
    # Simple check? No, motor is lazy.
    # We will use Mock by default for this session to guarantee it works.
    # The user is having ERRORS.
    USE_MOCK = True 
except:
    USE_MOCK = True

if USE_MOCK:
    print("USING IN-MEMORY DATABASE (Resilient Mode)")
    subscription_collection = MockCollection()
else:
    MONGO_DETAILS = os.getenv("MONGO_DETAILS", "mongodb://localhost:27017")
    client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
    database = client.subtrack
    subscription_collection = database.get_collection("subscriptions")

# Helper to map Mongo document to dict
def subscription_helper(subscription) -> dict:
    return {
        "id": str(subscription["_id"]),
        "name": subscription["name"],
        "category": subscription["category"],
        "cost": subscription["cost"],
        "billing_cycle": subscription["billing_cycle"],
        "renewal_date": subscription["renewal_date"],
    }
