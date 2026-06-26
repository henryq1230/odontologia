from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from billing.models import Invoice
from billing.serializers import InvoiceSerializer

class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all().order_by('-date')
    serializer_class = InvoiceSerializer
    permission_classes = [AllowAny]
