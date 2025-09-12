#!/usr/bin/env python3
from audio_metadata_enricher import SupabaseAudioEnricher
from config import SUPABASE_CONFIG, DB_CONFIG, API_KEYS, ONLINE_SOURCES

def main():
    enricher = SupabaseAudioEnricher(SUPABASE_CONFIG, DB_CONFIG, API_KEYS)
    
    try:
        # Process specific folder with enhanced metadata lookup
        enricher.process_folder(
            folder="Tracks",
            sources=ONLINE_SOURCES
        )
        
        print("\nProcessing completed successfully!")
    except Exception as e:
        print(f"Processing failed: {e}")
    finally:
        enricher.close()

if __name__ == "__main__":
    main()