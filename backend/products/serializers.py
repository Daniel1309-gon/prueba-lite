from rest_framework import serializers
from .models import Producto

class ProductoSerializer(serializers.ModelSerializer):

    nombre_empresa = serializers.ReadOnlyField(source='empresa.nombre')

    class Meta:
        model = Producto
        fields = '__all__'