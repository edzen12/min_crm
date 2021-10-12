from rest_framework.test import APITestCase
from rest_framework.reverse import reverse
from apps.users.models import User


class BaseAPITestCaseSetup(APITestCase):
    def setUp(self):
        self.super_user = User.objects.create_superuser(
            email='test_user@example.com', password='test12345'
        )
        response = self.client.post(
            reverse('token_obtain_pair'),
            {
                'email': self.super_user.email,
                'password': 'test12345'
            }
        )
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {response.data["access"]}')
