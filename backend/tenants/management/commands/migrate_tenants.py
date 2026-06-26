import logging
from django.core.management.base import BaseCommand
from django.core.management import call_command
from django.db import connections
from django.conf import settings
from tenants.models import Tenant

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Executes migrations on all active tenant databases.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING('Starting mass migrations across all tenants...'))
        
        # Get all active tenants
        # Always run this query on the default master database
        tenants = Tenant.objects.using('default').filter(is_active=True)
        
        if not tenants.exists():
            self.stdout.write(self.style.SUCCESS('No active tenants found to migrate.'))
            return

        for tenant in tenants:
            db_name = tenant.db_name
            self.stdout.write(self.style.NOTICE(f"Migrating database: {db_name} for clinic: {tenant.name}"))
            
            # Dynamically register connection in case it's not present in this runtime thread
            if db_name not in connections:
                connections.databases[db_name] = {
                    'ENGINE': 'django.db.backends.postgresql',
                    'NAME': db_name,
                    'USER': settings.DATABASES['default']['USER'],
                    'PASSWORD': settings.DATABASES['default']['PASSWORD'],
                    'HOST': settings.DATABASES['default']['HOST'],
                    'PORT': settings.DATABASES['default']['PORT'],
                }
            
            try:
                # Call Django migrate targeting this tenant's connection
                call_command('migrate', database=db_name, interactive=False)
                self.stdout.write(self.style.SUCCESS(f"Successfully migrated database: {db_name}"))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Failed to migrate database {db_name}: {e}"))
                logger.error(f"Failed mass migration on database {db_name}: {e}")

        self.stdout.write(self.style.SUCCESS('Mass migrations completed.'))
