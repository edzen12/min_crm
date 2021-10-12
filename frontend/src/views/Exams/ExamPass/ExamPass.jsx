import React, { useEffect, useRef, useState } from "react";
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
import Countdown from "react-countdown";
import FormikErrorFocus from 'formik-error-focus';
import {setBreadcrumbs} from "../../../redux/actions";
import {useDispatch, useSelector} from "react-redux";
import { useHistory } from "react-router-dom";

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

export default function ExamPass(props) {
  const [examData, setExamData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToasts();
  const classes = useStyles();
  const userData = useSelector((state) => state.personalData.userData.data);
  const [isFinished, setFinished] = useState(false);
  const formikValues = useRef(null);

  let examId = props.match.params.id;
  const [initialValues, setInitialValues] = useState({
    email: "",
    exam: examId,
  });

  const fetchExamDetailData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`examinations/exams/${examId}`);
      setLoading(false);
      setInitialValues({
        ...initialValues,
        time_duration: response.data.time_duration,
        user_answers: response.data.questions.reverse().map((question) => ({
          question: question.id,
          answer: null,
          check_boxes: [],
          answer_text: "",
        })),
      });
      setExamData({
        ...response.data,
        questions: response.data.questions,
      });
    } catch (error) {
      console.log(error.response);
    }
  };

  if(userData && !initialValues.email){setInitialValues({...initialValues, email: userData.email})}

  const dispatch = useDispatch();

  useEffect(() => {
    fetchExamDetailData();
    // return () => {
    //   if(!isFinished){
    //     onSubmit(formikValues.current.values);
    //   }
    // }
  }, []);

  useEffect(() => {
    examData && dispatch(setBreadcrumbs(
      [
        {title: "Экзамены", to: "/exams"},
        {title: examData.title, to: ""},
      ]
    ))
  }, [examData]);

  const history = useHistory();
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Неверный формат, введите валидный email")
      .required("Обязательное поле!")
  });


  const passExam = async (data) => {
    try {
      setLoading(true);
      await axios.post(`examinations/user-exams/`, data);
      addToast("Экзамен отправлен на проверку!", {
        appearance: "success",
        autoDismiss: true,
      });
      setTimeout(()=>{
          history.push(`/exams`)
        }, 1000);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      addToast("Пользователь с данной почтой уже прошел экзамен!", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  const onSubmit = (values) => {
    const formatData = {
      ...values,
      // questions
    }
    passExam(values);
  };

  const finishRenderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      setFinished(true);
      onSubmit(formikValues.current.values);
    } else {
      // Render a countdown
      return (
        <span className="position-fixed d-flex" style={{ right: "100px" }}>
          Оставшееся время: {hours}:{minutes}:{seconds}
        </span>
      );
    }
  };

  return (
      <div style={{padding: 100}}>
      {loading && <Loader />}

      {
        initialValues.time_duration ? (<Countdown renderer={finishRenderer} date={Date.now() + initialValues.time_duration * 60000} />) : null
      }

      {examData && (
        <>
          <Typography variant="h4" className="mb-3">
            {examData.title}
          </Typography>

          <Formik
            innerRef={formikValues} 
            initialValues={initialValues} 
            onSubmit={onSubmit} 
            validationSchema={validationSchema}
          >
            {({ values, handleChange, setFieldValue }) => (
              <Form>
              <FormikControl
                control="input"
                type="text"
                placeholder="*Ваш email"
                name={`email`}
                disabled={true}
                fullwidth="true"
                style={{ margin: 4 }}
                as={TextField}
              />
              <div className="mt-4"></div>
                <Grid container spacing={3}>
                  {examData.questions.map((question, questionIndex) => (
                    <Grid item xs={12} key={questionIndex}>
                      <Paper className={classes.paper}>
                        {/* <Typography variant="body1">{}</Typography> */}
                        <Typography variant="h6">{`${questionIndex + 1}) ${
                          question.title
                        }`}</Typography>
                        {question.question_type === "C" ? (
                          <div>
                            <FormControl
                              component="fieldset"
                              className="d-block"
                            >
                              {question.answers.map((answer, answerIndex) => (
                                <div
                                  className="align-items-center d-flex mt-3 w-100"
                                  key={answerIndex}
                                >
                                  <Checkbox
                                    color="primary"
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setFieldValue(
                                          `user_answers[${questionIndex}].check_boxes`,
                                          values.user_answers[
                                            questionIndex
                                          ].check_boxes.concat([
                                            { answer: answer.id },
                                          ])
                                        );
                                      } else {
                                        setFieldValue(
                                          `user_answers[${questionIndex}].check_boxes`,
                                          values.user_answers[
                                            questionIndex
                                          ].check_boxes.filter(
                                            (checkBoxAnswer) =>
                                              checkBoxAnswer.answer.id !==
                                              answer.id
                                          )
                                        );
                                      }
                                    }}
                                    // checked={}
                                  />
                                  <Typography variant="body2">
                                    {answer.title}
                                  </Typography>
                                </div>
                              ))}
                            </FormControl>
                          </div>
                        ) : question.question_type === "R" ? (
                          <div className="mt-4 d-flex-column">
                            {question.answers.map((answer, answerIndex) => (
                              <div
                                className="align-items-center d-flex mt-3 w-100"
                                key={answerIndex}
                              >
                                <Radio
                                  type="radio"
                                  color="primary"
                                  onClick={() => {
                                    setFieldValue(
                                      `user_answers[${questionIndex}].answer`,
                                      answer.id
                                    );
                                  }}
                                  checked={
                                    values.user_answers[questionIndex]
                                      .answer === answer.id
                                  }
                                />
                                <Typography variant="body2">
                                  {answer.title}
                                </Typography>
                              </div>
                            ))}
                          </div>
                        ) : question.question_type === "ST" ? (
                          <FormikControl
                            control="input"
                            type="text"
                            placeholder="Ваш ответ"
                            name={`user_answers[${questionIndex}].answer_text`}
                            fullwidth="true"
                            className="mt-4"
                            style={{ margin: 4 }}
                            as={TextField}
                          />
                        ) : question.question_type === "LT" ? (
                          <FormikControl
                            control="input"
                            type="text"
                            placeholder="Ваш ответ"
                            name={`user_answers[${questionIndex}].answer_text`}
                            fullwidth="true"
                            className="mt-4"
                            multiline
                            rows={6}
                            style={{ margin: 4 }}
                            as={TextField}
                          />
                        ) : null}
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
                <AddButton
                  color="primary"
                  variant="contained"
                  type="submit"
                  className="mr-3 mb-3 mt-4"
                >
                  Завершить
                </AddButton>

                <FormikErrorFocus
                  offset={0}
                  align={'top'}
                  focusDelay={100}
                  ease={'linear'}
                  duration={700}
                />

                {/* <pre>{JSON.stringify(values, 0, 2)}</pre> */}
              </Form>
            )}
          </Formik>
        </>
      )}
      </div>
  );
}
