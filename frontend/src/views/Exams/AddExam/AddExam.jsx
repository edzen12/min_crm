import React, { useState, useEffect } from "react";
import DashBoard from "../../../layouts/Dashboard/Dashboard";
import { Row } from "reactstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import FormikControl from "../../../components/FormikControl";
import { TextField, withStyles, FormGroup, MenuItem } from "@material-ui/core";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import styles from "./AddExam.module.css";
import { green } from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import TextError from "../../../components/TextError";
import EditingQuestion from "../EditingQuestion";
import Question from "../Question";
import axios from "../../../axios/configuratedAxios";
import FormikErrorFocus from "formik-error-focus";
import { useToasts } from "react-toast-notifications";
import Loader from "../../../components/UI/Loader/Loader";
import {clearBreadcrumbs, fetchCourses} from "../../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const initialValues = {
  title: "",
  exam_type: "M",
  course: null,
  time_duration: 0,
  questions: [
    {
      title: "Вопрос 1",
      question_type: "ST",
      answers: [],
    },
  ],
};

const validationSchema = Yup.object({
  title: Yup.string().required("Это обязательное поле!"),
  time_duration: Yup.string().required("Это обязательное поле!"),
});

const exam_type_options = [
  {
    id: 0,
    label: "Входной",
    value: "E",
  },
  {
    id: 1,
    label: "Промежуточный экзамен",
    value: "M",
  },
  {
    id: 2,
    label: "Финальный экзамен",
    value: "F",
  },
];

const questionTypeOptions = [
  {
    id: 0,
    label: "Один из списка",
    value: "R",
  },
  {
    id: 1,
    label: "Несколько из списка",
    value: "C",
  },
  {
    id: 2,
    label: "Текст (строка)",
    value: "ST",
  },
  {
    id: 3,
    label: "Текст (абзац)",
    value: "LT",
  },
  // {
  //   id: 4,
  //   label: "Загрузка файлов",
  //   value: "F",
  // },
  // {
  //   id: 5,
  //   label: "Scale",
  //   value: "S",
  // },
  // {
  //   id: 6,
  //   label: "Дата",
  //   value: "D",
  // },
  // {
  //   id: 7,
  //   label: "Time",
  //   value: "T",
  // },
];

const themestyles = (theme) => ({
  addButton: {
    position: "absolute",
    bottom: theme.spacing(4) * 10,
    right: theme.spacing(2) * 3,
    width: "40px",
    height: "40px",
  },
});

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

const AddExam = (props) => {
  const [editingQuestion, setEditingQuestion] = useState(0);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { addToast } = useToasts();

  useEffect(() => {
    dispatch(clearBreadcrumbs())
    dispatch(fetchCourses("/courses"));
  }, []);

  const dispatchedCourses = useSelector(
    (state) => state.courses.courses.data
  );
  const courses = dispatchedCourses
    ? (dispatchedCourses.results || []).map((course) => ({
        id: course.id,
        value: {
          id: course.id,
          title: course.title
        },
        label: course.title,
      }))
    : [];

  const history = useHistory();

  const createExam = async (data) => {
    try {
      const response = await axios.post("examinations/exams/", data);
      addToast("Экзамен добавлен!", {
        appearance: "success",
        autoDismiss: true,
      });
      setLoading(false);
      return response.data.id;
    } catch (error) {
      setLoading(false);
      addToast("Что-то пошло не так!", {
        appearance: "error",
        autoDismiss: true,
      });
      return null;
    }
  };

  const onSubmit = async (values, actions) => {
    setLoading(true);
    const examId = await createExam(values);
    actions.resetForm();
    if (examId) {
      setTimeout(() => {
        history.push(`/exams`);
      }, 1000);
    }
  };

  return (
    <>
      <DashBoard>
        {loading && <Loader />}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({
            values,
            errors,
            isSubmiting,
            touched,
            handleChange,
            resetForm,
            setFieldValue,
          }) => (
            <Form>
              <div style={{ height: "100vh" }}>
                <Row>
                  <div className="col-12">
                    <div
                      className="card"
                      style={{
                        borderTop: "10px solid #673AB7",
                        borderLeft: "7px solid #4285F4",
                      }}
                    >
                      <div className="card-body">
                        <h4 className="card-title">Создать Экзамен</h4>
                        <FormikControl
                          control="input"
                          type="text"
                          label="Название"
                          placeholder="Название"
                          name="title"
                          fullwidth="true"
                          style={{ margin: 4 }}
                          as={TextField}
                        />

                        <FormikControl
                          control="select"
                          component={TextField}
                          type="text"
                          name="exam_type"
                          label="Тип экзамена"
                          placeholder="Тип экзамена"
                          select
                          fullwidth="true"
                          className="mt-5"
                          value={values.exam_type ? values.exam_type : "M"}
                          style={{ margin: 4 }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          options={exam_type_options}
                          handleChange={handleChange}
                        />

                        {courses ? (
                          <FormikControl
                            control="select"
                            component={TextField}
                            type="text"
                            name="course"
                            label="Выберите курс"
                            placeholder="Выберите курс"
                            select
                            displayEmpty
                            fullwidth="true"
                            className="mt-5"
                            style={{ margin: 4 }}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            options={courses}
                            handleChange={handleChange}
                          />
                        ) : (
                          <p>loading...</p>
                        )}

                        <FormikControl
                          control="input"
                          type="text"
                          label="Выделенное время на экзмен (в минутах)"
                          placeholder="Укажите кол-во минут"
                          name="time_duration"
                          fullwidth="true"
                          style={{ margin: 4 }}
                          className="mt-5"
                          as={TextField}
                        />

                      </div>
                    </div>
                  </div>
                </Row>

                <Row className="mt-4 justify-content-center">
                  {values.questions.map((_, index) =>
                    editingQuestion === index ? (
                      <EditingQuestion
                        setFieldValue={setFieldValue}
                        questionTypeOptions={questionTypeOptions}
                        values={values}
                        handleChange={handleChange}
                        key={index}
                        index={index}
                        setEditingQuestion={setEditingQuestion}
                        orderNumber={index + 1}
                      />
                    ) : (
                      <Question
                        setFieldValue={setFieldValue}
                        questionTypeOptions={questionTypeOptions}
                        values={values}
                        handleChange={handleChange}
                        key={index}
                        index={index}
                        setEditingQuestion={setEditingQuestion}
                        orderNumber={index + 1}
                      />
                    )
                  )}
                  {props.question}
                </Row>
                <Fab
                  color="primary"
                  className={styles.addBtn}
                  onClick={() => {
                    setFieldValue("questions", [
                      ...values.questions,
                      {
                        title: `Вопрос ${values.questions.length + 1}`,
                        question_type: "ST",
                        answers: [],
                      },
                    ]);
                    setEditingQuestion(values.questions.length);
                  }}
                  // className={classes.addButton}
                >
                  <AddIcon />
                </Fab>
                {values.questions.length >= 1 ? (
                  <AddButton
                    color="primary"
                    variant="contained"
                    type="submit"
                    className="mr-3 mb-3"
                  >
                    Создать экзамен
                  </AddButton>
                ) : null}

                {/* <pre>
                  {JSON.stringify(values, 0, 2)}
                </pre> */}

                <FormikErrorFocus
                  offset={0}
                  align={"top"}
                  focusDelay={100}
                  ease={"linear"}
                  duration={700}
                />
              </div>
            </Form>
          )}
        </Formik>
      </DashBoard>
    </>
  );
};

export default withStyles(themestyles, { name: "AddExam" })(AddExam);
