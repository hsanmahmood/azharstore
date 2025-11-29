import os
import subprocess
from dotenv import load_dotenv
from supabase import create_client, Client
from passlib.context import CryptContext

load_dotenv()

# This script is intended to be run from the root of the repository.
# It reads the db.sql file and executes it against the Supabase database.
# It also sets a default delivery password.

def run_sql_from_file(db_url: str, filename: str):
    """Executes SQL commands from a file using psql."""
    psql_command = [
        "psql",
        db_url,
        "-f",
        filename
    ]
    try:
        subprocess.run(psql_command, check=True, capture_output=True, text=True)
        print(f"Successfully executed {filename}")
    except subprocess.CalledProcessError as e:
        print(f"Error executing {filename}:")
        print(e.stderr)
        raise

def main():
    url: str = os.environ.get("SUPABASE_URL")
    key: str = os.environ.get("SUPABASE_KEY")

    if not url or not key:
        print("Supabase URL or Key not found in environment variables.")
        return

    # Construct the database URL for psql
    # Assumes the standard Supabase connection string format
    db_user = "postgres"
    db_host = url.split('@')[1].split(':')[0]
    db_name = "postgres"
    db_port = "5432" # Default Supabase port

    # We need the database password, which is not part of the Supabase URL or key.
    # This is a limitation of this script. For now, we'll assume the user has
    # set up their environment to allow psql to connect without a password,
    # or that they have a .pgpass file set up.

    # For local development, you might need to manually set the password in the connection string.
    # For now, we will attempt to connect without it.

    db_url = f"postgresql://{db_user}@{db_host}:{db_port}/{db_name}"

    sql_file = "db.sql"

    print("Running database setup...")

    # Execute the SQL file
    try:
        run_sql_from_file(db_url, sql_file)
    except Exception as e:
        print(f"Failed to execute SQL file: {e}")
        return

    # Set default delivery password
    supabase: Client = create_client(url, key)
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    default_password = "deliverypassword" # You should change this
    hashed_password = pwd_context.hash(default_password)

    try:
        supabase.table("system_settings").upsert({
            "key": "delivery_password",
            "value": hashed_password
        }).execute()
        print("Default delivery password set.")
    except Exception as e:
        print(f"Failed to set default delivery password: {e}")

if __name__ == "__main__":
    main()
