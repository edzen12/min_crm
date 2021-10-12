from rest_framework import viewsets, permissions, filters
from rest_framework import mixins
from rest_framework.response import Response

from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Prefetch, Q

from .serializers import (
    ExamSerializer,
    UserExamSerializer, 
    ExamDetailSerializer,
    ExamDetailStudentsSerializer, 
    UserExamDetailSerializer,  
)

from .models import (
    Exam,
    UserExam,
    Question, 
    QuestionAnswer, 
    UserAnswer, 
)

from .permissions import ActionAvailable, AllowStudentViewExam


class ExamAPIViewSet(viewsets.ModelViewSet):
    queryset = Exam.objects.prefetch_related(
        Prefetch(
            'questions', queryset=Question.objects.order_by('-id')
        ),
        Prefetch(
            'questions__answers', queryset=QuestionAnswer.objects.order_by('-id')
        )
    ).select_related('course').all().order_by('-id')
    permission_classes = (AllowStudentViewExam, )
    serializer_class = ExamSerializer
    filter_backends = [
        DjangoFilterBackend,
        filters.OrderingFilter,
        filters.SearchFilter,
    ]
    search_fields = ['title']
    filterset_fields = ['exam_type']
    ordering_fields = ['title']

    def check_users_course(self, course_pk=None):
        user = self.request.user
        if user.is_student:
            if course_pk:
                if user.student.klass is None or user.student.klass.course is None:
                    self.queryset = self.queryset.filter(course=None, pk=course_pk)
                else:
                    self.queryset = self.queryset.filter(Q(course=user.student.klass.course)|Q(course=None), pk=course_pk)
                return user.is_student, self.queryset
            else:
                if user.student.klass is None or user.student.klass.course is None:
                    self.queryset = self.queryset.filter(course=None)
                else:
                    self.queryset = self.queryset.filter(Q(course=user.student.klass.course)|Q(course=None))
                return user.is_student, self.queryset
        else:
            if course_pk:
                self.queryset = self.queryset.filter(pk=course_pk)
        return user.is_student, self.queryset

    def get_queryset(self):
        _, self.queryset = self.check_users_course()
        return self.queryset

    def retrieve(self, request, pk=None):
        user_is_student, instance = self.check_users_course(course_pk=pk)
        if not instance:
            return Response({
                'error': 'You don`t have access to this exam or it doesn`t exist'
            }, 400)
        else:
            instance = instance.first()
        if not instance.is_active and user_is_student:
            return Response({
                'error': 'This exam is not active'
            }, 400)

        if user_is_student:
            serializer = ExamDetailStudentsSerializer(instance)
        else:
            serializer = ExamDetailSerializer(instance)
        return Response(serializer.data)


class UserExamAPIViewset(viewsets.ModelViewSet):
    # Update method use as checking exam
    queryset = UserExam.objects.prefetch_related(
        Prefetch(
            'user_answers', queryset=UserAnswer.objects.order_by('-id')
        ),
        Prefetch(
            'user_answers__question__answers', 
            queryset=QuestionAnswer.objects.order_by('-id')
        ),
        'user_answers__check_boxes__answer', 
        'user_answers__answer', 
        'user_answers__question'
    ).all().order_by('-id')
    serializer_class = UserExamSerializer
    permission_classes = (ActionAvailable,)
    filter_backends = [
        filters.OrderingFilter,
        filters.SearchFilter,
    ]
    search_fields = ['first_name', 'last_name', 'email', 'grade']
    ordering_fields = [
        'first_name', 'last_name',
        'email', 'grade', 'checked',
    ]

    def retrieve(self, request, pk=None):
        instance = UserExam.objects.get(pk=pk)
        if not request.user.is_student or instance.user == request.user:
            serializer = UserExamDetailSerializer(instance)
            return Response(serializer.data)
        return Response({'error': 'you don`t have permission to this page'}, 400)



class QuestionView(mixins.DestroyModelMixin,
                   viewsets.GenericViewSet):
    queryset = Question.objects.all()
