import logging
import aiohttp
import asyncio
from typing import Dict, Any
from ..models.resource import ResourceModel
from ..utils.helpers import normalize_url

logger = logging.getLogger(__name__)

class PDFCrawler:
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
    
    async def fetch_pdf_metadata(self, url: str) -> Dict[str, Any]:
        try:
            async with self.session.head(url) as response:
                if response.status == 200:
                    content_type = response.headers.get('Content-Type', '')
                    content_length = response.headers.get('Content-Length', '0')
                    
                    if 'pdf' in content_type.lower():
                        return {
                            'content_type': content_type,
                            'content_length': content_length,
                            'is_pdf': True
                        }
            return {'is_pdf': False}
        except Exception as e:
            logger.error(f"Failed to fetch PDF metadata for {url}: {e}")
            return {'is_pdf': False}
    
    async def process_url(self, url: str) -> ResourceModel:
        await self.initialize()
        
        try:
            metadata = await self.fetch_pdf_metadata(url)
            
            if not metadata.get('is_pdf', False):
                logger.warning(f"URL is not a PDF: {url}")
                return None
            
            # Create resource model for PDF
            resource_data = {
                'title': url.split('/')[-1].replace('.pdf', '').replace('_', ' ').title(),
                'description': f"PDF document ({metadata.get('content_length', 'unknown')} bytes)",
                'resource_url': url,
                'access_level': 'free',  # Assume PDFs are free unless otherwise specified
                'metadata': {
                    'source': url,
                    'content_type': metadata.get('content_type'),
                    'content_length': metadata.get('content_length'),
                    'resource_type': 'pdf'
                }
            }
            
            return ResourceModel(**resource_data)
        
        except Exception as e:
            logger.error(f"Failed to process PDF URL {url}: {e}")
            return None
        
        finally:
            await self.close()
