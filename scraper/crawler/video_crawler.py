import logging
import aiohttp
import asyncio
import re
from typing import Dict, Any
from urllib.parse import urlparse, parse_qs
from ..models.resource import ResourceModel
from ..utils.helpers import normalize_url

logger = logging.getLogger(__name__)

class VideoCrawler:
    def __init__(self):
        self.session = None
        self.user_agent = "SaemsTunesBot/1.0 (+https://saemstunes.com)"
    
    async def initialize(self):
        self.session = aiohttp.ClientSession(
            headers={"User-Agent": self.user_agent},
            timeout=aiohttp.ClientTimeout(total=30)
        )
    
    async def close(self):
        if self.session:
            await self.session.close()
    
    def extract_video_id(self, url: str) -> str:
        # YouTube URL patterns
        patterns = [
            r'(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)',
            r'(?:youtube\.com\/embed\/)([^&]+)',
            r'(?:youtube\.com\/v\/)([^&]+)'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, url)
            if match:
                return match.group(1)
        
        return None
    
    async def fetch_video_metadata(self, url: str) -> Dict[str, Any]:
        try:
            video_id = self.extract_video_id(url)
            if not video_id:
                return {'is_video': False}
            
            # For YouTube, we can use oEmbed API to get metadata
            oembed_url = f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={video_id}&format=json"
            
            async with self.session.get(oembed_url) as response:
                if response.status == 200:
                    data = await response.json()
                    return {
                        'is_video': True,
                        'title': data.get('title', ''),
                        'author_name': data.get('author_name', ''),
                        'thumbnail_url': data.get('thumbnail_url', ''),
                        'provider_name': data.get('provider_name', ''),
                        'video_id': video_id
                    }
            
            return {'is_video': False}
        except Exception as e:
            logger.error(f"Failed to fetch video metadata for {url}: {e}")
            return {'is_video': False}
    
    async def process_url(self, url: str) -> ResourceModel:
        await self.initialize()
        
        try:
            metadata = await self.fetch_video_metadata(url)
            
            if not metadata.get('is_video', False):
                logger.warning(f"URL is not a recognized video: {url}")
                return None
            
            # Create resource model for video
            resource_data = {
                'title': metadata.get('title', 'Video Resource'),
                'description': f"Video by {metadata.get('author_name', 'Unknown')}",
                'resource_url': url,
                'instructor': metadata.get('author_name'),
                'thumbnail_url': metadata.get('thumbnail_url'),
                'access_level': 'free',  # Assume videos are free unless otherwise specified
                'metadata': {
                    'source': url,
                    'video_id': metadata.get('video_id'),
                    'provider': metadata.get('provider_name'),
                    'resource_type': 'video'
                }
            }
            
            return ResourceModel(**resource_data)
        
        except Exception as e:
            logger.error(f"Failed to process video URL {url}: {e}")
            return None
        
        finally:
            await self.close()
