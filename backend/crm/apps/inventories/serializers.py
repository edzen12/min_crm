from rest_framework import serializers

from apps.inventories.models import Inventory


class InventorySerializer(serializers.ModelSerializer):
    total_price = serializers.IntegerField(read_only=True)
    branch_name = serializers.CharField(read_only=True)

    class Meta:
        model = Inventory
        fields = '__all__'
        read_only_fields = ('id', 'inventory_number')
