from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth import get_user_model
from django.utils.translation import gettext, gettext_lazy as _


User = get_user_model()


class UserAdmin(UserAdmin):
    list_display = (
        'email', 'first_name', 'last_name',
        'is_administrator', 'is_student', 'is_trainer', 'is_staff_member'
    )
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal info'), {'fields': (
            'first_name', 'last_name', 'is_trainer', 'avatar',
            'is_student', 'is_administrator', 'is_staff_member',
            'phone_number', 'second_phone_number',
            'birth_date', 'gender', 'instagram', 'facebook', 'linkedin',
            'telegram', 'branch'
        )}),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'is_staff', 'is_active')}
        ),
    )
    search_fields = ('email',)
    ordering = ('email',)


admin.site.register(User, UserAdmin)


admin.site.site_header = "IT LICEYUMS ADMINISTRATION"
admin.site.site_title = "IT LICEYUMS ADMINISTRATION"
admin.site.index_title = "IT LICEYUMS"
