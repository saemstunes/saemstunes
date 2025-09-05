import asyncio
import logging
import json
from datetime import datetime
from pathlib import Path
from typing import List

from crawler.html_crawler import HTMLCrawler
from processors.metadata_enricher import MetadataEnricher
from processors.quality_validator import QualityValidator
from config.supabase_client import SupabaseClient
from utils.logging import setup_logging
from config.settings import settings

setup_logging()

logger = logging.getLogger(__name__)

class ResourcePipeline:
    def __init__(self):
        self.crawler = HTMLCrawler()
        self.enricher = MetadataEnricher()
        self.validator = QualityValidator()
        self.supabase = SupabaseClient.get_instance()
        self.seen_hashes = set()
    
    async def run(self):
        logger.info("Starting resource pipeline")
        
        all_resources = []
        
        for seed_url in settings.SEED_URLS:
            try:
                logger.info(f"Crawling seed URL: {seed_url}")
                
                # Discover URLs
                discovered_urls = await self.crawler.crawl(seed_url)
                logger.info(f"Discovered {len(discovered_urls)} URLs from {seed_url}")
                
                # Process each URL
                for url in discovered_urls:
                    try:
                        resource = await self.crawler.process_url(url)
                        resource = self.enricher.enrich_resource(resource)
                        
                        if self.validator.validate_resource(resource):
                            all_resources.append(resource)
                            logger.info(f"Processed valid resource: {resource.title}")
                        else:
                            logger.warning(f"Resource failed validation: {resource.title}")
                    
                    except Exception as e:
                        logger.error(f"Failed to process URL {url}: {e}")
                        continue
                
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
