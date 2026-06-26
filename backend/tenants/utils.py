import requests
import logging
from django.db import connection, connections
from django.conf import settings
from django.core.management import call_command

logger = logging.getLogger(__name__)

def create_tenant_database(db_name):
    """
    Creates a new physical database in PostgreSQL for a new tenant.
    """
    # Raw SQL execution to create database.
    # Note: CREATE DATABASE cannot run inside a transaction block, 
    # so we must execute it on a connection with autocommit = True.
    with connection.cursor() as cursor:
        # Prevent SQL injection by validating db_name is alphanumeric + underscores
        cleaned_db_name = "".join([c for c in db_name if c.isalnum() or c == "_"])
        
        # Check if database already exists
        cursor.execute("SELECT 1 FROM pg_database WHERE datname = %s;", [cleaned_db_name])
        exists = cursor.fetchone()
        
        if not exists:
            # Set autocommit to True to allow CREATE DATABASE
            old_state = connection.get_autocommit()
            connection.set_autocommit(True)
            try:
                cursor.execute(f"CREATE DATABASE {cleaned_db_name};")
                logger.info(f"Database {cleaned_db_name} created successfully.")
            finally:
                connection.set_autocommit(old_state)
        else:
            logger.info(f"Database {cleaned_db_name} already exists.")
            
    # Dynamically configure the connection in Django settings
    if cleaned_db_name not in connections:
        connections.databases[cleaned_db_name] = {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': cleaned_db_name,
            'USER': settings.DATABASES['default']['USER'],
            'PASSWORD': settings.DATABASES['default']['PASSWORD'],
            'HOST': settings.DATABASES['default']['HOST'],
            'PORT': settings.DATABASES['default']['PORT'],
        }

    # Run migrations on the newly created database
    # This runs migrations for all installed apps targeting the new database.
    try:
        call_command('migrate', database=cleaned_db_name, interactive=False)
        logger.info(f"Migrations executed successfully on database {cleaned_db_name}.")
    except Exception as e:
        logger.error(f"Error running migrations on database {cleaned_db_name}: {e}")
        raise e

def create_cloudflare_dns_record(subdomain):
    """
    Calls Cloudflare API to create a CNAME record for the clinic's subdomain.
    DNS record is created with proxied=False (gray cloud) as per user specifications.
    """
    import os
    api_token = os.getenv('CLOUDFLARE_API_TOKEN')
    zone_id = os.getenv('CLOUDFLARE_ZONE_ID')
    target = os.getenv('CLOUDFLARE_TARGET_CNAME')

    if not api_token or not zone_id or not target:
        logger.warning("Cloudflare DNS variables not configured. Skipping DNS creation.")
        return False

    url = f"https://api.cloudflare.com/client/v4/zones/{zone_id}/dns_records"
    headers = {
        "Authorization": f"Bearer {api_token}",
        "Content-Type": "application/json"
    }
    
    data = {
        "type": "CNAME",
        "name": subdomain, # e.g. "clinica" to create CNAME clinica.odontologia.ai
        "content": target, # e.g. "odontologia-prod.up.railway.app" or render equivalent
        "ttl": 1, # Automatic TTL
        "proxied": False # Gray Cloud to let Railway/Render native SSL certificate handle TLS.
    }

    try:
        response = requests.post(url, json=data, headers=headers, timeout=10)
        res_json = response.json()
        if response.status_code == 200 or res_json.get('success'):
            logger.info(f"Cloudflare DNS record for {subdomain} created successfully.")
            return True
        else:
            logger.error(f"Cloudflare API returned error: {res_json.get('errors')}")
            return False
    except Exception as e:
        logger.error(f"Exception during Cloudflare DNS creation for {subdomain}: {e}")
        return False
