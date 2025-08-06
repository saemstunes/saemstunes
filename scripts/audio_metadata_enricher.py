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
from urllib.parse import unquote
from datetime import datetime
from typing import Dict, List, Optional
from collections import defaultdict

class SupabaseAudioEnricher:
    def __init__(self, supabase_config: Dict, db_config: Dict):
        self.supabase = create_client(
            supabase_config["url"],
            supabase_config["key"]
        )
        self.bucket = supabase_config["bucket"]
        self.db_config = db_config
        self.db_conn = None
        self._init_db()
        
    def _init_db(self):
        """Initialize PostgreSQL connection"""
        self.db_conn = psycopg2.connect(
            host=self.db_config["host"],
            database=self.db_config["database"],
            user=self.db_config["user"],
            password=self.db_config["password"],
            port=self.db_config["port"]
        )
    
    def get_audio_files(self, folder: str = "Tracks") -> List[Dict]:
        """Retrieve audio files from Supabase storage"""
        files = self.supabase.storage.from_(self.bucket).list(folder)
        return [
            {
                "name": unquote(f["name"]),
                "path": f"{folder}/{f['name']}",
                "url": f"https://{self.supabase.supabase_url}/storage/v1/object/public/{self.bucket}/{folder}/{f['name']}"
            }
            for f in files if self._is_audio_file(f["name"])
        ]
    
    def _is_audio_file(self, filename: str) -> bool:
        """Check if file is an audio format"""
        audio_ext = (".mp3", ".m4a", ".wav", ".aac", ".flac")
        return filename.lower().endswith(audio_ext)
    
    def extract_base_name(self, filename: str) -> str:
        """Extract clean track name from filename"""
        # Remove extension and special characters
        name = os.path.splitext(filename)[0]
        name = re.sub(r'[\(\)\[\]\-\_]', ' ', name)
        name = re.sub(r'\s+', ' ', name).strip()
        return name
    
    def search_online_metadata(self, track_name: str, sources: List[str]) -> Dict:
        """Search for track metadata across multiple platforms"""
        metadata = defaultdict(lambda: None)
        track_name_clean = track_name.split('(')[0].strip()
        
        # YouTube search
        if "youtube" in sources:
            metadata.update(self._search_youtube(track_name_clean))
        
        # SoundCloud search
        if "soundcloud" in sources:
            metadata.update(self._search_soundcloud(track_name_clean))
        
        # Spotify search
        if "spotify" in sources:
            metadata.update(self._search_spotify(track_name_clean))
        
        # Genius lyrics search
        if "genius" in sources:
            metadata.update(self._search_genius(track_name_clean))
        
        # Discogs metadata
        if "discogs" in sources:
            metadata.update(self._search_discogs(track_name_clean))
        
        return dict(metadata)
    
    def _search_youtube(self, query: str) -> Dict:
        """Search YouTube for track metadata"""
        try:
            search_url = f"https://www.googleapis.com/youtube/v3/search"
            params = {
                "part": "snippet",
                "q": f"{query} official",
                "type": "video",
                "key": "YOUR_YOUTUBE_API_KEY",
                "maxResults": 1
            }
            response = requests.get(search_url, params=params).json()
            if "items" in response and response["items"]:
                item = response["items"][0]
                return {
                    "youtube_url": f"https://youtu.be/{item['id']['videoId']}",
                    "description": item["snippet"]["description"],
                    "artist": item["snippet"]["channelTitle"],
                    "cover_path": item["snippet"]["thumbnails"]["high"]["url"]
                }
        except Exception:
            pass
        return {}
    
    def _search_soundcloud(self, query: str) -> Dict:
        """Search SoundCloud for track metadata"""
        try:
            search_url = "https://api-v2.soundcloud.com/search/tracks"
            params = {
                "q": query,
                "client_id": "YOUR_SOUNDCLOUD_CLIENT_ID",
                "limit": 1
            }
            response = requests.get(search_url, params=params).json()
            if "collection" in response and response["collection"]:
                track = response["collection"][0]
                return {
                    "preview_url": track["permalink_url"],
                    "duration": int(track["duration"] / 1000),
                    "title": track["title"],
                    "artist": track["user"]["username"],
                    "cover_path": track["artwork_url"]
                }
        except Exception:
            pass
        return {}
    
    def _search_spotify(self, query: str) -> Dict:
        """Search Spotify for track metadata"""
        try:
            search_url = "https://api.spotify.com/v1/search"
            headers = {"Authorization": "Bearer YOUR_SPOTIFY_ACCESS_TOKEN"}
            params = {
                "q": query,
                "type": "track",
                "limit": 1
            }
            response = requests.get(search_url, headers=headers, params=params).json()
            if "tracks" in response and response["tracks"]["items"]:
                track = response["tracks"]["items"][0]
                return {
                    "preview_url": track["preview_url"],
                    "duration": int(track["duration_ms"] / 1000),
                    "artist": ", ".join([a["name"] for a in track["artists"]]),
                    "cover_path": track["album"]["images"][0]["url"] if track["album"]["images"] else None
                }
        except Exception:
            pass
        return {}
    
    def _search_genius(self, query: str) -> Dict:
        """Search Genius for lyrics and metadata"""
        try:
            search_url = "https://api.genius.com/search"
            headers = {"Authorization": "Bearer YOUR_GENIUS_ACCESS_TOKEN"}
            params = {"q": query}
            response = requests.get(search_url, headers=headers, params=params).json()
            if "hits" in response["response"] and response["response"]["hits"]:
                hit = response["response"]["hits"][0]["result"]
                return {
                    "description": f"Lyrics available at: {hit['url']}",
                    "artist": hit["primary_artist"]["name"]
                }
        except Exception:
            pass
        return {}
    
    def _search_discogs(self, query: str) -> Dict:
        """Search Discogs for music metadata"""
        try:
            search_url = "https://api.discogs.com/database/search"
            params = {
                "q": query,
                "token": "YOUR_DISCOGS_TOKEN",
                "type": "release",
                "per_page": 1
            }
            response = requests.get(search_url, params=params).json()
            if "results" in response and response["results"]:
                result = response["results"][0]
                return {
                    "title": result["title"],
                    "year": result.get("year", datetime.now().year),
                    "genre": result.get("genre", ["Unknown"])[0]
                }
        except Exception:
            pass
        return {}
    
    def insert_track(self, track_data: Dict) -> bool:
        """Insert enriched track into database"""
        query = """
        INSERT INTO public.tracks (
            title, description, audio_path, cover_path, access_level,
            slug, artist, duration, youtube_url, preview_url
        ) VALUES (
            %(title)s, %(description)s, %(audio_path)s, %(cover_path)s, 
            %(access_level)s, %(slug)s, %(artist)s, %(duration)s, 
            %(youtube_url)s, %(preview_url)s
        )
        ON CONFLICT (audio_path) DO UPDATE SET
            title = EXCLUDED.title,
            description = EXCLUDED.description,
            cover_path = EXCLUDED.cover_path,
            artist = EXCLUDED.artist,
            duration = EXCLUDED.duration,
            youtube_url = EXCLUDED.youtube_url,
            preview_url = EXCLUDED.preview_url
        """
        try:
            with self.db_conn.cursor() as cursor:
                cursor.execute(query, track_data)
                self.db_conn.commit()
            return True
        except Exception as e:
            print(f"Database error: {e}")
            self.db_conn.rollback()
            return False
    
    def generate_slug(self, title: str) -> str:
        """Generate URL-friendly slug"""
        slug = re.sub(r'[^a-zA-Z0-9\s-]', '', title.lower())
        slug = re.sub(r'\s+', '-', slug)
        slug = slug.strip('-')
        return f"{slug}-{int(time.time())}"
    
    def process_folder(self, folder: str, sources: List[str]):
        """Process all audio files in a Supabase folder"""
        files = self.get_audio_files(folder)
        print(f"Found {len(files)} audio files in '{folder}'")
        
        for file in files:
            print(f"\nProcessing: {file['name']}")
            base_name = self.extract_base_name(file["name"])
            
            # Search online metadata
            metadata = self.search_online_metadata(base_name, sources)
            print(f"Found {len(metadata)} metadata fields")
            
            # Prepare track data
            track_data = {
                "title": metadata.get("title", base_name),
                "description": metadata.get("description", f"Track: {base_name}"),
                "audio_path": file["url"],
                "cover_path": metadata.get("cover_path"),
                "access_level": "premium",
                "slug": self.generate_slug(base_name),
                "artist": metadata.get("artist", "Unknown Artist"),
                "duration": metadata.get("duration"),
                "youtube_url": metadata.get("youtube_url"),
                "preview_url": metadata.get("preview_url")
            }
            
            # Insert into database
            if self.insert_track(track_data):
                print(f"Inserted: {track_data['title']}")
            else:
                print(f"Failed to insert: {base_name}")
    
    def close(self):
        """Close database connection"""
        if self.db_conn:
            self.db_conn.close()
