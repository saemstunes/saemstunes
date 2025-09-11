from datetime import datetime
from typing import List, Optional, Dict, Any
from uuid import uuid4, UUID
from pydantic import BaseModel, Field, validator
import hashlib

class ResourceModel(BaseModel):
    id: Optional[UUID] = Field(default_factory=uuid4)
    title: str
    description: Optional[str] = None
    category_id: Optional[UUID] = None
    subject_category: Optional[str] = None
    level: Optional[str] = None
    is_locked: bool = False
    access_level: str = "unspecified"
    metadata: Optional[Dict[str, Any]] = None
    thumbnail_url: Optional[str] = None
    resource_url: str
    duration: Optional[str] = None
    instructor: Optional[str] = None
    tags: Optional[List[str]] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    content_hash: Optional[str] = None
    
    @validator('level')
    def validate_level(cls, v):
        if v and v not in ['beginner', 'intermediate', 'advanced', 'unspecified']:
            raise ValueError('Level must be beginner, intermediate, advanced, or unspecified')
        return v
    
    @validator('access_level')
    def validate_access_level(cls, v):
        if v not in ['free', 'restricted', 'unspecified']:
            raise ValueError('Invalid access level')
        return v
    
    @validator('tags', pre=True, always=True)
    def set_default_tags(cls, v):
        return v or []
    
    @validator('metadata', pre=True, always=True)
    def set_default_metadata(cls, v):
        return v or {}
    
    @validator('content_hash', pre=True, always=True)
    def generate_content_hash(cls, v, values):
        if v is None:
            content = f"{values.get('title', '')}{values.get('description', '')}{values.get('resource_url', '')}"
            return hashlib.sha256(content.encode()).hexdigest()
        return v
    
    def to_dict(self):
        data = self.dict()
        if self.id:
            data['id'] = str(self.id)
        if self.category_id:
            data['category_id'] = str(self.category_id)
        data['created_at'] = self.created_at.isoformat()
        data['updated_at'] = self.updated_at.isoformat()
        return data
