from django.db import models

class Empresa(models.Model):
    nit = models.CharField(max_length=20, primary_key=True, verbose_name="NIT")
    nombre = models.CharField(max_length=100, verbose_name="Nombre de la Empresa")
    direccion = models.CharField(max_length=200, verbose_name="Dirección")
    telefono = models.CharField(max_length=15, verbose_name="Teléfono")

    def __str__(self) -> str:
        return f"{self.nombre} ({self.nit})"

    class Meta:
        verbose_name = "Empresa"
        verbose_name_plural = "Empresas"