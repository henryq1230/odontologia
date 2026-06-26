from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from clinical.models import Patient, Treatment
from clinical.serializers import PatientSerializer, TreatmentSerializer

class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all().order_by('-created_at')
    serializer_class = PatientSerializer
    permission_classes = [AllowAny] # In production, restrict to authenticated medical users

class TreatmentViewSet(viewsets.ModelViewSet):
    queryset = Treatment.objects.all().order_by('-date')
    serializer_class = TreatmentSerializer
    permission_classes = [AllowAny]
