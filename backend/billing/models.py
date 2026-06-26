from django.db import models

class Invoice(models.Model):
    STATUS_CHOICES = [
        ('Pagado', 'Pagado'),
        ('Pendiente', 'Pendiente'),
        ('Anulado', 'Anulado'),
    ]

    invoice_id = models.CharField(max_length=50, unique=True, verbose_name="Número de Factura")
    patient_name = models.CharField(max_length=150, verbose_name="Paciente")
    date = models.DateField(verbose_name="Fecha")
    amount = models.DecimalField(max_digits=12, decimal_places=2, verbose_name="Monto Total")
    method = models.CharField(max_length=50, default="Pendiente", verbose_name="Método de Pago")
    insurance = models.CharField(max_length=100, default="Particular", verbose_name="Seguro Médico / Coaseguro")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pendiente')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.invoice_id} - {self.patient_name}"
