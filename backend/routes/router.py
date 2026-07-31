from fastapi import APIRouter
from config.database import reuters_technology_collections

router = APIRouter(
    prefix="/news",
    tags=["Reuters Technology"]
)


@router.get("/technology")
def get_reuters_technology_news():
    data = list(reuters_technology_collections.find({}))
    for item in data:
        # The _id is an ObjectId type so I changed this type to string
        if "_id" in item:
            item["_id"] = str(item["_id"])
    return data