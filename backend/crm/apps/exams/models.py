from django.contrib.auth import get_user_model
from django.db import models
from django.db.models import Q

from utils.validators import phone_number_regex

from apps.courses.models import Course


class Exam(models.Model):
    ENTRANCE = "E"
    MIDTERM = "M"
    FINAL = "F"

    EXAMS_TYPE_CHOICES = (
        (ENTRANCE, "Entrance"),
        (MIDTERM, "Midterm"),
        (FINAL, "Final"),
    )

    is_active = models.BooleanField(default=False)
    course = models.ForeignKey(Course, related_name='exams', on_delete=models.CASCADE, null=True, blank=True)
    title = models.CharField(max_length=64)  # if in future, we will have searching exams, need to add "db_index"
    exam_type = models.CharField(max_length=16, choices=EXAMS_TYPE_CHOICES)
    time_duration = models.IntegerField(null=True, blank=True)

    class Meta:
        verbose_name = 'Экзамен'
        verbose_name_plural = 'ЭКЗАМЕНЫ'
        ordering = ('-id',)

    def __str__(self):
        return f"{self.get_exam_type_display()}: {self.title}"


class Question(models.Model):
    RADIO_BUTTON = "R"
    CHECK_BOX = "C"
    SHORT_TEXT = "ST"
    LONG_TEXT = "LT"
    FILE_FIELD = "F"
    SCALE = "S"
    DATE = "D"
    TIME = "T"

    QUESTION_TYPE_CHOICES = (
        (RADIO_BUTTON, "radio button"),
        (CHECK_BOX, "check box"),
        (SHORT_TEXT, "short text"),
        (LONG_TEXT, "long text"),
        (FILE_FIELD, "file field"),
        (SCALE, "scale"),
        (DATE, "date"),
        (TIME, "time"),
    )

    title = models.TextField('Вопрос')
    attachment_file = models.FileField(upload_to="exams/questions/", null=True, blank=True)
    question_type = models.CharField(max_length=16, choices=QUESTION_TYPE_CHOICES)
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name="questions", null=True, blank=True)

    class Meta:
        verbose_name = 'ВОПРОС'
        verbose_name_plural = 'ВОПРОСЫ'
        ordering = ('-id',)

    def __str__(self):
        return self.title


class QuestionAnswer(models.Model):
    question = models.ForeignKey(Question, related_name="answers", on_delete=models.CASCADE)
    title = models.CharField(max_length=1024, null=True, blank=True)
    is_correct = models.BooleanField(default=False)

    class Meta:
        verbose_name = 'ОТВЕТ НА ЭКЗАМЕН'
        verbose_name_plural = 'ОТВЕТЫ НА ЭКЗАМЕН'
        ordering = ('-id',)

    def __str__(self):
        return f"{self.question.title} {self.title}: {self.is_correct}"  # in admin panel will be "n + 1 problem"


class UserExam(models.Model):
    exam = models.ForeignKey(Exam, on_delete=models.SET_NULL, related_name="user_exams", null=True, blank=True)
    email = models.EmailField(max_length=128)
    grade = models.PositiveIntegerField(null=True, blank=True)
    checked = models.BooleanField(default=False)
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name="exams", null=True, blank=True)
    first_name = models.CharField(max_length=128, null=True, blank=True)
    last_name = models.CharField(max_length=128, null=True, blank=True)
    phone_number = models.CharField(max_length=13, validators=[phone_number_regex], null=True, blank=True)

    class Meta:
        verbose_name = 'ПОЛЬЗОВАТЕЛЬСКИЙ ЭКЗАМЕН'
        verbose_name_plural = 'ПОЛЬЗОВАТЕЛЬСКИЕ ЭКЗАМЕНЫ'
        ordering = ('-id',)

    def __str__(self):
        return f"{self.email}'s {self.exam}"  # same "n + 1"

    # This method does not make grade
    def auto_check_exam(self) -> None:
        answers = self.user_answers.filter(
            Q(question__question_type=Question.CHECK_BOX) | Q(question__question_type=Question.RADIO_BUTTON))
        for answer in answers:
            if answer.question.question_type == Question.CHECK_BOX:
                answer.check_box_answer()
            elif answer.question.question_type == Question.RADIO_BUTTON:
                answer.check_radio_answer()
            else:
                continue
        return

    def get_statistic(self) -> dict:
        correct = self.user_answers.filter(is_correct=True).count()
        total_questions = self.exam.questions.count()
        uncorrect = total_questions - correct

        return {
            "correct": correct,
            "total_questions": total_questions,
            "uncorrect": uncorrect
        }


class UserAnswer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="user_answers")
    user_exam = models.ForeignKey(UserExam, on_delete=models.CASCADE, related_name="user_answers")
    answer = models.ForeignKey(QuestionAnswer, on_delete=models.CASCADE, related_name="user_answers", null=True,
                               blank=True)
    is_correct = models.BooleanField(default=False)
    answer_text = models.TextField(null=True, blank=True)
    additional_file = models.FileField(upload_to="exams/answers/", null=True, blank=True)

    class Meta:
        verbose_name = 'ОТВЕТ ПОЛЬЗОВАТЕЛЯ'
        verbose_name_plural = 'ОТВЕТЫ ПОЛЬЗОВАТЕЛЕЙ'
        ordering = ('-id',)

    def __str__(self):
        return f"{self.user_exam.email} {self.question.title} {self.id}"

    def check_radio_answer(self):
        self.is_correct = self.question.answers.get(is_correct=True) == self.answer
        self.save()
        return self.is_correct

    def check_box_answer(self):
        self.is_correct = self.check_boxes.filter(answer__is_correct=True).count() == self.question.answers.filter(
            is_correct=True).count()
        self.save()
        return self.is_correct


class UserCheckBoxAnswer(models.Model):
    parent = models.ForeignKey(UserAnswer, on_delete=models.CASCADE, related_name="check_boxes")
    answer = models.ForeignKey(QuestionAnswer, on_delete=models.CASCADE, related_name="check_boxes")

    class Meta:
        verbose_name = 'ОТВЕТ ФЛАЖКА ПОЛЬЗОВАТЕЛЯ'
        verbose_name_plural = 'ОТВЕТЫ НА ФЛАЖКИ ПОЛЬЗОВАТЕЛЯ'
        ordering = ('-id',)

    def __str__(self):
        return self.answer.title
