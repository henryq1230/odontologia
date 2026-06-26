from django.urls import path
from tenants.views import PlanListView, TiloPayCallbackView

urlpatterns = [
    path('plans/', PlanListView.as_view(), name='plan-list'),
    path('payment-callback/', TiloPayCallbackView.as_view(), name='tilopay-callback'),
]
