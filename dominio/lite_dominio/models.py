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


class Producto(models.Model):
    codigo = models.CharField(max_length=50, unique=True, verbose_name="Código")
    nombre = models.CharField(max_length=150, verbose_name="Nombre del producto")
    caracteristicas = models.TextField(verbose_name="Características")
    
    precio_cop = models.DecimalField(max_digits=15, decimal_places=2, verbose_name="Precio (COP)")
    precio_usd = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Precio (USD)")
    
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE, related_name='productos')

    def __str__(self) -> str:
        return f"{self.nombre} ({self.codigo})"

    class Meta:
        verbose_name = "Producto"
        verbose_name_plural = "Productos"