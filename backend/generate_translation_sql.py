import json
from pathlib import Path

def flatten_json(nested_json, parent_key='', sep='.'):
    """
    Flatten nested JSON into dot-notation keys.
    Example: {"common": {"save": "حفظ"}} -> {"common.save": "حفظ"}
    """
    items = []
    for k, v in nested_json.items():
        new_key = f"{parent_key}{sep}{k}" if parent_key else k
        if isinstance(v, dict):
            items.extend(flatten_json(v, new_key, sep=sep).items())
        else:
            items.append((new_key, v))
    return dict(items)

def escape_sql_string(s):
    """Escape single quotes for SQL."""
    return s.replace("'", "''")

def generate_sql_inserts(json_file_path):
    """Generate SQL INSERT statements from ar.json file."""
    
    # Read the JSON file
    with open(json_file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Flatten the nested structure
    flat_data = flatten_json(data)
    
    # Generate SQL INSERT statements
    sql_statements = []
    sql_statements.append("-- Initial translations from ar.json")
    sql_statements.append("-- Generated automatically")
    sql_statements.append("")
    
    for key, value in sorted(flat_data.items()):
        escaped_key = escape_sql_string(key)
        escaped_value = escape_sql_string(str(value))
        sql = f"INSERT INTO translations (key, value) VALUES ('{escaped_key}', '{escaped_value}') ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;"
        sql_statements.append(sql)
    
    return '\n'.join(sql_statements)

if __name__ == '__main__':
    # Path to ar.json
    json_path = Path(__file__).parent.parent / 'frontend' / 'src' / 'i18n' / 'locales' / 'ar.json'
    
    if not json_path.exists():
        print(f"Error: {json_path} not found")
        exit(1)
    
    # Generate SQL
    sql_content = generate_sql_inserts(json_path)
    
    # Write to file
    output_path = Path(__file__).parent / 'translations_insert.sql'
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(sql_content)
    
    print(f"✅ Generated {output_path}")
    print(f"📊 Total translations: {len(sql_content.split('INSERT'))- 1}")
