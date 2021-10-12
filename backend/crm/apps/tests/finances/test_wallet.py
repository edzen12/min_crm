from django.urls import reverse
from rest_framework import status

from apps.tests.base import BaseAPITestCaseSetup
from apps.finances.models.wallet import Wallet
from apps.branches.models import Branch


class WalletAPITest(BaseAPITestCaseSetup):
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
        self.wallet = Wallet.objects.create(
            name='Test Wallet data',
            description='Hello world',
            balance='123.00',
            account_number='test_account_num',
            branch=self.branch
        )

    def test_get_wallet_list_success(self):
        url = reverse('wallets-list')
        response = self.client.get(path=url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json().get('results')), 1)

    def test_get_wallet_detail_success(self):
        url = reverse('wallets-detail', kwargs={'pk': self.wallet.pk})
        response = self.client.get(path=url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['name'], self.wallet.name)

    def test_wallet_create_success(self):
        data = {
            "name": "Osh Liceyum",
            "description": "test description",
            "balance": "123.00",
            "account_number": "osh_test_account",
            "branch": 1
        }
        url = reverse('wallets-list')
        response = self.client.post(path=url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.json()['name'], data['name'])

    def test_wallet_update_success(self):
        data = {
            "name": "Osh",
            "description": "asdasd",
            "privacy": "PRIVATE",
            "balance": "123.00",
            "account_number": "sasdasdasda",
            "branch": 1
        }
        url = reverse('wallets-detail', kwargs={'pk': self.wallet.pk})
        response = self.client.put(path=url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['name'], data['name'])

    def test_wallet_delete_success(self):
        url = reverse('wallets-detail', kwargs={'pk': self.wallet.pk})
        response = self.client.delete(path=url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(
            Wallet.objects.filter(pk=self.wallet.pk).exists(), False)
