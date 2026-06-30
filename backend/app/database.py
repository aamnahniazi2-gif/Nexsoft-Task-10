from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

client = AsyncIOMotorClient(settings.mongo_uri)
database = client[settings.mongo_db_name]

users_collection = database["users"]
posts_collection = database["posts"]


async def init_indexes():
    """Create indexes needed for uniqueness and query performance."""
    await users_collection.create_index("email", unique=True)
    await users_collection.create_index("username", unique=True)
    await posts_collection.create_index("author_id")
    await posts_collection.create_index("created_at")
