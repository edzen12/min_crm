import React, { useState, useEffect } from "react";
import DashBoard from "../../../layouts/Dashboard/Dashboard";
import { Row } from "reactstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import FormikControl from "../../../components/FormikControl";
import { TextField, withStyles, FormGroup, MenuItem, IconButton, Switch, FormLabel } from "@material-ui/core";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import styles from "../AddExam/AddExam.module.css";
import { green } from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import DeleteIcon from '@material-ui/icons/Delete';
import EditingQuestion from "../EditingQuestion";
import Question from "../Question";
import axios from "../../../axios/configuratedAxios";
import Loader from "../../../components/UI/Loader/Loader";
import { useConfirm } from "material-ui-confirm";
import { useToasts } from "react-toast-notifications";
import { useDispatch, useSelector } from "react-redux";
import {fetchCourses, setBreadcrumbs} from "../../../redux/actions";

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
  {
    id: 4,
    label: "Загрузка файлов",
    value: "F",
  },
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

const ExamEdit = (props) => {
  const [editingQuestion, setEditingQuestion] = useState(0);
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  let examId = props.match.params.id;

  const fetchExamDetailData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`examinations/exams/${examId}`);
      setLoading(false);
      setInitialValues({ ...response.data, course: response.data.course.id, questions: response.data.questions.reverse(), is_active: response.data.is_active });
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    fetchExamDetailData();
    dispatch(fetchCourses("/courses"));
  }, []);
  useEffect(() => {
    initialValues && dispatch(setBreadcrumbs(
      [
        {title: "Экзамены", to: "/exams"},
        {title: initialValues.title, to: ""},
      ]
    ))
  }, [initialValues]);

  const dispatchedCourses = useSelector(
    (state) => state.courses.courses.data
  );

  const courses = dispatchedCourses
    ? (dispatchedCourses.results || []).map((course) => ({
        id: course.id,
        label: course.title,
        value: course.id
      }))
    : [];

  const putExam = async (data) => {
    try {
      const response = await axios.put(`examinations/exams/${examId}/`, {
        ...data, course: {
          id: data.course
        }
      });
      addToast("Экзамен изменен!", {
        appearance: "success",
        autoDismiss: true
      })
      setTimeout(()=>{
          window.location = `/exams`
        }, 1000);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      addToast("Что-то пошло не так!", {
        appearance: "error",
        autoDismiss: true
      })
    }
  }

  const onSubmit = (values, actions) => {
    setLoading(true);
    putExam(values);
  };

  async function deleteExam() {
    setLoading(true);
    try {
      await axios.delete(`/examinations/exams/${examId}/`);
      setLoading(false);
      props.history.push("/exams");
    } catch (error) {
      console.log(error);
    }
  }

  const confirm = useConfirm();
  const handleDeleteExam = (e) => {
    e.preventDefault();
    confirm({
      description: `Удалить экзамен ${initialValues.title}?`,
    })
      .then(() => deleteExam())
      .catch(() => {
        /* ... */
      });
  };

  return (
    <>
      <DashBoard>
        {loading && <Loader />}
        {initialValues && (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({
              values,
              handleChange,
              setFieldValue,
            }) => (
              <Form style={{marginBottom: 50}}>
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
                          <div style={{display: "flex", justifyContent: "space-between"}}>
                            <h4 className="card-title">Редактировать</h4>
                            <IconButton 
                              aria-label="deleteExam"
                              onClick={(e) => handleDeleteExam(e)}
                              >
                              <DeleteIcon/>
                            </IconButton>
                          </div>
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
                            defaultValue={values.exam_type}
                            style={{ margin: 4 }}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            options={exam_type_options}
                            handleChange={handleChange}
                          />

                          <FormikControl
                            control="select"
                            component={TextField}
                            type="text"
                            name="course"
                            label="Выберите курс"
                            placeholder="Выберите курс"
                            select
                            fullwidth="true"
                            className="mt-5"
                            defaultValue={values.course}
                            style={{ margin: 4 }}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            options={courses}
                            handleChange={handleChange}
                          />

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
                          key={`editing-${index}`}
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
                  
                  <FormLabel>
                  Активировать:
                  </FormLabel>

                  <Field 
                    name='is_active'
                    checked={values.is_active} 
                    component={Switch} 
                    color="primary" 
                    onChange={() => setFieldValue('is_active', !values.is_active)}>
                  </Field>

                  {values.questions.length >= 1 ? (
                    <AddButton
                      color="primary"
                      variant="contained"
                      type="submit"
                      className="mr-3 mb-3"
                    >
                      Изменить
                    </AddButton>
                  ) : null}
                </div>
              </Form>
            )}
          </Formik>
        )}
      </DashBoard>
    </>
  );
};

export default withStyles(themestyles, { name: "ExamDetail" })(ExamEdit);
