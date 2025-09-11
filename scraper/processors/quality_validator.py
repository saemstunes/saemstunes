import logging
from typing import Tuple
from ..models.resource import ResourceModel
from ..config.settings import settings

logger = logging.getLogger(__name__)

class QualityValidator:
    def validate_resource(self, resource: ResourceModel) -> Tuple[bool, float]:
        score = 1.0
        reasons = []
        
        # Title validation
        title = resource.title.strip()
        if len(title) < settings.MIN_TITLE_LENGTH:
            reasons.append(f"Title too short: {len(title)}")
            score *= 0.5
        
        # Description validation
        description = resource.description.strip() if resource.description else ""
        if description and len(description) < settings.MIN_DESCRIPTION_LENGTH:
            reasons.append(f"Description too short: {len(description)}")
            score *= 0.8
        
        # URL validation
        if not resource.resource_url.startswith(('http://', 'https://')):
            reasons.append("Invalid URL")
            score *= 0.1
        
        # Content hash validation (basic duplication check)
        if not resource.content_hash:
            reasons.append("Missing content hash")
            score *= 0.9
        
        # Level validation
        if not resource.level or resource.level == "unspecified":
            reasons.append("Level not specified")
            score *= 0.9
        
        # Access level validation
        if not resource.access_level or resource.access_level == "unspecified":
            reasons.append("Access level not specified")
            score *= 0.9
        
        if reasons:
            logger.debug(f"Validation issues for {resource.title}: {', '.join(reasons)}")
        
        return score >= 0.5, score
