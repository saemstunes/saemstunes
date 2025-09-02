import asyncio
import logging
import json
from datetime import datetime
from pathlib import Path
from typing import List

from scraper.crawler.html_crawler import HTMLCrawler
from scraper.crawler.pdf_crawler import PDFCrawler
from scraper.crawler.video_crawler import VideoCrawler
from scraper.processors.metadata_enricher import MetadataEnricher
from scraper.processors.quality_validator import QualityValidator
from scraper.processors.image_processor import ImageProcessor
from scraper.config.supabase_client import SupabaseClient
from scraper.utils.logging import setup_logging
from scraper.config.settings import settings

setup_logging()

logger = logging.getLogger(__name__)

class ResourcePipeline:
    def __init__(self):
        self.html_crawler = HTMLCrawler()
        self.pdf_crawler = PDFCrawler()
        self.video_crawler = VideoCrawler()
        self.enricher = MetadataEnricher()
        self.validator = QualityValidator()
        self.image_processor = ImageProcessor()
        self.supabase = SupabaseClient.get_instance()
        self.seen_hashes = set()
    
    def determine_crawler_type(self, url: str) -> str:
        url_lower = url.lower()
        
        if url_lower.endswith('.pdf'):
            return 'pdf'
        elif 'youtube.com' in url_lower or 'youtu.be' in url_lower:
            return 'video'
        else:
            return 'html'
    
    async def process_url(self, url: str):
        try:
            crawler_type = self.determine_crawler_type(url)
            
            if crawler_type == 'pdf':
                resource = await self.pdf_crawler.process_url(url)
            elif crawler_type == 'video':
                resource = await self.video_crawler.process_url(url)
            else:
                resource = await self.html_crawler.process_url(url)
            
            if not resource:
                return None
            
            # Process images for HTML resources
            if crawler_type == 'html' and resource.metadata.get('images'):
                best_image = await self.image_processor.select_best_image(resource.metadata['images'])
                if best_image:
                    resource.thumbnail_url = best_image
            
            resource = self.enricher.enrich_resource(resource)
            
            is_valid, score = self.validator.validate_resource(resource)
            if is_valid:
                logger.info(f"Processed valid resource: {resource.title} (score: {score:.2f})")
                return resource
            else:
                logger.warning(f"Resource failed validation: {resource.title} (score: {score:.2f})")
                return None
        
        except Exception as e:
            logger.error(f"Failed to process URL {url}: {e}")
            return None
    
    async def run(self):
        logger.info("Starting resource pipeline")
        
        all_resources = []
        
        for seed_url in settings.SEED_URLS:
            try:
                logger.info(f"Crawling seed URL: {seed_url}")
                
                # Discover URLs
                discovered_urls = await self.html_crawler.crawl(seed_url)
                logger.info(f"Discovered {len(discovered_urls)} URLs from {seed_url}")
                
                # Process each URL
                for url in discovered_urls:
                    resource = await self.process_url(url)
                    if resource:
                        all_resources.append(resource)
                
            except Exception as e:
                logger.error(f"Failed to process seed URL {seed_url}: {e}")
                continue
        
        # Deduplicate resources
        unique_resources = self.deduplicate_resources(all_resources)
        
        # Save to JSON file
        if unique_resources:
            output_file = Path("output") / f"resources_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
            output_file.parent.mkdir(exist_ok=True)
            
            with open(output_file, 'w') as f:
                json_data = [resource.to_dict() for resource in unique_resources]
                json.dump(json_data, f, indent=2)
            
            logger.info(f"Saved {len(unique_resources)} resources to {output_file}")
            
            # Upload to Supabase
            successful_uploads = 0
            for resource in unique_resources:
                try:
                    self.supabase.upsert_resource(resource.to_dict())
                    successful_uploads += 1
                except Exception as e:
                    logger.error(f"Failed to upload resource {resource.title}: {e}")
            
            logger.info(f"Successfully uploaded {successful_uploads} resources to Supabase")
        else:
            logger.info("No valid resources found to process")
    
    def deduplicate_resources(self, resources: List) -> List:
        unique_resources = []
        for resource in resources:
            if resource and resource.content_hash not in self.seen_hashes:
                unique_resources.append(resource)
                self.seen_hashes.add(resource.content_hash)
        return unique_resources

async def main():
    pipeline = ResourcePipeline()
    await pipeline.run()

if __name__ == "__main__":
    asyncio.run(main())
