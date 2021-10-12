from django.contrib import admin

from apps.administrators.models import Administrator


class AdministratorAdmin(admin.ModelAdmin):
    list_display = (
        'fname', 'lname', 'email', 'birth_date', 'phone_number',
        'gender', 'branch'
    )
    search_fields = ('branch',)

    def fname(self, x):
        return x.user.first_name

    def lname(self, x):
        return x.user.last_name

    def email(self, x):
        return x.user.email

    def birth_date(self, x):
        return x.user.birth_date

    def phone_number(self, x):
        return x.user.phone_number

    def gender(self, x):
        return x.user.gender

    def branch(self, x):
        return x.user.branch.name

    fname.short_description = "Имя"
    lname.short_description = "Фамилия"
    email.short_description = "Почта"
    birth_date.short_description = "Дата рождения"
    phone_number.short_description = "Телефон"
    gender.short_description = "Пол"
    branch.short_description = "Филиал"

admin.site.register(Administrator, AdministratorAdmin)
