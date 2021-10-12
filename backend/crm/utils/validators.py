from django.core.validators import RegexValidator


phone_number_regex = RegexValidator(
    regex=r'^(\+996)\d{9}$',
    message=(
        "Телефон должен быть в формате +996[код][номер]"
    )
)
