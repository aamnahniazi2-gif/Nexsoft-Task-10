from datetime import datetime, timezone

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, HTTPException, status

from app.database import posts_collection
from app.deps import get_current_user
from app.models import PostCreate, PostOut, PostUpdate

router = APIRouter(prefix="/api/posts", tags=["posts"])


def _object_id_or_404(post_id: str) -> ObjectId:
    try:
        return ObjectId(post_id)
    except InvalidId:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")


# ---------- Public routes ----------

@router.get("", response_model=list[PostOut])
async def list_posts():
    """Anyone can read the list of posts, newest first."""
    posts = await posts_collection.find().sort("created_at", -1).to_list(length=500)
    return [PostOut.from_doc(p) for p in posts]


@router.get("/{post_id}", response_model=PostOut)
async def get_post(post_id: str):
    """Anyone can read a single post."""
    post = await posts_collection.find_one({"_id": _object_id_or_404(post_id)})
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    return PostOut.from_doc(post)


# ---------- Protected routes ----------

@router.post("", response_model=PostOut, status_code=status.HTTP_201_CREATED)
async def create_post(payload: PostCreate, current_user: dict = Depends(get_current_user)):
    """Create a post. Requires a valid JWT."""
    now = datetime.now(timezone.utc)
    doc = {
        "title": payload.title,
        "content": payload.content,
        "author_id": current_user["_id"],
        "author_username": current_user["username"],
        "created_at": now,
        "updated_at": now,
    }
    result = await posts_collection.insert_one(doc)
    doc["_id"] = result.inserted_id
    return PostOut.from_doc(doc)


@router.put("/{post_id}", response_model=PostOut)
async def update_post(
    post_id: str, payload: PostUpdate, current_user: dict = Depends(get_current_user)
):
    """Update a post. Requires a valid JWT AND ownership of the post."""
    oid = _object_id_or_404(post_id)
    post = await posts_collection.find_one({"_id": oid})
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")

    if str(post["author_id"]) != str(current_user["_id"]):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only edit your own posts",
        )

    update_data = {k: v for k, v in payload.model_dump(exclude_unset=True).items() if v is not None}
    if update_data:
        update_data["updated_at"] = datetime.now(timezone.utc)
        await posts_collection.update_one({"_id": oid}, {"$set": update_data})

    updated_post = await posts_collection.find_one({"_id": oid})
    return PostOut.from_doc(updated_post)


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(post_id: str, current_user: dict = Depends(get_current_user)):
    """Delete a post. Requires a valid JWT AND ownership of the post."""
    oid = _object_id_or_404(post_id)
    post = await posts_collection.find_one({"_id": oid})
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")

    if str(post["author_id"]) != str(current_user["_id"]):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own posts",
        )

    await posts_collection.delete_one({"_id": oid})
    return None
