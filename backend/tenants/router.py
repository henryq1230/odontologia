from tenants.middleware import get_current_tenant_db

class TenantRouter:
    """
    A router to control all database operations on models for different tenants.
    """
    def db_for_read(self, model, **hints):
        # Tenant models (like Tenant, Plan) should always reside in the master 'default' database
        if model._meta.app_label == 'tenants':
            return 'default'
        return get_current_tenant_db()

    def db_for_write(self, model, **hints):
        if model._meta.app_label == 'tenants':
            return 'default'
        return get_current_tenant_db()

    def allow_relation(self, obj1, obj2, **hints):
        # Allow relations if they are in the same database
        db_obj1 = hints.get('database', get_current_tenant_db())
        db_obj2 = hints.get('database', get_current_tenant_db())
        if obj1._meta.app_label == 'tenants' or obj2._meta.app_label == 'tenants':
            return True
        return db_obj1 == db_obj2

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        # tenants app should only migrate on the 'default' master database
        if app_label == 'tenants':
            return db == 'default'
        # Other apps should be allowed to migrate anywhere, but during tenant migration
        # we target the specific tenant database.
        return True
