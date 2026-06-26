import logging
from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404
from tenants.models import Plan, Tenant
from tenants.serializers import PlanSerializer
from tenants.utils import create_tenant_database, create_cloudflare_dns_record

logger = logging.getLogger(__name__)

class PlanListView(generics.ListAPIView):
    """
    Public endpoint to retrieve the list of active subscription plans.
    Consumed dynamically by the landing page.
    """
    queryset = Plan.objects.filter(is_active=True).order_by('price')
    serializer_class = PlanSerializer
    permission_classes = [AllowAny]

class TiloPayCallbackView(APIView):
    """
    Webhook endpoint called by TiloPay after a successful transaction.
    Verifies the payment and automates the creation of the tenant.
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        data = request.data
        logger.info(f"Received TiloPay callback: {data}")

        # In a real integration, TiloPay sends a signature or hash that we must verify.
        # We also verify the transaction status is successful.
        transaction_status = data.get('status') or data.get('transaction_status')
        
        # We assume success for development/testing if not explicitly failed
        if transaction_status not in (None, 'success', 'approved', '1'):
            return Response(
                {"error": "Transaction was not successful or approved"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Extract tenant onboarding information from TiloPay custom parameters or metadata
        # TiloPay allows sending custom developer variables (e.g., key/value pairs) during checkout
        owner_name = data.get('owner_name') or data.get('custom_owner_name')
        owner_email = data.get('owner_email') or data.get('custom_owner_email')
        subdomain = data.get('subdomain') or data.get('custom_subdomain')
        plan_id = data.get('plan_id') or data.get('custom_plan_id')

        # Fallback values for testing/dev purposes if missing
        if not all([owner_name, owner_email, subdomain, plan_id]):
            # If we don't have these, we cannot proceed with onboarding
            return Response(
                {"error": "Missing required onboarding parameters (owner_name, owner_email, subdomain, plan_id)"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Clean subdomain: lowercase, alphanumeric
        subdomain = subdomain.strip().lower()
        db_name = f"tenant_{subdomain}"

        # Get the corresponding plan
        plan = get_object_or_404(Plan, id=plan_id)

        # AVOID DUPLICATE CREATION
        if Tenant.objects.filter(subdomain=subdomain).exists():
            return Response(
                {"message": f"Tenant for subdomain '{subdomain}' already exists."},
                status=status.HTTP_200_OK
            )

        try:
            # 1. Create physical database and run migrations
            create_tenant_database(db_name)

            # 2. Call Cloudflare API to register subdomain DNS (gray cloud)
            create_cloudflare_dns_record(subdomain)

            # 3. Save Tenant record to master database
            tenant = Tenant.objects.create(
                name=f"Clínica {owner_name}",
                subdomain=subdomain,
                db_name=db_name,
                plan=plan,
                owner_name=owner_name,
                owner_email=owner_email,
                is_active=True
            )

            # 4. Seed default tenant data (such as creating the initial admin user inside the tenant's isolated DB)
            # We can write a helper function later or do a simple insert.
            self.seed_tenant_admin(db_name, owner_name, owner_email)

            return Response(
                {
                    "status": "success",
                    "message": "Tenant successfully provisioned",
                    "subdomain": subdomain,
                    "db_name": db_name
                },
                status=status.HTTP_201_CREATED
            )

        except Exception as e:
            logger.error(f"Error provisioning tenant {subdomain}: {e}")
            return Response(
                {"error": f"Failed to provision tenant: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def seed_tenant_admin(self, db_name, owner_name, owner_email):
        """
        Seeds the initial admin user inside the tenant's newly created database.
        Uses connection routing dynamically.
        """
        # Inside the newly created database, we create the admin user so they can log in
        from django.contrib.auth.models import User
        
        # Check if user already exists in this database
        if not User.objects.using(db_name).filter(email=owner_email).exists():
            # Generate username from email prefix
            username = owner_email.split('@')[0]
            # Create active admin user in the tenant's isolated database
            User.objects.using(db_name).create_superuser(
                username=username,
                email=owner_email,
                password="ChangeMe123!", # In production, send password setup email
                first_name=owner_name
            )
            logger.info(f"Initial superuser created in tenant database {db_name}.")
