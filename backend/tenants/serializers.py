from rest_framework import serializers
from tenants.models import Plan, Tenant

class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = ['id', 'name', 'price', 'frequency', 'description', 'tilopay_link', 'modules', 'is_active']

class TenantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tenant
        fields = ['id', 'name', 'subdomain', 'db_name', 'plan', 'is_active', 'owner_name', 'owner_email', 'created_at']
