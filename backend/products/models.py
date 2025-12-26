from django.db import models
# Importamos el modelo de Empresa para hacer la relación
from companies.models import Empresa 

class Producto(models.Model):
    codigo = models.CharField(max_length=50, unique=True, verbose_name="Código")
    nombre = models.CharField(max_length=150, verbose_name="Nombre del producto")
    caracteristicas = models.TextField(verbose_name="Características")
    
    precio_cop = models.DecimalField(max_digits=15, decimal_places=2, verbose_name="Precio (COP)")
    precio_usd = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Precio (USD)")
    
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE, related_name='productos')

    def __str__(self):
        return f"{self.nombre} ({self.codigo})"

    class Meta:
        verbose_name = "Producto"
        verbose_name_plural = "Productos"