import logging
from typing import Dict, Any
from ..models.resource import ResourceModel
from .content_extractor import ContentExtractor

logger = logging.getLogger(__name__)

class MetadataEnricher:
    def __init__(self):
        self.extractor = ContentExtractor()
    
    def enrich_resource(self, resource: ResourceModel) -> ResourceModel:
        # Extract text for analysis
        analysis_text = f"{resource.title} {resource.description or ''}"
        
        # Extract and set tags (use meta keywords if available)
        meta_keywords = resource.metadata.get('keywords', [])
        if not resource.tags:
            resource.tags = self.extractor.extract_tags(analysis_text, meta_keywords)
        
        # Infer level if not set
        if not resource.level or resource.level == "unspecified":
            resource.level = self.extractor.infer_level(analysis_text)
        
        # Infer access level if not set
        if not resource.access_level or resource.access_level == "unspecified":
            resource.access_level = self.extractor.infer_access_level(analysis_text)
        
        # Infer instructor if not set
        if not resource.instructor or resource.instructor == "Unknown":
            resource.instructor = self.extractor.infer_instructor(
                analysis_text, resource.metadata.get('author')
            )
        
        return resource
