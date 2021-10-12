from django.db.models.functions import Lower
from rest_framework.filters import OrderingFilter


class CaseInsensitiveOrderingFilter(OrderingFilter):
    """
    Custom filter to order case insensitive fields as CharField and TextField.
    To define filter it's needed to add char or text fields to list:
    ordering_case_insensitive_fields = ["field"]
    """
    def filter_queryset(self, request, queryset, view):
        ordering = self.get_ordering(request, queryset, view)
        insensitive_ordering = getattr(view, 'ordering_case_insensitive_fields', ())

        if ordering:
            new_ordering = []
            for field in ordering:
                if field.lstrip('-') in insensitive_ordering:
                    if field.startswith('-'):
                        new_ordering.append(Lower(field[1:]).desc())
                    else:
                        new_ordering.append(Lower(field).asc())
                else:
                    new_ordering.append(field)
            return queryset.order_by(*new_ordering)

        return queryset
