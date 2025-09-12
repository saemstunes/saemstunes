import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_CONFIG = {
    "url": os.getenv("SUPABASE_URL"),
    "key": os.getenv("SUPABASE_KEY"),
    "bucket": "tracks"
}

DB_CONFIG = {
    "host": os.getenv("DB_HOST"),
    "database": os.getenv("DB_NAME"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "port": 5432
}

API_KEYS = {
    "youtube": os.getenv("YOUTUBE_API_KEY"),
    "soundcloud": os.getenv("SOUNDCLOUD_CLIENT_ID"),
    "spotify": os.getenv("SPOTIFY_ACCESS_TOKEN"),
    "genius": os.getenv("GENIUS_ACCESS_TOKEN"),
    "discogs": os.getenv("DISCOGS_TOKEN")
}

ONLINE_SOURCES = ["youtube", "spotify", "soundcloud"]