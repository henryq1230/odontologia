from django.urls import path, include
from rest_framework.routers import DefaultRouter
from clinical.views import PatientViewSet, TreatmentViewSet

router = DefaultRouter()
router.register(r'patients', PatientViewSet)
router.register(r'treatments', TreatmentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
