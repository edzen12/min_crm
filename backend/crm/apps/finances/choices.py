PRIVATE = "PRIVATE"
PUBLIC = "PUBLIC"
PRIVACY_CHOICES = (
    (PRIVATE, "Приватный кошелек"),
    (PUBLIC, "Публичный кошелек")
)


TRANSFER = "TRANSFER"
DEPOSIT = "DEPOSIT"
METHOD_CHOICES = (
    (TRANSFER, "Трансфер"),
    (DEPOSIT, "Пополнение")
)


INCOME = 'INCOME'
EXPENSE = 'EXPENSE'
STUDENT_PAYMENT = 'STUDENT'
TRANSACTION_CHOICES = (
    (INCOME, 'Доход'),
    (EXPENSE, 'Расход'),
    (STUDENT_PAYMENT, 'Оплата студента'),
)
