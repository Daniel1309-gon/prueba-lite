from rest_framework import serializers
from .models import Producto

class ProductoSerializer(serializers.ModelSerializer):
    # Esto es opcional pero útil: permite leer el nombre de la empresa en la respuesta
    # pero requiere que envíes el ID al crear (que es lo estándar).
    nombre_empresa = serializers.ReadOnlyField(source='empresa.nombre')

    class Meta:
        model = Producto
        fields = '__all__'