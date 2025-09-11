import logging
import time
from supabase import create_client, Client
from supabase.lib.client_options import ClientOptions
import aiohttp
import asyncio
from typing import Optional, List
from ..config.settings import settings

logger = logging.getLogger(__name__)

class SupabaseClient:
    _instance = None
    
    def __init__(self):
        if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
            raise ValueError("Supabase URL and key must be set in environment variables")
        
        try:
            # Initialize with storage support
            client_options = ClientOptions(
                postgrest_client_timeout=30,
                storage_client_timeout=30,
            )
            
            self.client: Client = create_client(
                settings.SUPABASE_URL, 
                settings.SUPABASE_KEY,
                options=client_options
            )
            logger.info("Supabase client with storage support initialized successfully")
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
    
    async def upload_to_storage(self, bucket_name: str, file_path: str, file_data: bytes, content_type: str = "image/jpeg") -> Optional[str]:
        """Upload file to Supabase Storage"""
        try:
            # Check if bucket exists, create if it doesn't
            try:
                self.client.storage.get_bucket(bucket_name)
            except Exception:
                logger.info(f"Bucket {bucket_name} doesn't exist, creating it")
                self.client.storage.create_bucket(bucket_name, public=True)
            
            # Upload the file
            response = self.client.storage.from_(bucket_name).upload(
                file_path, 
                file_data, 
                {"content-type": content_type}
            )
            
            # Get public URL
            public_url = self.client.storage.from_(bucket_name).get_public_url(file_path)
            logger.info(f"Successfully uploaded file to {public_url}")
            return public_url
            
        except Exception as e:
            logger.error(f"Failed to upload file to storage: {e}")
            return None
    
    async def download_from_storage(self, bucket_name: str, file_path: str) -> Optional[bytes]:
        """Download file from Supabase Storage"""
        try:
            response = self.client.storage.from_(bucket_name).download(file_path)
            return response
        except Exception as e:
            logger.error(f"Failed to download file from storage: {e}")
            return None
    
    async def list_storage_files(self, bucket_name: str, folder_path: str = "") -> List[str]:
        """List files in Supabase Storage bucket"""
        try:
            response = self.client.storage.from_(bucket_name).list(folder_path)
            return [item['name'] for item in response]
        except Exception as e:
            logger.error(f"Failed to list storage files: {e}")
            return []
    
    async def delete_from_storage(self, bucket_name: str, file_path: str) -> bool:
        """Delete file from Supabase Storage"""
        try:
            response = self.client.storage.from_(bucket_name).remove([file_path])
            return True
        except Exception as e:
            logger.error(f"Failed to delete file from storage: {e}")
            return False
    
    def create_storage_policies(self, bucket_name: str):
        """Create necessary RLS policies for storage bucket"""
        try:
            # Enable RLS on storage.objects table
            policies_sql = f"""
            -- Allow public read access
            CREATE POLICY "Public Read Access" ON storage.objects
            FOR SELECT USING (bucket_id = '{bucket_name}');
            
            -- Allow authenticated users to upload files
            CREATE POLICY "Authenticated Upload Access" ON storage.objects
            FOR INSERT WITH CHECK (
                bucket_id = '{bucket_name}' 
                AND auth.role() = 'authenticated'
            );
            
            -- Allow authenticated users to update their own files
            CREATE POLICY "Authenticated Update Access" ON storage.objects
            FOR UPDATE USING (
                bucket_id = '{bucket_name}' 
                AND auth.role() = 'authenticated'
            );
            
            -- Allow authenticated users to delete their own files
            CREATE POLICY "Authenticated Delete Access" ON storage.objects
            FOR DELETE USING (
                bucket_id = '{bucket_name}' 
                AND auth.role() = 'authenticated'
            );
            """
            
            # Execute the SQL to create policies
            self.client.rpc('exec_sql', {'sql': policies_sql}).execute()
            logger.info(f"Created storage policies for bucket {bucket_name}")
            
        except Exception as e:
            logger.error(f"Failed to create storage policies: {e}")
            raise
