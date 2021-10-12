from django.core.mail import send_mail
from django.conf import settings

from crm.celery import app


@app.task
def send_password(email: str, password: str):
    message = f"""
    Мы рады приветствовать Вас в нашей команде!
    Используйте данные ниже для входа в систему http://crm-academy.tk:
    Ваш логин: {email}
    Ваш пароль: {password}
    """
    send_mail(
        "Добро пожаловать!",
        message, settings.EMAIL_HOST_USER,
        ['nursultandev@gmail.com', email],
        fail_silently=False
    )
