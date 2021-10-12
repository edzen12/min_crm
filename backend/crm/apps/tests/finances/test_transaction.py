from django.urls import reverse
from rest_framework import status

from apps.tests.base import BaseAPITestCaseSetup
from apps.branches.models import Branch
from apps.finances.models.wallet import Wallet
from apps.finances.models.transaction import Transaction


class TransactionAPITest(BaseAPITestCaseSetup):
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
        self.transaction = Transaction.objects.create(
            title='Test transaction title',
            amount='105.00',
            transaction_type='INCOME',
            wallet=self.wallet,
            branch=self.branch
        )

    def test_get_transaction_list_success(self):
        url = reverse('transactions-list')
        response = self.client.get(path=url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json().get('results')), 1)

    def test_get_transaction_detail_success(self):
        url = reverse('transactions-detail', kwargs={'pk': self.transaction.pk})
        response = self.client.get(path=url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['title'], self.transaction.title)

    def test_transaction_update_success(self):
        data = {
            "title": "New",
            "amount": 123,
            "confirmation": None,
            "comment": "",
            "wallet": self.wallet.wallet_id,
            "branch": None
        }
        url = reverse('transactions-detail', kwargs={'pk': self.transaction.pk})
        response = self.client.put(path=url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['title'], data['title'])

    def test_transaction_partial_update_success(self):
        data = {
            "title": "New transaction",
            "amount": 123,
        }
        url = reverse('transactions-detail', kwargs={'pk': self.transaction.pk})
        response = self.client.patch(path=url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['title'], data['title'])

    def test_transaction_delete_success(self):
        url = reverse('transactions-detail', kwargs={'pk': self.transaction.pk})
        response = self.client.delete(path=url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(
            Transaction.objects.filter(pk=self.transaction.pk).exists(), False)
