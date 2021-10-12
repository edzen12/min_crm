import React from "react";
import DashBoard from "../../../layouts/Dashboard/Dashboard";
import { Row } from "reactstrap";
import { useState } from "react";
import { TextField } from "@material-ui/core";
import { Autocomplete } from "formik-material-ui-lab";
import MuiTextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useToasts } from "react-toast-notifications";
import { useEffect } from "react";
import {
  fetchUsers,
  fetchCourses,
  setBreadcrumbs,
  fetchBranches,
} from "../../../redux/actions";
import Loader from "../../../components/UI/Loader/Loader";
import { Form, Formik, Field } from "formik";
import FormikControl from "../../../components/FormikControl";
import FormikErrorFocus from "formik-error-focus";
import axios from "../../../axios/configuratedAxios";
import { useDispatch, useSelector } from "react-redux";

export default function EditKlass(props) {
  const [fetchedKlassData, setFetchedKlassData] = useState(null);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { addToast } = useToasts();

  const bases = [
    {
      id: 0,
      label: '9-класс',
      value: 9
    },
    {
      id: 1,
      label: '10-класс',
      value: 10
    },
    {
      id: 2,
      label: '11-класс',
      value: 11
    }
  ]

  let klassId = props.match.params.id;
  async function fetchKlassDetail() {
    try {
      const response = await axios.get(`/klasses/${klassId}/`);
      setFetchedKlassData(response.data);
    } catch (error) {
      addToast("Что-то пошло не так!", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  }

  useEffect(() => {
    fetchKlassDetail();

    dispatch(
      setBreadcrumbs([
        { title: "Классы", to: "/klasses" },
        { title: "Редактировать класс", to: "" },
      ])
    );
    dispatch(fetchUsers("users/trainers", "trainers"));
    dispatch(fetchUsers("users/students", "students"));
    dispatch(fetchCourses("courses/"));
    dispatch(fetchBranches());
  }, []);

  const initialValues = {
    klass_id: fetchedKlassData && fetchedKlassData.klass_id,
    classroom_link: fetchedKlassData && fetchedKlassData.classroom_link,
    course: fetchedKlassData && {
      id: fetchedKlassData.course.id,
      value: fetchedKlassData.course.id,
      label: fetchedKlassData.course.title,
    },
    students:
      fetchedKlassData &&
      fetchedKlassData.students.map((student) => ({
        id: student.id,
        value: student.id,
        fullName: `${student.user.first_name} ${student.user.last_name}`,
      })),
    trainers:
      fetchedKlassData &&
      fetchedKlassData.trainers.map((trainer) => ({
        id: trainer.id,
        value: trainer.id,
        fullName: `${trainer.user.first_name} ${trainer.user.last_name}`,
      })),
    branch: fetchedKlassData && fetchedKlassData.branch,
    base: fetchedKlassData && fetchedKlassData.base
  };

  const dispatchedBranches = useSelector(
    (state) => state.branches.branches.data && state.branches.branches.data
  );

  const branches = dispatchedBranches
    ? (dispatchedBranches.results || []).map((branch) => ({
        id: branch.id,
        value: branch.id,
        label: branch.name,
      }))
    : [];

  const dispatchedTrainers = useSelector(
    (state) => state.getUsers.trainers.data && state.getUsers.trainers.data
  );

  const trainers = dispatchedTrainers
    ? (dispatchedTrainers.results || []).map((trainer) => ({
        id: trainer.id,
        value: trainer.id,
        fullName: `${trainer.user.first_name} ${trainer.user.last_name}`,
      }))
    : [];

  const dispatchedStudents = useSelector(
    (state) => state.getUsers.students.data && state.getUsers.students.data
  );

  const students = dispatchedStudents
    ? (dispatchedStudents.results || []).map((student) => ({
        id: student.id,
        value: student.id,
        fullName: `${student.user.first_name} ${student.user.last_name}`,
      }))
    : [];

  const dispatchedCourses = useSelector((state) => state.courses.courses.data);

  const course = dispatchedCourses
    ? (dispatchedCourses.results || []).map((course) => ({
        id: course.id,
        value: course.id,
        label: course.title,
      }))
    : [];

  async function putKlass(formData, resetForm) {
    try {
      const response = await axios.put(`/klasses/${klassId}/`, formData);
      addToast("Класс обновлен!", {
        appearance: "success",
        autoDismiss: true,
      });
      resetForm()
      setTimeout(() => {
        window.location = `/klasses`;
      }, 1000);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      addToast("Что-то пошло не так!", {
        appearance: "error",
        autoDismiss: true,
      });
      console.log(error);
    }
  }

  let formData = new FormData();

  const onSubmit = (values, { resetForm }) => {
    setLoading(true);
    values.classroom_link &&
      formData.append("classroom_link", values.classroom_link);
    values.course &&
      formData.append(
        "course",
        typeof values.course == "number" ? values.course : values.course.id
      );
    students.length &&
      values.students.forEach((student) => {
        formData.append("students", student.id);
      });
    trainers.length &&
      values.trainers.forEach((tag) => formData.append("trainers", tag.id));
    values.branch && formData.append('branch', values.branch);
    values.base && formData.append('base', values.base);
    
    putKlass(formData, resetForm);
  };

  return (
    <DashBoard>
      <div>
        <Row>
          <div className="col-12">
            <div className="card">
              <div style={{ minHeight: "80vh" }} className="card-body">
                <h4 className="card-title">Редактировать класс</h4>
                {loading && <Loader />}
                {fetchedKlassData ? (
                  <Formik initialValues={initialValues} onSubmit={onSubmit}>
                    {({
                      values,
                      errors,
                      isSubmitting,
                      touched,
                      handleChange,
                    }) => {
                      return (
                        <Form className="mt-4">
                          <FormikControl
                            control="input"
                            type="text"
                            label="ID Класса"
                            placeholder="ID Класса"
                            disabled
                            name="klass_id"
                            fullwidth="true"
                            style={{ margin: 4 }}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            variant="outlined"
                            as={TextField}
                          />

                          <FormikControl
                            control="input"
                            type="text"
                            label="Ссылка на Google Classroom"
                            placeholder="Ссылка на Google Classroom"
                            name="classroom_link"
                            fullwidth="true"
                            className="mt-4"
                            style={{ margin: 4 }}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            variant="outlined"
                            as={TextField}
                          />

                          {course ? (
                            <FormikControl
                              control="select"
                              component={TextField}
                              type="text"
                              name="course"
                              label="Выберите курсы"
                              placeholder="Выберите курсы"
                              select
                              defaultValue={
                                initialValues ? initialValues.course.id : null
                              }
                              variant="outlined"
                              displayEmpty
                              fullwidth="true"
                              className="mt-4"
                              style={{ margin: 4 }}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              options={course}
                              handleChange={handleChange}
                            />
                          ) : (
                            <p>loading...</p>
                          )}

                          {trainers ? (
                            <Field
                              name="trainers"
                              multiple
                              component={Autocomplete}
                              options={trainers}
                              style={{ width: "99%" }}
                              getOptionLabel={(option) =>
                                option.fullName ? option.fullName : ""
                              }
                              renderInput={(params) => (
                                <MuiTextField
                                  {...params}
                                  error={
                                    touched["trainers"] && !!errors["trainers"]
                                  }
                                  helperText={
                                    touched["trainers"] && errors["trainers"]
                                  }
                                  label="Выберите тренеров"
                                  variant="outlined"
                                  style={{ margin: 4 }}
                                  className="mt-4"
                                />
                              )}
                            />
                          ) : (
                            <p>loading ...</p>
                          )}

                          {students ? (
                            <Field
                              name="students"
                              multiple
                              component={Autocomplete}
                              options={students}
                              // options={students.filter(student => initialValues.students.findIndex(classStudent => classStudent.id == student.id) == -1)}
                              style={{ width: "99%" }}
                              getOptionLabel={(option) =>
                                option.fullName ? option.fullName : ""
                              }
                              renderInput={(params) => (
                                <MuiTextField
                                  {...params}
                                  error={
                                    touched["students"] && !!errors["students"]
                                  }
                                  helperText={
                                    touched["students"] && errors["students"]
                                  }
                                  label="Выберите студентов"
                                  variant="outlined"
                                  style={{ margin: 4 }}
                                  className="mt-4"
                                />
                              )}
                            />
                          ) : (
                            <p>loading ...</p>
                          )}

                          <FormikControl
                            control="select"
                            component={TextField}
                            type="text"
                            name="base"
                            label="Выберите класс"
                            placeholder="Выберите класс"
                            select
                            defaultValue={values ? values.base : null}
                            displayEmpty
                            fullwidth="true"
                            className="mt-5"
                            style={{ margin: 4 }}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            options={bases}
                            handleChange={handleChange}
                          />

                          {branches ? (
                            <FormikControl
                            control="select"
                            component={TextField}
                            type="text"
                            name="branch"
                            label="Выберите филиал"
                            placeholder="Выберите филиал"
                            select
                            defaultValue={values ? values.branch : null}
                            displayEmpty
                            fullwidth="true"
                            className="mt-5"
                            style={{ margin: 4 }}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            options={branches}
                            handleChange={handleChange}
                          />) : (
                            <p>loading...</p>
                          )}

                          <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            className="mt-4"
                            style={{ margin: 4 }}
                          >
                            Изменить
                          </Button>

                          <FormikErrorFocus
                            offset={0}
                            align={"top"}
                            focusDelay={100}
                            ease={"linear"}
                            duration={700}
                          />

                          {/* <pre className="mt-5">{JSON.stringify(values, null, 2)}</pre>
                          <pre>{JSON.stringify(errors, null, 2)}</pre> */}
                        </Form>
                      );
                    }}
                  </Formik>
                ) : (
                  <Loader />
                )}
              </div>
            </div>
          </div>
        </Row>
      </div>
    </DashBoard>
  );
}
