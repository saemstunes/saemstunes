import re
import logging
from typing import List, Dict, Any
from ..config.settings import settings

logger = logging.getLogger(__name__)

class ContentExtractor:
    @staticmethod
    def extract_tags(text: str, existing_keywords: List[str] = None, max_tags: int = 5) -> List[str]:
        if not text:
            return []
        
        # Use existing keywords if available
        if existing_keywords:
            return [kw.strip() for kw in existing_keywords if kw.strip()][:max_tags]
        
        # Extract nouns and key phrases from text
        words = re.findall(r'\b[a-zA-Z]{3,}\b', text.lower())
        
        # Filter out stopwords and count frequency
        word_count = {}
        for word in words:
            if word not in settings.STOP_WORDS:
                word_count[word] = word_count.get(word, 0) + 1
        
        # Sort by frequency and return top tags
        sorted_tags = sorted(word_count.items(), key=lambda x: x[1], reverse=True)
        return [tag for tag, count in sorted_tags[:max_tags]]
    
    @staticmethod
    def infer_level(text: str) -> str:
        if not text:
            return "unspecified"
        
        text_lower = text.lower()
        level_scores = {level: 0 for level in settings.LEVEL_KEYWORDS.keys()}
        
        for level, keywords in settings.LEVEL_KEYWORDS.items():
            for keyword in keywords:
                if keyword in text_lower:
                    level_scores[level] += 1
        
        # Find the level with the highest score
        best_level = max(level_scores.items(), key=lambda x: x[1])
        
        # Only return a level if we found at least one match
        return best_level[0] if best_level[1] > 0 else "unspecified"
    
    @staticmethod
    def infer_access_level(text: str) -> str:
        if not text:
            return "unspecified"
        
        text_lower = text.lower()
        
        # Check for free access indicators
        for keyword in settings.ACCESS_LEVEL_KEYWORDS["free"]:
            if keyword in text_lower:
                return "free"
        
        # Check for restricted access indicators
        for keyword in settings.ACCESS_LEVEL_KEYWORDS["restricted"]:
            if keyword in text_lower:
                return "restricted"
        
        return "unspecified"
    
    @staticmethod
    def infer_instructor(text: str, author: str = None) -> str:
        # Use author if available
        if author:
            return author
        
        # Search for instructor patterns in text
        for pattern in settings.INSTRUCTOR_PATTERNS:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return match.group(1).strip()
        
        # Try to extract from domain or other metadata
        # For now, return unknown if no instructor found
        return "Unknown"
