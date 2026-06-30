from datetime import datetime
from typing import Optional, Annotated
from pydantic import BaseModel, EmailStr, Field, BeforeValidator

PyObjectId = Annotated[str, BeforeValidator(str)]


# ---------- User schemas ----------

class UserRegister(BaseModel):
    username: str = Field(..., min_length=3, max_length=30)
    email: EmailStr
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: PyObjectId
    username: str
    email: EmailStr
    created_at: datetime

    @classmethod
    def from_doc(cls, doc: dict) -> "UserOut":
        return cls(
            id=str(doc["_id"]),
            username=doc["username"],
            email=doc["email"],
            created_at=doc["created_at"],
        )


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


# ---------- Post schemas ----------

class PostCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    content: str = Field(..., min_length=1)


class PostUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    content: Optional[str] = Field(None, min_length=1)


class PostOut(BaseModel):
    id: PyObjectId
    title: str
    content: str
    author_id: PyObjectId
    author_username: str
    created_at: datetime
    updated_at: datetime

    @classmethod
    def from_doc(cls, doc: dict) -> "PostOut":
        return cls(
            id=str(doc["_id"]),
            title=doc["title"],
            content=doc["content"],
            author_id=str(doc["author_id"]),
            author_username=doc["author_username"],
            created_at=doc["created_at"],
            updated_at=doc["updated_at"],
        )
