import logging
import time
from supabase import create_client, Client
from ..config.settings import settings

logger = logging.getLogger(__name__)

class SupabaseClient:
    _instance = None
    
    def __init__(self):
        if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
            raise ValueError("Supabase URL and key must be set in environment variables")
        
        try:
            self.client: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
            logger.info("Supabase client initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Supabase client: {e}")
            raise
    
    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance
    
    def upsert_resource(self, resource_data, max_retries=3):
        for attempt in range(max_retries):
            try:
                response = self.client.table("resources").upsert(resource_data).execute()
                logger.info(f"Successfully upserted resource: {resource_data.get('title')}")
                return response
            except Exception as e:
                if attempt == max_retries - 1:
                    logger.error(f"Failed to upsert resource after {max_retries} attempts: {e}")
                    raise
                wait_time = 2 ** attempt
                logger.warning(f"Retry {attempt + 1}/{max_retries} after error: {e}. Waiting {wait_time}s")
                time.sleep(wait_time)
