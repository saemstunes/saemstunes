import logging
from bs4 import BeautifulSoup
from typing import Dict, Any
from .base_crawler import BaseCrawler
from ..models.resource import ResourceModel
from ..utils.helpers import normalize_image_url

logger = logging.getLogger(__name__)

class HTMLCrawler(BaseCrawler):
    def extract_metadata(self, html: str, url: str) -> Dict[str, Any]:
        try:
            soup = BeautifulSoup(html, 'lxml')
            
            # Extract title
            title = soup.find('title')
            title_text = title.text.strip() if title else ""
            
            # Extract description
            meta_desc = soup.find('meta', attrs={'name': 'description'})
            description = meta_desc.get('content', "").strip() if meta_desc else ""
            
            # Extract meta keywords
            meta_keywords = soup.find('meta', attrs={'name': 'keywords'})
            keywords = meta_keywords.get('content', "").split(',') if meta_keywords else []
            
            # Extract author information
            author = None
            author_meta = soup.find('meta', attrs={'name': 'author'})
            if author_meta:
                author = author_meta.get('content')
            
            # Extract images
            images = []
            for img in soup.find_all('img', src=True):
                normalized_url = normalize_image_url(img['src'], url)
                if normalized_url:
                    images.append(normalized_url)
            
            # Extract content text for analysis
            content_text = soup.get_text()
            
            return {
                'title': title_text,
                'description': description,
                'keywords': keywords,
                'author': author,
                'images': images,
                'content_text': content_text,
                'url': url
            }
        
        except Exception as e:
            logger.error(f"Failed to extract metadata from {url}: {e}")
            return {}
    
    async def process_url(self, url: str) -> ResourceModel:
        content, final_url = await self.fetch_url(url)
        metadata = self.extract_metadata(content, final_url)
        
        # Create resource model
        resource_data = {
            'title': metadata.get('title', ''),
            'description': metadata.get('description', ''),
            'resource_url': final_url,
            'instructor': metadata.get('author'),
            'metadata': {
                'source': final_url,
                'keywords': metadata.get('keywords', []),
                'images': metadata.get('images', [])
            }
        }
        
        return ResourceModel(**resource_data)
