import React, { useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";
import DashBoard from "../../../layouts/Dashboard/Dashboard";
import axios from "../../../axios/configuratedAxios";
import * as Yup from "yup";
import {
  FormControl,
  Grid,
  Paper,
  Typography,
  Radio,
  TextField,
  withStyles,
} from "@material-ui/core";
import { green } from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Loader from "../../../components/UI/Loader/Loader";
import Checkbox from "@material-ui/core/Checkbox";
import { Form, Formik } from "formik";
import FormikControl from "../../../components/FormikControl";
import FormikErrorFocus from 'formik-error-focus';
import {setBreadcrumbs} from "../../../redux/actions";
import {useDispatch, useSelector} from "react-redux";
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "left",
    color: theme.palette.text.primary,
  },
}));

const AddButton = withStyles((theme) => ({
  root: {
    backgroundColor: green[500],
    "&:hover": {
      backgroundColor: green[700],
    },
    marginLeft: "auto",
    marginTop: "auto",
    display: "block",
  },
}))(Button);

export default function ExamResultUser(props) {
  const [examData, setExamData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToasts();
  const classes = useStyles();
  let examId = props.match.params.id;
  const userData = useSelector((state) => state.personalData.userData.data);


  const [initialValues, setInitialValues] = useState(null);

  const fetchExamDetailData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`examinations/user-exams/${examId}`);
      setLoading(false);
      setInitialValues({
        email: response.data.email,
        grade: response.data.grade ? response.data.grade : 0,
        checked: response.data.checked,
        user: {
          first_name: response.data.user.first_name,
          last_name: response.data.user.last_name,
        },
        user_answers: response.data.user_answers.reverse().map((question) => ({
          question: question.id,
          answer: question.answer,
          check_boxes: question.check_boxes,
          answer_text: question.answer,
        })),
      });
      setExamData({
        ...response.data,
        user_answers: response.data.user_answers,
      });
    } catch (error) {
      console.log(error.response);
    }
  };

  const dispatch = useDispatch()
  const examsId = useSelector(state => state.exams.examsResultId)
  useEffect(() => {
    dispatch(setBreadcrumbs(
      [
        {title: "Экзамены", to: "/exams"},
        {title: "Результаты экзаменов", to: `/exams-result/${examsId}`},
        {title: "Подробнее", to: ""},
      ]
    ))
    fetchExamDetailData();
  }, []);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Неверный формат, введите валидный email")
      .required("Обязательное поле!")
  });

  const updateUserExam = async (data) => {
    try {
      setLoading(true);
      const response = await axios.patch(`examinations/user-exams/${examId}`, {
        grade: data.grade,
        checked: data.checked
      });
      setLoading(false);
      addToast("Успешно", {
        appearance: "success",
        autoDismiss: true,
      });
    } catch (error) {
      console.log(error);
    }
  }
  

  const onSubmit = (values) => {
    updateUserExam(values);
  };

  const booleanOptions = [
    {
      id: 0,
      label: 'Да',
      value: true
    },
    {
      id: 1,
      label: 'Нет',
      value: false
    }
  ];

  return (
    <DashBoard>
      {loading && <Loader />}

      {examData && (
        <>
          <Typography variant="h4" className="mb-3">
            {examData.title}
          </Typography>

          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
          >
            {({ values, handleChange, setFieldValue }) => (
              <Form>
                <FormikControl
                  control="input"
                  type="text"
                  label="Email"
                  name={`email`}
                  fullwidth="true"
                  style={{ margin: 4 }}
                  as={TextField}
                  value={values.email}
                  disabled
                />

                <FormikControl
                  control="input"
                  type="text"
                  label="Имя"
                  name={`user.first_name`}
                  fullwidth="true"
                  style={{ margin: 4 }}
                  as={TextField}
                  disabled
                />

                <FormikControl
                  control="input"
                  type="text"
                  label="Фамилия"
                  name={`user.last_name`}
                  fullwidth="true"
                  style={{ margin: 4 }}
                  as={TextField}
                  disabled
                />

                <FormikControl
                  control="input"
                  type="text"
                  label="Баллы"
                  name='grade'
                  fullwidth="true"
                  style={{ margin: 4 }}
                  as={TextField}
                  disabled={userData.is_student}
                />


                <FormikControl
                  control="select"
                  component={TextField}
                  type="text"
                  name='checked'
                  label="Проверено"
                  select
                  fullwidth="true"
                  style={{ marginTop: 25 }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={values.checked}
                  options={booleanOptions}
                  handleChange={handleChange}
                  disabled={userData.is_student}
                />

                  {
                    userData.is_student ? null : (
                      <Button style={{marginTop: 20}} type="submit" color="primary" variant="contained">
                        Сохранить
                      </Button>
                    )
                  }



                <div className="mt-4"></div>
                <Grid container spacing={3}>
                  {examData.user_answers.map((userAnswer, userAnswerIndex) => (
                    <Grid item xs={12} key={userAnswerIndex}>
                      <Paper className={classes.paper}>
                        <Typography variant="h6">{`${userAnswerIndex + 1}) ${
                          userAnswer.question.title
                        }`}</Typography>
                        {userAnswer.question.question_type === "C" ? (
                          <div>
                            <FormControl
                              component="fieldset"
                              className="d-block"
                            >
                              {userAnswer.question.answers.map((answer, answerIndex) => (
                                <div
                                  className="align-items-center d-flex mt-3 w-100"
                                  key={answerIndex}
                                >
                                  <Checkbox
                                    style={{
                                      position: 'relative', 
                                      marginRight: 10,
                                      border: `${answer.is_correct ? '1px dotted green' : ''}`}}
                                    color="primary"
                                    disabled={!((values.user_answers[userAnswerIndex].check_boxes.findIndex(checkBoxAnswer => checkBoxAnswer.answer.id === answer.id)) !== -1)}
                                    checked={
                                      (values.user_answers[userAnswerIndex].check_boxes.findIndex(checkBoxAnswer => checkBoxAnswer.answer.id === answer.id)) !== -1
                                    }
                                  />
                                  <Typography 
                                    
                                    variant="body2">
                                    {answer.title}
                                    <span style={{marginLeft: 10, marginBottom: 3}}>
                                  {
                                    (values.user_answers[userAnswerIndex].check_boxes.findIndex(checkBoxAnswer => checkBoxAnswer.answer.id === answer.id) !== -1) && answer.is_correct
                                     ? <CheckIcon
                                        style={{color: '#4caf50'}}
                                      /> : 
                                  
                                  (values.user_answers[userAnswerIndex].check_boxes.findIndex(checkBoxAnswer => checkBoxAnswer.answer.id === answer.id) !== -1) && !answer.is_correct ? <CloseIcon
                                        style={{color: '#dd2c00'}}
                                      /> :
                                      null}
                                  </span>
                                  </Typography>
                                </div>
                              ))}
                            </FormControl>
                          </div>
                        ) : userAnswer.question.question_type === "R" ? (
                          <div className="mt-4 d-flex-column">
                            {userAnswer.question.answers.map((answer, answerIndex) => (
                              <div
                                className="align-items-center d-flex mt-3 w-100"
                                key={answerIndex}
                              >
                                <Radio
                                  type="radio"
                                  color="primary"
                                  style={{
                                      position: 'relative', 
                                      marginRight: 10,
                                      border: `${answer.is_correct ? '1px dotted green' : ''}`}}
                                  checked={
                                    values.user_answers[userAnswerIndex]?.answer?.id === answer?.id
                                  }
                                  disabled={!(values.user_answers[userAnswerIndex]?.answer?.id === answer?.id)}
                                />
                                <Typography 
                                  variant="body2" 
                                  style={{display: 'flex', alignItems: 'center'}}>
                                  {answer.title}
                                  <span style={{marginLeft: 10, marginBottom: 3}}>
                                  {values.user_answers[userAnswerIndex]?.answer?.id === answer?.id && answer.is_correct ? <CheckIcon
                                        style={{color: '#4caf50'}}
                                      /> : 
                                  
                                  values.user_answers[userAnswerIndex]?.answer?.id === answer?.id && !answer.is_correct ? <CloseIcon
                                        style={{color: '#dd2c00'}}
                                      /> :
                                      null}
                                  </span>
                                </Typography>
                              </div>
                            ))}
                          </div>
                        ) : userAnswer.question.question_type === "ST" ? (
                          <FormikControl
                            control="input"
                            type="text"
                            placeholder="Ваш ответ"
                            name={`user_answers[${userAnswerIndex}].answer_text`}
                            fullwidth="true"
                            className="mt-4"
                            style={{ margin: 4 }}
                            as={TextField}
                            value={userAnswer.answer_text}
                            disabled
                          />
                        ) : userAnswer.question.question_type === "LT" ? (
                          <FormikControl
                            control="input"
                            type="text"
                            placeholder="Ваш ответ"
                            name={`user_answers[${userAnswerIndex}].answer_text`}
                            fullwidth="true"
                            className="mt-4"
                            multiline
                            rows={6}
                            style={{ margin: 4 }}
                            as={TextField}
                            value={userAnswer.answer_text}
                            disabled
                          />
                        ) : null}

                        {
                          (userAnswer.question.question_type !== "LT" && userAnswer.question.question_type !== "ST") ?
                          userAnswer.is_correct ? 
                          <Typography 
                            style={{textAlign: 'right', color: '#4caf50', fontWeight: 600, marginTop: 15}}>
                            Верный ответ
                            </Typography> :

                          <Typography
                            style={{textAlign: 'right', color: '#ff5722', fontWeight: 600, marginTop: 15}}>
                            Неверный ответ
                            </Typography>
                           : null
                        }

                        
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
                {/* <AddButton
                  color="primary"
                  variant="contained"
                  type="submit"
                  className="mr-3 mb-3 mt-4"
                >
                  Завершить
                </AddButton> */}

                <FormikErrorFocus
                  offset={0}
                  align={'top'}
                  focusDelay={100}
                  ease={'linear'}
                  duration={700}
                />
              </Form>
            )}
          </Formik>
        </>
      )}
    </DashBoard>
  );
}
