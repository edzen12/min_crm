from faker import Faker

from django.contrib.auth import get_user_model
from django.core.management import BaseCommand

from apps.students.models import Student

from datetime import date


faker = Faker()


class Command(BaseCommand):
    help = "command will fake data"

    def execute(self, *args, **options):
        for i in range(15):
            user = get_user_model().objects.create(email=faker.email(), password=faker.first_name())
            Student.objects.create(user=user, enrollment_date=faker.date_between_dates(date(2015, 1, 1), date(2020, 1, 1)))