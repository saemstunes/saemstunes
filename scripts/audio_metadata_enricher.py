#!/usr/bin/env python3
"""
Supabase Audio Metadata Enricher
Specialized processor for Supabase audio files with online metadata lookup
"""
import os
import re
import time
import requests
import psycopg2
from supabase import create_client
from urllib.parse import unquote, quote
from datetime import datetime
from typing import Dict, List, Optional, Tuple
from collections import defaultdict
import logging

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class SupabaseAudioEnricher:
    def __init__(self, supabase_config: Dict, db_config: Dict, api_keys: Dict):
        self.supabase = create_client(
            supabase_config["url"],
            supabase_config["key"]
        )
        self.bucket = supabase_config["bucket"]
        self.db_config = db_config
        self.api_keys = api_keys
        self.db_conn = None
        self._init_db()
        
    def _init_db(self):
        """Initialize PostgreSQL connection"""
        try:
            self.db_conn = psycopg2.connect(
                host=self.db_config["host"],
                database=self.db_config["database"],
                user=self.db_config["user"],
                password=self.db_config["password"],
                port=self.db_config["port"]
            )
            logger.info("Database connection established successfully")
        except Exception as e:
            logger.error(f"Database connection failed: {e}")
            raise
    
    def get_audio_files(self, folder: str = "Tracks") -> List[Dict]:
        """Retrieve audio files from Supabase storage"""
        try:
            files = self.supabase.storage.from_(self.bucket).list(folder)
            return [
                {
                    "name": unquote(f["name"]),
                    "path": f"{folder}/{f['name']}",
                    "url": f"https://{self.supabase.supabase_url}/storage/v1/object/public/{self.bucket}/{folder}/{f['name']}"
                }
                for f in files if self._is_audio_file(f["name"])
            ]
        except Exception as e:
            logger.error(f"Error retrieving audio files: {e}")
            return []
    
    def _is_audio_file(self, filename: str) -> bool:
        """Check if file is an audio format"""
        audio_ext = (".mp3", ".m4a", ".wav", ".aac", ".flac", ".ogg")
        return filename.lower().endswith(audio_ext)
    
    def extract_metadata_from_filename(self, filename: str) -> Tuple[str, str]:
        """Extract potential artist and track name from filename"""
        # Remove extension
        name = os.path.splitext(filename)[0]
        
        # Common patterns in filenames
        patterns = [
            r'^(.*?)\s*[-–—]\s*(.*?)$',  # Artist - Title
            r'^(.*?)\s*ft\.?\s*(.*?)$',   # Artist ft. Other Artist
            r'^(.*?)\s*feat\.?\s*(.*?)$', # Artist feat. Other Artist
        ]
        
        artist, title = "Unknown Artist", name
        
        for pattern in patterns:
            match = re.search(pattern, name, re.IGNORECASE)
            if match:
                artist = match.group(1).strip()
                title = match.group(2).strip()
                break
                
        # Clean up the results
        artist = re.sub(r'[\(\)\[\]\-\_]', ' ', artist)
        artist = re.sub(r'\s+', ' ', artist).strip()
        
        title = re.sub(r'[\(\)\[\]\-\_]', ' ', title)
        title = re.sub(r'\s+', ' ', title).strip()
        
        return artist, title
    
    def search_online_metadata(self, track_name: str, artist: str = None, sources: List[str] = None) -> Dict:
        """Search for track metadata across multiple platforms"""
        if sources is None:
            sources = ["youtube", "spotify", "soundcloud"]
            
        metadata = defaultdict(lambda: None)
        
        # Create search queries with different combinations
        queries = []
        if artist:
            queries.append(f"{artist} {track_name}")
            queries.append(f"{track_name} {artist}")
        queries.append(track_name)
        
        # Try each query until we get results
        for query in queries:
            if not metadata and "youtube" in sources:
                metadata.update(self._search_youtube(query))
            
            if not metadata and "spotify" in sources:
                metadata.update(self._search_spotify(query))
                
            if not metadata and "soundcloud" in sources:
                metadata.update(self._search_soundcloud(query))
                
            if metadata:  # Stop if we found metadata
                break
                
        return dict(metadata)
    
    def _search_youtube(self, query: str) -> Dict:
        """Search YouTube for track metadata"""
        try:
            search_url = "https://www.googleapis.com/youtube/v3/search"
            params = {
                "part": "snippet",
                "q": f"{query} official music",
                "type": "video",
                "key": self.api_keys.get("youtube"),
                "maxResults": 3,
                "videoCategoryId": "10"  # Music category
            }
            
            response = requests.get(search_url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            if "items" in data and data["items"]:
                # Find the most relevant result (often the first one)
                for item in data["items"]:
                    # Skip results that are clearly not music videos
                    title = item["snippet"]["title"].lower()
                    if any(x in title for x in ["lyrics", "karaoke", "cover"]):
                        continue
                        
                    return {
                        "youtube_url": f"https://youtu.be/{item['id']['videoId']}",
                        "description": item["snippet"]["description"],
                        "artist": item["snippet"]["channelTitle"],
                        "cover_url": item["snippet"]["thumbnails"]["high"]["url"]
                    }
                    
        except Exception as e:
            logger.warning(f"YouTube search failed for '{query}': {e}")
            
        return {}
    
    def _search_spotify(self, query: str) -> Dict:
        """Search Spotify for track metadata"""
        try:
            search_url = "https://api.spotify.com/v1/search"
            headers = {"Authorization": f"Bearer {self.api_keys.get('spotify')}"}
            params = {
                "q": query,
                "type": "track",
                "limit": 3
            }
            
            response = requests.get(search_url, headers=headers, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            if "tracks" in data and data["tracks"]["items"]:
                track = data["tracks"]["items"][0]
                return {
                    "preview_url": track["preview_url"],
                    "duration": int(track["duration_ms"] / 1000),
                    "artist": ", ".join([a["name"] for a in track["artists"]]),
                    "title": track["name"],
                    "cover_url": track["album"]["images"][0]["url"] if track["album"]["images"] else None
                }
                
        except Exception as e:
            logger.warning(f"Spotify search failed for '{query}': {e}")
            
        return {}
    
    def _search_soundcloud(self, query: str) -> Dict:
        """Search SoundCloud for track metadata"""
        try:
            search_url = "https://api-v2.soundcloud.com/search/tracks"
            params = {
                "q": query,
                "client_id": self.api_keys.get("soundcloud"),
                "limit": 3,
                "linked_partitioning": 1
            }
            
            response = requests.get(search_url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            if "collection" in data and data["collection"]:
                track = data["collection"][0]
                return {
                    "preview_url": track["permalink_url"],
                    "duration": int(track["duration"] / 1000),
                    "title": track["title"],
                    "artist": track["user"]["username"],
                    "cover_url": track["artwork_url"]
                }
                
        except Exception as e:
            logger.warning(f"SoundCloud search failed for '{query}': {e}")
            
        return {}
    
    def insert_track(self, track_data: Dict) -> bool:
        """Insert or update enriched track in database"""
        # First check if the track already exists
        check_query = "SELECT id FROM tracks WHERE audio_path = %(audio_path)s"
        
        try:
            with self.db_conn.cursor() as cursor:
                cursor.execute(check_query, {"audio_path": track_data["audio_path"]})
                existing_track = cursor.fetchone()
                
                if existing_track:
                    # Update existing track
                    update_query = """
                    UPDATE tracks SET
                        title = %(title)s,
                        description = %(description)s,
                        cover_path = %(cover_path)s,
                        artist = %(artist)s,
                        duration = %(duration)s,
                        youtube_url = %(youtube_url)s,
                        preview_url = %(preview_url)s,
                        updated_at = NOW()
                    WHERE audio_path = %(audio_path)s
                    """
                    cursor.execute(update_query, track_data)
                    logger.info(f"Updated track: {track_data['title']}")
                else:
                    # Insert new track
                    insert_query = """
                    INSERT INTO public.tracks (
                        title, description, audio_path, cover_path, access_level,
                        slug, artist, duration, youtube_url, preview_url
                    ) VALUES (
                        %(title)s, %(description)s, %(audio_path)s, %(cover_path)s, 
                        %(access_level)s, %(slug)s, %(artist)s, %(duration)s, 
                        %(youtube_url)s, %(preview_url)s
                    )
                    """
                    cursor.execute(insert_query, track_data)
                    logger.info(f"Inserted new track: {track_data['title']}")
                
                self.db_conn.commit()
                return True
        except Exception as e:
            logger.error(f"Database error: {e}")
            self.db_conn.rollback()
            return False
    
    def generate_slug(self, title: str) -> str:
        """Generate URL-friendly slug"""
        slug = re.sub(r'[^a-zA-Z0-9\s-]', '', title.lower())
        slug = re.sub(r'\s+', '-', slug)
        slug = slug.strip('-')
        return f"{slug}-{int(time.time())}"
    
    def download_cover_image(self, cover_url: str, track_name: str) -> Optional[str]:
        """Download cover image and upload to Supabase storage"""
        if not cover_url:
            return None
            
        try:
            # Download the image
            response = requests.get(cover_url, timeout=10)
            response.raise_for_status()
            
            # Generate a filename
            ext = os.path.splitext(cover_url)[1] or ".jpg"
            filename = f"cover-{self.generate_slug(track_name)}{ext}"
            filepath = f"covers/{filename}"
            
            # Upload to Supabase storage
            self.supabase.storage.from_(self.bucket).upload(
                filepath,
                response.content,
                {"content-type": response.headers.get("content-type", "image/jpeg")}
            )
            
            # Return the public URL
            return f"https://{self.supabase.supabase_url}/storage/v1/object/public/{self.bucket}/{filepath}"
            
        except Exception as e:
            logger.warning(f"Failed to download cover image: {e}")
            return None
    
    def process_folder(self, folder: str, sources: List[str] = None):
        """Process all audio files in a Supabase folder"""
        if sources is None:
            sources = ["youtube", "spotify", "soundcloud"]
            
        files = self.get_audio_files(folder)
        logger.info(f"Found {len(files)} audio files in '{folder}'")
        
        for file in files:
            logger.info(f"\nProcessing: {file['name']}")
            
            # Extract potential artist and title from filename
            artist, title = self.extract_metadata_from_filename(file["name"])
            logger.info(f"Extracted artist: '{artist}', title: '{title}'")
            
            # Search online metadata
            metadata = self.search_online_metadata(title, artist, sources)
            logger.info(f"Found {len(metadata)} metadata fields")
            
            # Download cover image if available
            cover_path = None
            if metadata.get("cover_url"):
                cover_path = self.download_cover_image(metadata["cover_url"], title)
            
            # Prepare track data
            track_data = {
                "title": metadata.get("title", title),
                "description": metadata.get("description", f"Track: {title} by {artist}"),
                "audio_path": file["url"],
                "cover_path": cover_path,
                "access_level": "premium",
                "slug": self.generate_slug(metadata.get("title", title)),
                "artist": metadata.get("artist", artist),
                "duration": metadata.get("duration"),
                "youtube_url": metadata.get("youtube_url"),
                "preview_url": metadata.get("preview_url")
            }
            
            # Insert into database
            if self.insert_track(track_data):
                logger.info(f"Successfully processed: {track_data['title']}")
            else:
                logger.error(f"Failed to process: {title}")
    
    def close(self):
        """Close database connection"""
        if self.db_conn:
            self.db_conn.close()
            logger.info("Database connection closed")