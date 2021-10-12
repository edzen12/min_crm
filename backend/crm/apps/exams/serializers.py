from django.contrib.auth import get_user_model

from rest_framework import serializers

from .models import (
    Exam,
    Question, 
    QuestionAnswer, 

    UserCheckBoxAnswer, 
    UserAnswer, 
    UserExam, 
)
from apps.courses.models import Course


class QuestionAnswerSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = QuestionAnswer
        fields = ('id', 'title', 'is_correct', )


class ExamQuestionSerializer(serializers.ModelSerializer):
    answers = QuestionAnswerSerializer(many=True, required=False)
    id = serializers.IntegerField(required=False)

    class Meta:
        model = Question
        fields = ('id', 'title', 'question_type', 'answers', 'attachment_file')

    def validate(self, instance):
        if instance.get('answers'):
            if instance.get('question_type') == Question.RADIO_BUTTON:
                answers = [i for i in instance.get('answers') if i.get('is_correct') == True]
                if len(answers) > 1:
                    raise serializers.ValidationError('Must be only one correct answer for radio button question')
        return instance


class ExamCourseSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    title = serializers.CharField(read_only=True)


class ExamSerializer(serializers.ModelSerializer):
    questions = ExamQuestionSerializer(many=True, allow_null=True, write_only=True)
    course = ExamCourseSerializer(required=False)

    class Meta:
        model = Exam
        fields = (
            'id', 'title', 'exam_type', 'questions', 
            'course', 'is_active', 'time_duration', 
        )

    def to_representation(self, instance):
        data = super(ExamSerializer, self).to_representation(instance)
        current_user = self.context['request'].user
        current_user_passed_exam = UserExam.objects.filter(
            user=current_user,
            exam=instance
        )
        if current_user_passed_exam:
            data['passed_exam'] = True
        else:
            data['passed_exam'] = False
        return data

    def create(self, validated_data):
        questions = validated_data.pop('questions')
        course = validated_data.pop('course', None)
        if course is not None:
            try:
                course = Course.objects.get(id=course.get('id'))
            except Course.DoesNotExist as e:
                raise serializers.ValidationError(e)
            instance = Exam.objects.create(**validated_data, course=course)
        else:
            instance = Exam.objects.create(**validated_data)
        
        for question in questions:
            answers = question.pop('answers', [])
            exam_question = Question.objects.create(exam=instance, **question)
            for answer in answers:
                QuestionAnswer.objects.create(question=exam_question, **answer)
        return instance
    
    def update(self, instance, validated_data):
        questions = validated_data.pop('questions', [])
        course = validated_data.pop('course', None)
        if course is not None:
            try:
                course = Course.objects.get(id=course.get('id'))
            except Course.DoesNotExist as e:
                raise serializers.ValidationError(e)
            instance.course = course
        for question in questions:
            answers = question.pop('answers', [])
            if question.get('id') is None:
                question_obj = Question.objects.create(exam=instance, **question)
            else:
                question_obj = Question.objects.get(id=question.get('id'))
                question_obj.title = question.get('title')
                question_obj.question_type = question.get('question_type')
                question_obj.save()

            for answer in answers:
                if answer.get('id') is None:
                    QuestionAnswer.objects.create(question=question_obj, **answer)
                else:
                    answer_obj = QuestionAnswer.objects.get(id=answer.get('id'))
                    answer_obj.title = answer.get('title')
                    answer_obj.is_correct = answer.get('is_correct', False)
                    answer_obj.save()
        return super().update(instance, validated_data)


class UserCheckBoxAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCheckBoxAnswer
        fields = ('id', 'answer', )


class UserAnswerSerializer(serializers.ModelSerializer):
    check_boxes = UserCheckBoxAnswerSerializer(many=True, required=False)
    id = serializers.IntegerField(required=False)

    class Meta:
        model = UserAnswer
        fields = (
            'id', 'question', 'answer', 'check_boxes', 
            'answer_text', 'additional_file', 'is_correct', 
        )
    
    def get_extra_kwargs(self):
        extra_kwargs = super(UserAnswerSerializer, self).get_extra_kwargs()
        if self.context['view'].action in ['create']:
            kwargs = extra_kwargs.get('is_correct', {})
            kwargs['read_only'] = True
            extra_kwargs['is_correct'] = kwargs
        return extra_kwargs 


class UserExamSerializer(serializers.ModelSerializer):
    user_answers = UserAnswerSerializer(many=True, write_only=True)
    statistic = serializers.SerializerMethodField()

    class Meta:
        model = UserExam
        fields = (
            'id', 'exam', 'email', 'user_answers', 
            'grade', 'checked', 'statistic', 'first_name', 
            'last_name' , 'phone_number'
        )

    def create(self, validated_data):
        user_answers = validated_data.pop('user_answers', [])
        instance = UserExam.objects.create(**validated_data)
        
        # If we dont have Student yet, we can create him here using an email, first, last name and phone number
        # Think about add this method
        if validated_data.get('email'):
            user = get_user_model().objects.filter(email=validated_data.get('email')).first()
            instance.user = user
            instance.save()

        ids = []
        for user_answer in user_answers:
            answers = user_answer.pop('check_boxes', [])

            if user_answer.get('question').id in ids:
                continue
            ids.append(user_answer.get('question').id)
            user_answer_obj = UserAnswer.objects.create(user_exam=instance, **user_answer)

            if answers:
                for answer in answers:
                    UserCheckBoxAnswer.objects.create(parent=user_answer_obj, **answer)
        
        instance.auto_check_exam() 
        return instance
    
    def validate(self, instance):
        if instance.get('exam') and instance.get('email'):
            exam = Exam.objects.filter(id=instance.get('exam').id).first()
            if exam:
                if not exam.is_active:
                    if self.context['request'].user.is_student:
                        raise serializers.ValidationError('This exam is not active')
            if UserExam.objects.filter(exam=instance.get('exam').id, email=instance.get('email')):
                raise serializers.ValidationError('This user already has passed this exam')
        return instance

    def get_statistic(self, obj):
        return obj.get_statistic()

    def update(self, instance, validated_data):
        user_answers = validated_data.pop('user_answers', [])
        for user_answer in user_answers: 
            if user_answer.get('id'):
                user_answer_obj = UserAnswer.objects.get(id=user_answer.get('id'))
                user_answer_obj.is_correct = user_answer.get('is_correct')
                user_answer_obj.save()

        instance.checked = True  # discuss updating this field
        return super().update(instance, validated_data)


class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('first_name', 'last_name')


class UserDetailCheckBoxAnswerSerializer(serializers.ModelSerializer):
    answer = QuestionAnswerSerializer()
    class Meta:
        model = UserCheckBoxAnswer
        fields = ('id', 'answer', )


class UserAnswersDetailSerializer(serializers.ModelSerializer):
    check_boxes = UserDetailCheckBoxAnswerSerializer(many=True, required=False)
    id = serializers.IntegerField(required=False)
    answer = QuestionAnswerSerializer()
    question = ExamQuestionSerializer()

    class Meta:
        model = UserAnswer
        fields = (
            'id', 'question', 'answer', 'check_boxes', 
            'answer_text', 'additional_file', 'is_correct', 
        )


class UserExamDetailSerializer(serializers.ModelSerializer):
    user = UserDetailSerializer()
    user_answers = UserAnswersDetailSerializer(many=True)
    statistic = serializers.SerializerMethodField()

    class Meta:
        model = UserExam
        fields = ('id', 'email', 'grade', 'checked', 'user',
                  'user_answers', 'statistic')

    def get_statistic(self, obj):
        return obj.get_statistic()


class UserExamList(serializers.ModelSerializer):
    user = UserDetailSerializer()

    class Meta:
        model = UserExam
        fields = ('id', 'email', 'grade', 'checked', 'user')


class QuestionAnswerDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionAnswer
        fields = ('id', 'title', 'is_correct', )
        extra_kwargs = {
            'is_correct': {'write_only': True},
        }


class ExamQuestionDetailSerializer(ExamQuestionSerializer):
    answers = QuestionAnswerDetailSerializer(many=True, required=False)


class ExamDetailStudentsSerializer(serializers.ModelSerializer):
    questions = ExamQuestionDetailSerializer(many=True, allow_null=True)
    course = ExamCourseSerializer()
    user_exams = UserExamList(many=True)

    class Meta:
        model = Exam
        fields = (
            'id', 'title', 'exam_type', 'questions', 
            'course', 'user_exams', 'is_active', 'time_duration'
        )


class ExamDetailSerializer(ExamDetailStudentsSerializer):
    questions = ExamQuestionSerializer(many=True, allow_null=True)