import re
from urllib.parse import urlparse, urljoin

def normalize_url(url: str) -> str:
    parsed = urlparse(url)
    normalized = f"{parsed.scheme}://{parsed.netloc}{parsed.path}"
    
    if parsed.query:
        normalized += f"?{parsed.query}"
    
    return normalized.rstrip('/')

def normalize_image_url(url: str, base_url: str) -> str:
    if not url or url.startswith('data:'):
        return None
    
    if url.startswith('//'):
        url = f"https:{url}"
    
    if not url.startswith(('http://', 'https://')):
        url = urljoin(base_url, url)
    
    parsed = urlparse(url)
    if not parsed.scheme or not parsed.netloc:
        return None
    
    return url

def should_follow_link(url: str, base_url: str) -> bool:
    parsed_url = urlparse(url)
    parsed_base = urlparse(base_url)
    
    if parsed_url.netloc != parsed_base.netloc:
        return False
    
    excluded_paths = {
        '/login', '/signup', '/logout', '/account', '/profile',
        '/admin', '/dashboard', '/cart', '/checkout', '/search'
    }
    
    if any(parsed_url.path.startswith(path) for path in excluded_paths):
        return False
    
    excluded_extensions = {'.doc', '.docx', '.zip', '.rar', '.exe', '.dmg'}
    if any(parsed_url.path.lower().endswith(ext) for ext in excluded_extensions):
        return False
    
    return True
