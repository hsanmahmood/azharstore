import os
import re
from typing import List, Set
from pathlib import Path


def scan_frontend_translation_keys(frontend_path: str = None) -> List[str]:
    """
    Scans the frontend directory for all translation keys used in t('key') or t("key") calls.
    Returns a sorted list of unique translation keys.
    """
    if frontend_path is None:
        # Default to the frontend/src directory relative to backend
        backend_dir = Path(__file__).parent.parent
        frontend_path = backend_dir.parent / "frontend" / "src"
    else:
        frontend_path = Path(frontend_path)
    
    if not frontend_path.exists():
        raise FileNotFoundError(f"Frontend path not found: {frontend_path}")
    
    keys: Set[str] = set()
    
    # Regex patterns to match t('key') or t("key") with support for nested quotes
    patterns = [
        re.compile(r"t\(['\"]([^'\"]+)['\"]\)"),  # Basic: t('key') or t("key")
        re.compile(r"t\(`([^`]+)`\)"),  # Template literals: t(`key`)
    ]
    
    # Walk through all .js, .jsx, .ts, .tsx files
    for root, _, files in os.walk(frontend_path):
        for file in files:
            if file.endswith(('.js', '.jsx', '.ts', '.tsx')):
                filepath = Path(root) / file
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                        
                        # Apply all patterns
                        for pattern in patterns:
                            matches = pattern.findall(content)
                            for match in matches:
                                # Clean up the key (remove extra spaces, etc.)
                                key = match.strip()
                                if key:  # Only add non-empty keys
                                    keys.add(key)
                except Exception as e:
                    # Skip files that can't be read
                    print(f"Warning: Could not read {filepath}: {e}")
                    continue
    
    # Return sorted list for consistency
    return sorted(list(keys))


def get_missing_translation_keys(existing_keys: List[str], frontend_path: str = None) -> List[str]:
    """
    Returns translation keys that exist in the frontend code but not in the database.
    
    Args:
        existing_keys: List of translation keys already in the database
        frontend_path: Optional path to frontend directory
    
    Returns:
        List of missing translation keys
    """
    all_keys = scan_frontend_translation_keys(frontend_path)
    existing_set = set(existing_keys)
    missing_keys = [key for key in all_keys if key not in existing_set]
    return sorted(missing_keys)


if __name__ == '__main__':
    # Test the scanner
    try:
        keys = scan_frontend_translation_keys()
        print(f"Found {len(keys)} translation keys:")
        for key in keys[:10]:  # Print first 10
            print(f"  - {key}")
        if len(keys) > 10:
            print(f"  ... and {len(keys) - 10} more")
    except Exception as e:
        print(f"Error: {e}")
