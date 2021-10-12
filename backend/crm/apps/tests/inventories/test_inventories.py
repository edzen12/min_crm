from django.urls import reverse
from rest_framework import status
from apps.tests.base import BaseAPITestCaseSetup
from apps.inventories.models import Inventory
from apps.branches.models import Branch


class InventoryAPITest(BaseAPITestCaseSetup):
    def setUp(self):
        super().setUp()
        self.branch = Branch.objects.create(
            name='Karakol Liceyum',
            oblast='IK',
            city='Karakol',
            address='Alamedin 1',
            email='branch@gmail.com',
            telephone_number='+996200422541',
            description='akskajfdksa'
        )
        self.inventory = Inventory.objects.create(
            title='Computers',
            amount=5,
            price=75000,
            branch=self.branch,
        )

    def test_get_inventory_list_success(self):
        url = reverse('inventories-list')
        response = self.client.get(path=url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json().get('results')), 1)

    def test_get_inventory_detail_success(self):
        url = reverse('inventories-detail', kwargs={'pk': self.inventory.pk})
        response = self.client.get(path=url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['title'], self.inventory.title)

    def test_inventory_create_success(self):
        data = {
            "title": "Blackboard",
            "amount": 2,
            "price": 45,
            "branch": 1
        }
        url = reverse("inventories-list")
        response = self.client.post(path=url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.json()['amount'], data['amount'])

    def test_inventory_update_success(self):
        data = {
            "title": "Blackboard",
            "amount": 44,
            "price": 45,
            "branch": 1
        }
        url = reverse("inventories-detail", kwargs={'pk': self.inventory.pk})
        response = self.client.put(path=url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['amount'], data['amount'])

    def test_inventory_partial_update_success(self):
        data = {
            "title": "Chair",
        }
        url = reverse("inventories-detail", kwargs={'pk': self.inventory.pk})
        response = self.client.patch(path=url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['title'], data['title'])

    def test_get_inventory_delete_success(self):
        url = reverse('inventories-detail', kwargs={'pk': self.inventory.pk})
        response = self.client.delete(path=url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(
            Inventory.objects.filter(pk=self.inventory.pk).exists(), False)
