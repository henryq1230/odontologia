import threading
from django.db import connections
from django.conf import settings

# Thread-local storage to hold the active tenant's database name
_thread_locals = threading.local()

def get_current_tenant_db():
    return getattr(_thread_locals, 'tenant_db', 'default')

def set_current_tenant_db(db_name):
    _thread_locals.tenant_db = db_name

class TenantMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Determine the tenant based on the subdomain
        host = request.get_host().split(':')[0]
        host_parts = host.split('.')
        
        # Default fallback
        tenant_db = 'default'
        
        # Assumes subdomain format: client-subdomain.odontologia.ai or client-subdomain.localhost
        # If we have a subdomain (e.g., client.localhost or client.odontologia.ai)
        if len(host_parts) > 1 and host_parts[0] not in ('www', 'localhost', '127', 'odontologia'):
            subdomain = host_parts[0]
            
            # Here we resolve the subdomain to the corresponding database name.
            # In a production setup, we query the master database (default) to find the tenant:
            # from tenants.models import Tenant
            # tenant = Tenant.objects.filter(subdomain=subdomain, is_active=True).first()
            # For bootstrap and performance, we'll implement this look-up dynamically.
            # We import here to avoid circular imports.
            try:
                from tenants.models import Tenant
                # Run query on the master 'default' database
                tenant = Tenant.objects.using('default').filter(subdomain=subdomain, is_active=True).first()
                if tenant:
                    tenant_db = tenant.db_name
                    # Make sure the connection exists in Django's connections handler
                    if tenant_db not in connections:
                        # Configure database connection dynamically
                        connections.databases[tenant_db] = {
                            'ENGINE': 'django.db.backends.postgresql',
                            'NAME': tenant.db_name,
                            'USER': settings.DATABASES['default']['USER'],
                            'PASSWORD': settings.DATABASES['default']['PASSWORD'],
                            'HOST': settings.DATABASES['default']['HOST'],
                            'PORT': settings.DATABASES['default']['PORT'],
                        }
            except Exception:
                tenant_db = 'default'
        
        set_current_tenant_db(tenant_db)
        response = self.get_response(request)
        return response
