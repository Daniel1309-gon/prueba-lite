from rest_framework import viewsets
from lite_dominio.models import Empresa
from .serializers import EmpresaSerializer
from .permissions import IsAdminOrReadOnly
from rest_framework.permissions import IsAuthenticated

class EmpresaViewSet(viewsets.ModelViewSet):
    queryset = Empresa.objects.all()
    serializer_class = EmpresaSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]