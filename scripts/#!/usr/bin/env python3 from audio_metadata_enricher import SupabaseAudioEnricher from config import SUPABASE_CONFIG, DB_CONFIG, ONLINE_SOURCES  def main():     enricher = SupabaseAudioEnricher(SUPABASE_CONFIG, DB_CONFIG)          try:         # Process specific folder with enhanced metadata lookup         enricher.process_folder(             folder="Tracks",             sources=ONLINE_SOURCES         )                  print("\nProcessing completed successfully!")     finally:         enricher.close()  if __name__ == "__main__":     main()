#!/usr/bin/env python3
from audio_metadata_enricher import SupabaseAudioEnricher
from config import SUPABASE_CONFIG, DB_CONFIG, ONLINE_SOURCES

def main():
    enricher = SupabaseAudioEnricher(SUPABASE_CONFIG, DB_CONFIG)
    
    try:
        # Process specific folder with enhanced metadata lookup
        enricher.process_folder(
            folder="Tracks",
            sources=ONLINE_SOURCES
        )
        
        print("\nProcessing completed successfully!")
    finally:
        enricher.close()

if __name__ == "__main__":
    main()
