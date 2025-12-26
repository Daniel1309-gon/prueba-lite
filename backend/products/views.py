from rest_framework import viewsets
from .models import Producto
from .serializers import ProductoSerializer
from companies.permissions import IsAdminOrReadOnly
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponse
from django.core.mail import EmailMessage
from rest_framework.decorators import action
from rest_framework.response import Response
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
import io

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]

    @action(detail=False, methods=['get', 'post'], url_path='inventario_pdf')
    def descargar_inventario(self, request):
        buffer = io.BytesIO()
        p = canvas.Canvas(buffer, pagesize=letter)

        p.setTitle("Reporte de inventario")
        p.drawString(100, 750, "Reporte de Inventario de Productos - Lite Thinking")
        p.line(100, 745, 500, 745)

        y = 720

        productos = self.get_queryset()
        for producto in productos:
            texto = f'Código: {producto.codigo} | Nombre: {producto.nombre} | Características: {producto.caracteristicas} | Precio (COP): {producto.precio_cop} | Precio (USD): {producto.precio_usd} | Empresa: {producto.empresa.nombre}'
            
            p.drawString(100, y, texto)
            y -= 20
            if y < 50:
                p.showPage()
                y = 750

        p.save()
        buffer.seek(0)
        
        if request.method == 'GET':
            response = HttpResponse(buffer, content_type='application/pdf')
            response['Content-Disposition'] = 'attachment; filename="inventario_productos.pdf"'
            return response

        if request.method == 'POST':
            email_destino = request.data.get('email')
            if not email_destino:
                return Response({'error': 'Se requiere un correo electrónico.'}, status=400)

            email = EmailMessage(
                'Reporte de Inventario de Productos',
                'Adjunto encontrarás el reporte de inventario de productos.',
                'noreply@pruebalite.com',
                [email_destino],
            )
            email.attach('inventario_productos.pdf', buffer.getvalue(), 'application/pdf')

            try:
                email.send()
                return Response({'mensaje': 'Correo enviado exitosamente.'})
            except Exception as e:
                return Response({'error': f'Error al enviar el correo: {str(e)}'}, status=500)