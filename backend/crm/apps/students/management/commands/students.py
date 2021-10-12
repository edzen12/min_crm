from django.core.management.base import BaseCommand

from apps.users.models import User

import string
import random


def random_string(string_length=8):
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(string_length))


def email_generator(param):
    email = param + "@gmail.com"
    return email


class Command(BaseCommand):

    def handle(self, *args, **options):
        users_amount = 20
        while users_amount > 0:
            name = random_string()
            lname = random_string()
            email = email_generator(name)
            user = User.objects.create(first_name=name, last_name=lname, is_student=True, email=email)
            password = User.objects.make_random_password()
            user.set_password(password)
            user.save()
            users_amount -= 1
