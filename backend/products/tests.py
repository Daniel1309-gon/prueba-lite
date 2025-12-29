# backend/products/tests.py
from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status
from lite_dominio.models import Empresa, Producto
from unittest.mock import patch, MagicMock

class ProductoTests(APITestCase):

    def setUp(self):
        """
        Configuración inicial que se ejecuta antes de CADA test.
        Aquí creamos datos de prueba.
        """
        # 1. Crear un usuario Administrador (para poder crear/borrar)
        self.admin_user = User.objects.create_user(username='admin', password='123', is_staff=True)
        
        # 2. Crear una Empresa de prueba
        self.empresa = Empresa.objects.create(
            nit="900100100-1",
            nombre="Empresa Test",
            direccion="Calle Falsa 123",
            telefono="555-5555"
        )

        # 3. Crear un Producto de prueba
        self.producto = Producto.objects.create(
            codigo="TEST-001",
            nombre="Producto Beta",
            caracteristicas="Es un test",
            precio_cop=10000,
            precio_usd=2.5,
            empresa=self.empresa
        )

        # URLs
        self.url_productos = '/api/productos/'

    # --- TEST 1: Verificar Modelos (Dominio) ---
    def test_modelo_str(self):
        """Prueba que el método __str__ de los modelos funcione bien"""
        self.assertEqual(str(self.empresa), "Empresa Test (900100100-1)")
        self.assertEqual(str(self.producto), "Producto Beta (TEST-001)")

    # --- TEST 2: Seguridad (Permisos) ---
    def test_crear_producto_sin_auth(self):
        """Un usuario anónimo NO debe poder crear productos"""
        data = {
            "codigo": "PROD-X", 
            "nombre": "Hacker", 
            "precio_cop": 5000, 
            "precio_usd": 1, 
            "empresa": self.empresa.nit,
            "caracteristicas": "x"
        }
        response = self.client.post(self.url_productos, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_crear_producto_como_admin(self):
        """Un admin SÍ debe poder crear productos"""
        self.client.force_authenticate(user=self.admin_user)
        data = {
            "codigo": "PROD-NEW", 
            "nombre": "Nuevo Prod", 
            "precio_cop": 20000, 
            "precio_usd": 5, 
            "empresa": self.empresa.nit,
            "caracteristicas": "Original"
        }
        response = self.client.post(self.url_productos, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Producto.objects.count(), 2) # El del setUp + este

    # --- TEST 3: Mocking de IA (Gemini) ---
    @patch('products.views.genai.Client') # 👈 Mockeamos la librería en la VISTA
    def test_generar_descripcion_ia(self, mock_client_class):
        """Probamos el endpoint de IA sin llamar realmente a Google"""
        self.client.force_authenticate(user=self.admin_user)

        # Simulamos la respuesta de Gemini
        mock_response = MagicMock()
        mock_response.text = "Descripción generada por Mock"
        
        # Configuramos el mock para que devuelva nuestra respuesta falsa
        mock_instance = mock_client_class.return_value
        mock_instance.models.generate_content.return_value = mock_response

        # Hacemos la petición
        url = f"{self.url_productos}generar_descripcion/"
        data = {"nombre": "Zapatos Voladores"}
        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['descripcion'], "Descripción generada por Mock")

    # --- TEST 4: Mocking de PDF y Correo ---
    @patch('products.views.EmailMessage.send') # 👈 Mockeamos el envío de email
    def test_descargar_pdf_y_enviar_correo(self, mock_send):
        """Probamos generar PDF y enviarlo sin usar SMTP real"""
        self.client.force_authenticate(user=self.admin_user)

        # Simulamos que el envío fue exitoso (retorna 1)
        mock_send.return_value = 1

        url = f"{self.url_productos}inventario_pdf/"
        # Enviamos el email en el body para activar la lógica de envío
        data = {"email": "test@prueba.com"}
        
        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Verificamos que se llamó al método send() del email
        mock_send.assert_called_once()