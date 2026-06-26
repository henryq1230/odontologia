from django.db import models

class Plan(models.Model):
    FREQUENCY_CHOICES = [
        ('MONTHLY', 'Mensual'),
        ('ANNUALLY', 'Anual'),
    ]

    name = models.CharField(max_length=100, unique=True, verbose_name="Nombre del Plan")
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Precio")
    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES, default='MONTHLY', verbose_name="Frecuencia de Pago")
    description = models.TextField(blank=True, verbose_name="Descripción")
    tilopay_link = models.URLField(max_length=500, blank=True, verbose_name="Enlace de Pago TiloPay")
    
    # Enabled modules as a JSON field
    # Example: ["smart_intake", "citas_ia", "odontograma", "diagnostico_ia", "inventario", "facturacion", "marketing"]
    modules = models.JSONField(default=list, help_text="Lista de módulos habilitados para este plan")
    
    is_active = models.BooleanField(default=True, verbose_name="Activo")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - ${self.price}/{self.get_frequency_display()}"

class Tenant(models.Model):
    name = models.CharField(max_length=150, verbose_name="Nombre de la Clínica")
    subdomain = models.CharField(max_length=63, unique=True, verbose_name="Subdominio")
    db_name = models.CharField(max_length=63, unique=True, verbose_name="Nombre de Base de Datos")
    
    plan = models.ForeignKey(Plan, on_delete=models.PROTECT, related_name="tenants", verbose_name="Plan de Suscripción")
    is_active = models.BooleanField(default=True, verbose_name="Activo / Al Día")
    
    # Admin Contact
    owner_name = models.CharField(max_length=150, verbose_name="Nombre del Propietario")
    owner_email = models.EmailField(verbose_name="Email del Propietario")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.subdomain}.odontologia.ai)"
