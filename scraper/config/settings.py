import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_ROOT = Path(__file__).parent.parent
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
    
    SUPABASE_URL = os.getenv("SUPABASE_URL")
    SUPABASE_KEY = os.getenv("SUPABASE_KEY")
    
    CRAWL_DEPTH = int(os.getenv("CRAWL_DEPTH", "10"))
    MAX_PAGES_PER_DOMAIN = int(os.getenv("MAX_PAGES_PER_DOMAIN", "100"))
    MAX_VISITED_URLS_PER_DOMAIN = int(os.getenv("MAX_VISITED_URLS_PER_DOMAIN", "10000"))
    REQUEST_TIMEOUT = int(os.getenv("REQUEST_TIMEOUT", "30"))
    RATE_LIMIT_DELAY = float(os.getenv("RATE_LIMIT_DELAY", "1.0"))
    CONCURRENT_REQUESTS = int(os.getenv("CONCURRENT_REQUESTS", "5"))
    
    MIN_TITLE_LENGTH = int(os.getenv("MIN_TITLE_LENGTH", "10"))
    MIN_DESCRIPTION_LENGTH = int(os.getenv("MIN_DESCRIPTION_LENGTH", "20"))
    
    # Seed URLs (comprehensive list from our discussion)
    SEED_URLS = [
        # Sheet music & scores
        "https://imslp.org",
        "https://musescore.com",
        "https://musescore.org",
        "https://mutopiaproject.org",
        "https://cpdl.org",
        "https://musopen.org",
        "https://www.8notes.com",
        "https://www.musicnotes.com",
        "https://www.sheetmusicplus.com",
        "https://www.noteflight.com",
        "https://flat.io",
        # Theory & ear training
        "https://www.musictheory.net",
        "https://www.teoria.com",
        "https://tonegym.co",
        "https://tonesavvy.com",
        "https://www.soundgym.co",
        "https://www.completeeartrainer.com",
        "https://www.earmaster.com",
        "https://tenutoapp.com",
        # Interactive / experiments / tools
        "https://musiclab.chromeexperiments.com",
        "https://hooktheory.com",
        "https://chordify.net",
        "https://bandlab.com",
        "https://www.keybr.com",
        "https://www.synthesiagame.com",
        # Video lesson platforms & teacher sites
        "https://www.justinguitar.com",
        "https://www.drumeo.com",
        "https://www.pianote.com",
        "https://www.flowkey.com",
        "https://yousician.com",
        # YouTube channels (education-first)
        "https://www.youtube.com/user/JustinSandercoe",
        "https://www.youtube.com/channel/UCJquYOG5EL82sKTfH9aMA9Q",  # Rick Beato
        "https://www.youtube.com/@AdamNeely",
        "https://www.youtube.com/user/DrumeoDRUM",
        "https://www.youtube.com/c/pianoteOfficial",
        # MOOCs & university resources
        "https://www.coursera.org",
        "https://www.edx.org",
        "https://www.futurelearn.com",
        "https://ocw.mit.edu",
        # Teacher resources, advocacy & curated lists
        "https://www.savethemusic.org",
        "https://nafme.org",
        "https://www.kennedy-center.org/education",
        "https://www.weareteachers.com",
        # Research, journals & library guides
        "https://libguides.library.ohio.edu",
        "https://scholar.google.com",  # for targeted discovery queries
        "https://www.researchgate.net",
        # Community Q&A, forums
        "https://music.stackexchange.com",
        "https://www.reddit.com/r/MusicEd/",
        "https://www.reddit.com/r/musictheory/",
        # Composition & DAW/tool communities
        "https://www.bandlab.com",
        "https://www.spitfireaudio.com",  # libraries & education articles
        # Cultural / ethnomusicology / archives
        "https://folkways.si.edu",
        "https://www.allmusic.com",
        # Misc useful sources / directories
        "https://www.8notes.com",  # duplicate allowed purposely for priority
        "https://www.musicteachers.co.uk",
        "https://www.classicalarchives.com",
        # App stores / product pages for metadata (if needed)
        "https://play.google.com/store",
        "https://apps.apple.com",
    ]

  # Music-related keywords for content filtering & discovery
    MUSIC_KEYWORDS = [
        # instruments & basic topics
        "music", "piano", "guitar", "violin", "cello", "trumpet", "saxophone",
        "drums", "percussion", "ukulele", "bass", "voice", "choir",
        # pedagogical & content types
        "music theory", "music education", "music lesson", "music tutorial",
        "music lesson plan", "lesson plan", "practice exercise", "warm-up",
        "vocal warm-up", "vocal technique", "sight reading", "sight-singing",
        "ear training", "interval training", "rhythm exercises", "rhythms",
        "scale", "scales", "key signature", "circle of fifths",
        "sheet music", "sheet-music", "music score", "music notation",
        "sheet music pdf", "score", "music xml", "musicxml",
        "arrangement", "arranging", "orchestration", "harmonization",
        "songwriting", "composition", "composition exercises",
        "chords", "chord progression", "progressions", "fingerpicking",
        "fingerstyle", "guitar technique", "piano technique",
        "music production", "recording", "mixing", "music technology",
        "studio", "DAW", "digital audio workstation",
        # resource types & metadata cues
        "video lesson", "tutorial video", "pdf", "mp3", "audio",
        "infographic", "interactive", "exercise", "drill", "quiz",
        "MOOC", "course", "syllabus", "curriculum", "workshop",
        # education levels / metadata inference cues
        "beginner", "intro", "for beginners", "intermediate", "advanced",
        "masterclass", "professional", "graded", "level",
        # policy / identification terms (paywall detection)
        "subscribe", "member", "subscription", "paywall", "login to view",
        # cultural & research
        "ethnomusicology", "traditional rhythms", "folk", "culture",
        "music history", "musicology", "research", "journal", "DOI",
        # source-specific shorthand (helpful for discovery queries)
        "IMSLP", "MuseScore", "Musopen", "Mutopia", "CPDL",
        "JustinGuitar", "Rick Beato", "Adam Neely", "Drumeo", "Pianote"
    ]
    
    # Level detection keywords
    LEVEL_KEYWORDS = {
        "beginner": {"beginner", "introduction", "foundation", "basic", "starter", "easy"},
        "intermediate": {"intermediate", "develop", "advance basics", "progressing"},
        "advanced": {"advanced", "expert", "specialized", "deep dive", "master", "professional"}
    }
    
    # Access level detection keywords
    ACCESS_LEVEL_KEYWORDS = {
        "free": {"free", "open access", "complimentary", "no charge"},
        "restricted": {"login", "sign up", "premium", "purchase", "subscription", "member", "paywall"}
    }
    
    # Instructor detection patterns
    INSTRUCTOR_PATTERNS = [
        r"Instructor:\s*([^\n<]+)",
        r"Facilitator:\s*([^\n<]+)",
        r"Taught by\s*([^\n<]+)",
        r"By\s+([^\n<]+)",
        r"Teacher:\s*([^\n<]+)",
        r"Educator:\s*([^\n<]+)"
    ]
    
    # Common stopwords for tag extraction
    STOP_WORDS = {
        "the", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by",
        "this", "that", "these", "those", "is", "are", "was", "were", "be", "been", "being"
    }

settings = Settings()
