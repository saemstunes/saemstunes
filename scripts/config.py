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

ONLINE_SOURCES = ["youtube", "soundcloud", "spotify", "genius", "discogs"]
