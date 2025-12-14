from fastapi import APIRouter, Body, HTTPException
from fastapi.encoders import jsonable_encoder

from database import (
    subscription_helper,
    subscription_collection,
)
from models import (
    ErrorResponseModel,
    ResponseModel,
    SubscriptionSchema,
    UpdateSubscriptionModel,
)
# from bson.objectid import ObjectId # Removed for compatibility

router = APIRouter()

@router.post("/", response_description="Subscription data added into the database")
async def add_subscription_data(subscription: SubscriptionSchema = Body(...)):
    subscription = jsonable_encoder(subscription)
    new_subscription = await subscription_collection.insert_one(subscription)
    created_subscription = await subscription_collection.find_one({"_id": new_subscription.inserted_id})
    return ResponseModel(subscription_helper(created_subscription), "Subscription added successfully.")

@router.get("/", response_description="Subscriptions retrieved")
async def get_subscriptions():
    subscriptions = []
    async for subscription in subscription_collection.find():
        subscriptions.append(subscription_helper(subscription))
    return ResponseModel(subscriptions, "Subscriptions retrieved successfully")

@router.get("/{id}", response_description="Subscription data retrieved")
async def get_subscription_data(id: str):
    # if not ObjectId.is_valid(id): raise HTTPException...
    
    subscription = await subscription_collection.find_one({"_id": id})
    if subscription:
        return ResponseModel(subscription_helper(subscription), "Subscription data retrieved successfully")
    return ErrorResponseModel("An error occurred.", 404, "Subscription doesn't exist.")

@router.put("/{id}")
async def update_subscription_data(id: str, req: UpdateSubscriptionModel = Body(...)):
    # if not ObjectId.is_valid(id): ...
    
    req = {k: v for k, v in req.dict().items() if v is not None}
    
    if len(req) >= 1:
        update_result = await subscription_collection.update_one(
            {"_id": id}, {"$set": req}
        )
        if update_result.modified_count == 1:
            updated_subscription = await subscription_collection.find_one({"_id": id})
            return ResponseModel(subscription_helper(updated_subscription), "Subscription updated successfully")
    
    existing_subscription = await subscription_collection.find_one({"_id": id})
    if existing_subscription:
        return ResponseModel(subscription_helper(existing_subscription), "Subscription updated successfully")
        
    return ErrorResponseModel("An error occurred.", 404, "Subscription doesn't exist.")

@router.delete("/{id}", response_description="Subscription data deleted from the database")
async def delete_subscription_data(id: str):
    # if not ObjectId.is_valid(id): ...
        
    delete_result = await subscription_collection.delete_one({"_id": id})
    if delete_result.deleted_count == 1:
        return ResponseModel("Subscription with ID: {} removed".format(id), "Subscription deleted successfully")
    return ErrorResponseModel("An error occurred.", 404, "Subscription with ID {0} doesn't exist".format(id))
