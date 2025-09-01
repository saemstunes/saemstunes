import logging
import aiohttp
import asyncio
from typing import List, Optional, Tuple
from ..config.settings import settings

logger = logging.getLogger(__name__)

class ImageProcessor:
    def __init__(self):
        self.session = None
    
    async def initialize(self):
        self.session = aiohttp.ClientSession(
            headers={"User-Agent": "SaemsTunesBot/1.0 (+https://saemstunes.com)"},
            timeout=aiohttp.ClientTimeout(total=30)
        )
    
    async def close(self):
        if self.session:
            await self.session.close()
    
    async def validate_image(self, url: str) -> Tuple[bool, Optional[str]]:
        try:
            async with self.session.head(url) as response:
                if response.status == 200:
                    content_type = response.headers.get('Content-Type', '')
                    content_length = response.headers.get('Content-Length', '0')
                    
                    # Check if it's an image
                    if content_type.startswith('image/'):
                        # Check if it meets minimum size requirements
                        if int(content_length) > 10240:  # At least 10KB
                            return True, None
                        else:
                            return False, "Image too small"
                    else:
                        return False, "Not an image"
                else:
                    return False, f"HTTP error: {response.status}"
        
        except Exception as e:
            logger.error(f"Failed to validate image {url}: {e}")
            return False, str(e)
    
    async def select_best_image(self, image_urls: List[str]) -> Optional[str]:
        await self.initialize()
        
        try:
            valid_images = []
            
            for url in image_urls:
                is_valid, reason = await self.validate_image(url)
                if is_valid:
                    valid_images.append(url)
                else:
                    logger.debug(f"Invalid image {url}: {reason}")
            
            # For now, just return the first valid image
            # In a more advanced implementation, we could score images based on size, aspect ratio, etc.
            return valid_images[0] if valid_images else None
        
        except Exception as e:
            logger.error(f"Failed to select best image: {e}")
            return None
        
        finally:
            await self.close()
