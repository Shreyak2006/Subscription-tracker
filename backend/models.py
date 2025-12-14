from pydantic import BaseModel, Field
from typing import Optional

class SubscriptionSchema(BaseModel):
    name: str = Field(..., example="Netflix")
    category: str = Field(..., example="Entertainment")
    cost: float = Field(..., gt=0, example=15.99)
    billing_cycle: str = Field(..., example="Monthly")
    renewal_date: str = Field(..., example="2023-12-25")

    class Config:
        schema_extra = {
            "example": {
                "name": "Netflix",
                "category": "Entertainment",
                "cost": 15.99,
                "billing_cycle": "Monthly",
                "renewal_date": "2023-12-25"
            }
        }

class UpdateSubscriptionModel(BaseModel):
    name: Optional[str]
    category: Optional[str]
    cost: Optional[float]
    billing_cycle: Optional[str]
    renewal_date: Optional[str]

    class Config:
        schema_extra = {
            "example": {
                "name": "Netflix Premium",
                "cost": 19.99
            }
        }

def ResponseModel(data, message):
    return {
        "data": [data],
        "code": 200,
        "message": message,
    }

def ErrorResponseModel(error, code, message):
    return {"error": error, "code": code, "message": message}
