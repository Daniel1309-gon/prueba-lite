from rest_framework import viewsets
from lite_dominio.models import Producto
from .serializers import ProductoSerializer
from companies.permissions import IsAdminOrReadOnly
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponse
from django.core.mail import EmailMessage
from rest_framework.decorators import action
from rest_framework.response import Response
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
import io, os
from google import genai
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]

    @action(detail=False, methods=['get', 'post'], url_path='inventario_pdf')
    def descargar_inventario(self, request):
        buffer = io.BytesIO()

        doc = SimpleDocTemplate(buffer, pagesize=landscape(letter),
                                rightMargin=30, leftMargin=30, 
                                topMargin=30, bottomMargin=30)
        
        elements = []
        styles = getSampleStyleSheet()

        titulo = Paragraph("<b>Reporte de Inventario de Productos - Lite Thinking</b>", styles['Heading1'])
        elements.append(titulo)
        elements.append(Spacer(1, 20)) 

        encabezados = ['Código', 'Nombre', 'Características', 'Precio (COP)', 'Precio (USD)', 'Empresa']
        
        data = [encabezados]

        productos = self.get_queryset()

        style_cell = styles['Normal']
        style_cell.fontSize = 9  

        for p in productos:
            row = [
                p.codigo,
                Paragraph(p.nombre, style_cell),
                Paragraph(p.caracteristicas, style_cell),
                f"${p.precio_cop:,.0f}",  # Formato moneda COP (sin decimales)
                f"${p.precio_usd:,.2f}",  # Formato moneda USD (con 2 decimales)
                Paragraph(p.empresa.nombre, style_cell)
            ]
            data.append(row)


        col_widths = [60, 120, 200, 80, 80, 120] 
        t = Table(data, colWidths=col_widths)


        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.darkblue), # Fondo azul en encabezados
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke), # Texto blanco en encabezados
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),            # Alineación general centrada
            ('ALIGN', (1, 1), (2, -1), 'LEFT'),               # Alinear Nombres y Caract. a la izquierda
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),  # Fuente negrita en encabezados
            ('FONTSIZE', (0, 0), (-1, 0), 10),                # Tamaño fuente encabezados
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),           # Espacio en encabezados
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),   # Fondo beige en filas de datos
            ('GRID', (0, 0), (-1, -1), 1, colors.black),      # Rejilla negra
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),           # Alineación vertical al medio
        ]))

        elements.append(t)

        doc.build(elements)

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
    
    @action(detail=False, methods=['post'], url_path='generar_descripcion')
    def generar_descripcion(self, request):
        nombre_producto  = request.data.get('nombre')

        if not nombre_producto:
            return Response({'error': 'Se requiere el nombre del producto.'}, status=400)

        api_key = os.getenv('GEMINI_API_KEY')


        if api_key:

            try:
                client = genai.Client(api_key=api_key)
                prompt = (
                    f'Eres un experto en copywriting de productos.'
                    f'Genera una descripción atractiva y concisa para el siguiente producto: {nombre_producto}.'
                    f'(máximo 200 caracteres)'
                    f'Dame solo el texto, sin instrucciones adicionales.'
                )

                response = client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents = prompt
                )

                descripcion = response.text.strip()
                return Response({'descripcion': descripcion})
            
            except Exception as e:
                print(e)
                return Response({'error': f'Error al conectar con Gemini: {str(e)}'}, status=500)
        
        return Response({'error': 'La clave de API de Gemini no está configurada.'}, status=500)