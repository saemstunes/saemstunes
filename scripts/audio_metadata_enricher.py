import os
import re
import time
import random
import requests
import psycopg2
from supabase import create_client
from urllib.parse import unquote
from datetime import datetime
from typing import Dict, List, Optional, Tuple
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class SupabaseAudioEnricher:
    def __init__(self, supabase_config: Dict, db_config: Dict, api_keys: Dict):
        self.supabase = create_client(supabase_config["url"], supabase_config["key"])
        self.bucket = supabase_config["bucket"]
        self.db_config = db_config
        self.api_keys = api_keys
        self.db_conn = None
        self._init_db()
        
        self.color_palettes = [
            {
                "primary_color": "#5A270F",
                "secondary_color": "#8B4513", 
                "background_gradient": "linear-gradient(145deg, #5A270F 0%, #8B4513 50%, #000 100%)"
            },
            {
                "primary_color": "#EEB38C",
                "secondary_color": "#DEB887",
                "background_gradient": "linear-gradient(165deg, #EEB38C 0%, #DEB887 50%, #000 100%)"
            },
            {
                "primary_color": "#5A270F", 
                "secondary_color": "#8B4513",
                "background_gradient": "linear-gradient(145deg, #5A270F 0%, #8B4513 50%, #000 100%)"
            },
            {
                "primary_color": "#DF8142",
                "secondary_color": "#F4A460", 
                "background_gradient": "linear-gradient(180deg, #DF8142 0%, #F4A460 50%, #000 100%)"
            },
            {
                "primary_color": "#5A270F",
                "secondary_color": "#8B4513",
                "background_gradient": "linear-gradient(145deg, #5A270F 0%, #8B4513 50%, #000 100%)"
            },
            {
                "primary_color": "#DF8142",
                "secondary_color": "#F4A460",
                "background_gradient": "linear-gradient(180deg, #DF8142 0%, #F4A460 50%, #000 100%)"
            },
            {
                "primary_color": "#EEB38C",
                "secondary_color": "#DEB887",
                "background_gradient": "linear-gradient(165deg, #EEB38C 0%, #DEB887 50%, #000 100%)"
            },
            {
                "primary_color": "#DF8142",
                "secondary_color": "#F4A460",
                "background_gradient": "linear-gradient(180deg, #DF8142 0%, #F4A460 50%, #000 100%)"
            }
        ]
        
    def _init_db(self):
        try:
            self.db_conn = psycopg2.connect(
                host=self.db_config["host"],
                database=self.db_config["database"],
                user=self.db_config["user"],
                password=self.db_config["password"],
                port=self.db_config["port"]
            )
            logger.info("Database connection established")
        except Exception as e:
            logger.error(f"Database connection failed: {e}")
            raise
    
    def get_audio_files(self, folder: str = "Tracks") -> List[Dict]:
        try:
            files = self.supabase.storage.from_(self.bucket).list(folder)
            audio_files = []
            
            for f in files:
                if self._is_audio_file(f["name"]):
                    raw_url = f"https://{self.supabase.supabase_url}/storage/v1/object/public/{self.bucket}/{folder}/{f['name']}"
                    corrected_url = self._fix_double_https(raw_url)
                    
                    audio_files.append({
                        "name": unquote(f["name"]),
                        "path": f"{folder}/{f['name']}",
                        "url": corrected_url
                    })
            
            return audio_files
        except Exception as e:
            logger.error(f"Error retrieving audio files: {e}")
            return []
    
    def _fix_double_https(self, url: str) -> str:
        if url.startswith("https://https://"):
            return url.replace("https://https://", "https://")
        return url
    
    def _is_audio_file(self, filename: str) -> bool:
        audio_ext = (".mp3", ".m4a", ".wav", ".aac", ".flac", ".ogg")
        return filename.lower().endswith(audio_ext)
    
    def extract_metadata_from_filename(self, filename: str) -> Tuple[str, str]:
        name = os.path.splitext(filename)[0]
        
        patterns = [
            r'^(.*?)\s*[-–—]\s*(.*?)$',
            r'^(.*?)\s*ft\.?\s*(.*?)$',
            r'^(.*?)\s*feat\.?\s*(.*?)$',
        ]
        
        artist, title = "Unknown Artist", name
        
        for pattern in patterns:
            match = re.search(pattern, name, re.IGNORECASE)
            if match:
                artist = match.group(1).strip()
                title = match.group(2).strip()
                break
                
        # Format artist with first letter capital for each word
        artist = self.format_artist_name(artist)
        
        # Clean up title
        title = re.sub(r'[\(\)\[\]\-\_]', ' ', title)
        title = re.sub(r'\s+', ' ', title).strip()
        
        return artist, title
    
    def format_artist_name(self, name: str) -> str:
        """Format artist name with first letter capital for each word"""
        name = re.sub(r'[\(\)\[\]\-\_]', ' ', name)
        name = re.sub(r'\s+', ' ', name).strip()
        return ' '.join(word.capitalize() for word in name.split())
    
    def search_online_metadata(self, track_name: str, artist: str = None, sources: List[str] = None) -> Dict:
        if sources is None:
            sources = ["youtube", "spotify"]
            
        metadata = {}
        
        queries = []
        if artist and artist != "Unknown Artist":
            queries.append(f"{artist} {track_name}")
            queries.append(f"{track_name} {artist}")
        queries.append(track_name)
        
        for query in queries:
            if not metadata and "youtube" in sources:
                metadata.update(self._search_youtube(query))
            
            if not metadata and "spotify" in sources:
                metadata.update(self._search_spotify(query))
                
            if metadata:
                break
                
        return metadata
    
    def _search_youtube(self, query: str) -> Dict:
        try:
            search_url = "https://www.googleapis.com/youtube/v3/search"
            params = {
                "part": "snippet",
                "q": f"{query} saemstunes",
                "type": "video",
                "key": self.api_keys.get("youtube"),
                "maxResults": 5,
                "videoCategoryId": "10"
            }
            
            response = requests.get(search_url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            if "items" in data and data["items"]:
                for item in data["items"]:
                    channel_title = item["snippet"]["channelTitle"].lower()
                    if "saemstunes" in channel_title:
                        video_id = item["id"]["videoId"]
                        youtube_url = f"https://youtu.be/{video_id}"
                        
                        # Format artist name properly
                        artist_name = self.format_artist_name(item["snippet"]["channelTitle"])
                        
                        return {
                            "youtube_url": youtube_url,
                            "preview_url": youtube_url,
                            "video_url": youtube_url,
                            "description": item["snippet"]["description"],
                            "artist": artist_name,
                            "cover_url": item["snippet"]["thumbnails"]["high"]["url"]
                        }
                        
        except Exception as e:
            logger.warning(f"YouTube search failed for '{query}': {e}")
            
        return {}
    
    def _search_spotify(self, query: str) -> Dict:
        try:
            search_url = "https://api.spotify.com/v1/search"
            headers = {"Authorization": f"Bearer {self.api_keys.get('spotify')}"}
            params = {
                "q": query,
                "type": "track",
                "limit": 1
            }
            
            response = requests.get(search_url, headers=headers, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            if "tracks" in data and data["tracks"]["items"]:
                track = data["tracks"]["items"][0]
                
                # Format artist name properly
                artist_names = [self.format_artist_name(a["name"]) for a in track["artists"]]
                
                return {
                    "duration": int(track["duration_ms"] / 1000),
                    "artist": ", ".join(artist_names),
                    "title": track["name"],
                    "cover_url": track["album"]["images"][0]["url"] if track["album"]["images"] else None
                }
                
        except Exception as e:
            logger.warning(f"Spotify search failed for '{query}': {e}")
            
        return {}
    
    def insert_track(self, track_data: Dict) -> bool:
        check_query = "SELECT id FROM tracks WHERE audio_path = %(audio_path)s"
        
        try:
            with self.db_conn.cursor() as cursor:
                cursor.execute(check_query, {"audio_path": track_data["audio_path"]})
                existing_track = cursor.fetchone()
                
                if existing_track:
                    update_query = """
                    UPDATE tracks SET
                        title = %(title)s,
                        description = %(description)s,
                        cover_path = %(cover_path)s,
                        artist = %(artist)s,
                        duration = %(duration)s,
                        youtube_url = %(youtube_url)s,
                        preview_url = %(preview_url)s,
                        video_url = %(video_url)s,
                        primary_color = %(primary_color)s,
                        secondary_color = %(secondary_color)s,
                        background_gradient = %(background_gradient)s,
                        alternate_audio_path = %(alternate_audio_path)s,
                        access_level = %(access_level)s,
                        updated_at = NOW()
                    WHERE audio_path = %(audio_path)s
                    """
                    cursor.execute(update_query, track_data)
                    logger.info(f"Updated track: {track_data['title']}")
                else:
                    insert_query = """
                    INSERT INTO public.tracks (
                        title, description, audio_path, cover_path, access_level,
                        slug, artist, duration, youtube_url, preview_url, video_url,
                        primary_color, secondary_color, background_gradient, alternate_audio_path
                    ) VALUES (
                        %(title)s, %(description)s, %(audio_path)s, %(cover_path)s, 
                        %(access_level)s, %(slug)s, %(artist)s, %(duration)s, 
                        %(youtube_url)s, %(preview_url)s, %(video_url)s,
                        %(primary_color)s, %(secondary_color)s, %(background_gradient)s, %(alternate_audio_path)s
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
        slug = re.sub(r'[^a-zA-Z0-9\s-]', '', title.lower())
        slug = re.sub(r'\s+', '-', slug)
        slug = slug.strip('-')
        return slug
    
    def get_random_color_scheme(self) -> Dict:
        return random.choice(self.color_palettes)
    
    def download_cover_image(self, cover_url: str, track_name: str) -> Optional[str]:
        if not cover_url:
            return None
            
        try:
            response = requests.get(cover_url, timeout=10)
            response.raise_for_status()
            
            ext = os.path.splitext(cover_url)[1] or ".jpg"
            filename = f"cover-{self.generate_slug(track_name)}{ext}"
            filepath = f"covers/{filename}"
            
            self.supabase.storage.from_(self.bucket).upload(
                filepath,
                response.content,
                {"content-type": response.headers.get("content-type", "image/jpeg")}
            )
            
            return f"https://{self.supabase.supabase_url}/storage/v1/object/public/{self.bucket}/{filepath}"
            
        except Exception as e:
            logger.warning(f"Failed to download cover image: {e}")
            return None
    
    def process_folder(self, folder: str, sources: List[str] = None):
        if sources is None:
            sources = ["youtube", "spotify"]
            
        files = self.get_audio_files(folder)
        logger.info(f"Found {len(files)} audio files in '{folder}'")
        
        for file in files:
            logger.info(f"Processing: {file['name']}")
            
            artist, title = self.extract_metadata_from_filename(file["name"])
            logger.info(f"Extracted artist: '{artist}', title: '{title}'")
            
            metadata = self.search_online_metadata(title, artist, sources)
            logger.info(f"Found {len(metadata)} metadata fields")
            
            cover_path = None
            if metadata.get("cover_url"):
                cover_path = self.download_cover_image(metadata["cover_url"], title)
            
            color_scheme = self.get_random_color_scheme()
            
            # Ensure artist name is properly formatted
            final_artist = self.format_artist_name(metadata.get("artist", artist))
            
            track_data = {
                "title": metadata.get("title", title),
                "description": metadata.get("description", f"Track: {title} by {final_artist}"),
                "audio_path": file["url"],
                "cover_path": cover_path,
                "access_level": "free",
                "slug": self.generate_slug(metadata.get("title", title)),
                "artist": final_artist,
                "duration": metadata.get("duration"),
                "youtube_url": metadata.get("youtube_url"),
                "preview_url": metadata.get("preview_url", metadata.get("youtube_url")),
                "video_url": metadata.get("video_url", metadata.get("youtube_url")),
                "primary_color": color_scheme["primary_color"],
                "secondary_color": color_scheme["secondary_color"],
                "background_gradient": color_scheme["background_gradient"],
                "alternate_audio_path": file["path"]
            }
            
            if self.insert_track(track_data):
                logger.info(f"Successfully processed: {track_data['title']}")
            else:
                logger.error(f"Failed to process: {title}")
    
    def close(self):
        if self.db_conn:
            self.db_conn.close()
            logger.info("Database connection closed")