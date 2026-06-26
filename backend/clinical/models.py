from django.db import models

class Patient(models.Model):
    STATUS_CHOICES = [
        ('Activo', 'Activo'),
        ('Inactivo', 'Inactivo'),
    ]

    name = models.CharField(max_length=150, verbose_name="Nombre Completo")
    doc_id = models.CharField(max_length=30, unique=True, verbose_name="Identificación / Cédula")
    age = models.IntegerField(null=True, blank=True, verbose_name="Edad")
    phone = models.CharField(max_length=30, blank=True, verbose_name="Teléfono")
    email = models.EmailField(blank=True, verbose_name="Correo Electrónico")
    blood_type = models.CharField(max_length=5, default="O+", verbose_name="Tipo de Sangre")
    allergies = models.TextField(blank=True, default="Ninguna", verbose_name="Alergias")
    history = models.TextField(blank=True, verbose_name="Antecedentes Clínicos")
    last_visit = models.DateField(null=True, blank=True, verbose_name="Última Visita")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Activo')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Treatment(models.Model):
    STATUS_CHOICES = [
        ('Completado', 'Completado'),
        ('En Proceso', 'En Proceso'),
        ('Pendiente Laboratorio', 'Pendiente Laboratorio'),
    ]

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="treatments")
    name = models.CharField(max_length=200, verbose_name="Tratamiento")
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='En Proceso')
    cost = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Costo")
    date = models.DateField(verbose_name="Fecha")

    def __str__(self):
        return f"{self.name} - {self.patient.name}"
