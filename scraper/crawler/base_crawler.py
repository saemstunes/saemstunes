import aiohttp
import asyncio
import logging
from collections import deque
from urllib.parse import urljoin, urlparse
from bs4 import BeautifulSoup
from typing import Set, List, Tuple, Dict
from ..utils.helpers import normalize_url, should_follow_link, normalize_image_url
from ..config.settings import settings

logger = logging.getLogger(__name__)

class BaseCrawler:
    def __init__(self):
        self.visited_urls: Dict[str, Set[str]] = {}
        self.session = None
        self.user_agent = "SaemsTunesBot/1.0 (+https://saemstunes.com)"
        self.semaphore = asyncio.Semaphore(settings.CONCURRENT_REQUESTS)
    
    async def initialize(self):
        self.session = aiohttp.ClientSession(
            headers={"User-Agent": self.user_agent},
            timeout=aiohttp.ClientTimeout(total=settings.REQUEST_TIMEOUT)
        )
    
    async def close(self):
        if self.session:
            await self.session.close()
    
    async def fetch_url(self, url: str) -> Tuple[str, str]:
        async with self.semaphore:
            try:
                async with self.session.get(url) as response:
                    content = await response.text()
                    final_url = str(response.url)
                    return content, final_url
            except Exception as e:
                logger.error(f"Failed to fetch URL {url}: {e}")
                raise
    
    def get_domain_key(self, url: str) -> str:
        parsed = urlparse(url)
        return f"{parsed.scheme}://{parsed.netloc}"
    
    def is_visited(self, url: str) -> bool:
        domain = self.get_domain_key(url)
        return url in self.visited_urls.get(domain, set())
    
    def mark_visited(self, url: str):
        domain = self.get_domain_key(url)
        if domain not in self.visited_urls:
            self.visited_urls[domain] = set()
        
        if len(self.visited_urls[domain]) >= settings.MAX_VISITED_URLS_PER_DOMAIN:
            old_url = next(iter(self.visited_urls[domain]))
            self.visited_urls[domain].remove(old_url)
        
        self.visited_urls[domain].add(url)
    
    def extract_links(self, html: str, base_url: str) -> Set[str]:
        soup = BeautifulSoup(html, 'lxml')
        links = set()
        
        for a_tag in soup.find_all('a', href=True):
            href = a_tag['href']
            full_url = urljoin(base_url, href)
            normalized_url = normalize_url(full_url)
            
            if should_follow_link(normalized_url, base_url):
                links.add(normalized_url)
        
        return links
    
    def is_music_content(self, html: str, url: str) -> bool:
        soup = BeautifulSoup(html, 'lxml')
        
        title = soup.find('title')
        if title and any(keyword in title.text.lower() for keyword in settings.MUSIC_KEYWORDS):
            return True
        
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        if meta_desc and any(keyword in meta_desc.get('content', '').lower() for keyword in settings.MUSIC_KEYWORDS):
            return True
        
        text_content = soup.get_text().lower()
        return any(keyword in text_content for keyword in settings.MUSIC_KEYWORDS)
    
    async def crawl(self, start_url: str, max_depth: int = settings.CRAWL_DEPTH) -> List[str]:
        await self.initialize()
        
        try:
            queue = deque([(start_url, 0)])
            discovered_urls = set()
            
            while queue:
                url, depth = queue.popleft()
                
                if depth > max_depth:
                    continue
                
                if self.is_visited(url):
                    continue
                
                self.mark_visited(url)
                
                try:
                    content, final_url = await self.fetch_url(url)
                    
                    if self.is_music_content(content, final_url):
                        discovered_urls.add(final_url)
                        
                        if depth < max_depth:
                            links = self.extract_links(content, final_url)
                            for link in links:
                                if not self.is_visited(link):
                                    queue.append((link, depth + 1))
                    
                    await asyncio.sleep(settings.RATE_LIMIT_DELAY)
                    
                except Exception as e:
                    logger.warning(f"Failed to process URL {url}: {e}")
                    continue
            
            return list(discovered_urls)
        
        finally:
            await self.close()
