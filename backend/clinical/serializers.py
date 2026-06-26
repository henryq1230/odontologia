from rest_framework import serializers
from clinical.models import Patient, Treatment

class TreatmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Treatment
        fields = '__all__'

class PatientSerializer(serializers.ModelSerializer):
    treatments = TreatmentSerializer(many=True, read_only=True)

    class Meta:
        model = Patient
        fields = '__all__'
