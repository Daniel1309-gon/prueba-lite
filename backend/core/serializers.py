from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Agregamos datos extra al token encriptado
        token['is_admin'] = user.is_staff
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        # Agregamos datos extra a la respuesta JSON directa
        data['is_admin'] = self.user.is_staff
        return data