import React from "react";
import Dashboard from "../../../layouts/Dashboard/Dashboard";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { Row } from "reactstrap";
import FormikControl from "../../../components/FormikControl";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  fetchCourses,
  setBreadcrumbs,
  fetchBranches,
} from "../../../redux/actions";
import { TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import "react-toastify/dist/ReactToastify.css";
import FormikErrorFocus from "formik-error-focus";
import axios from "../../../axios/configuratedAxios";
import Loader from "../../../components/UI/Loader/Loader";
import { useToasts } from "react-toast-notifications";
import MultiSelectSearch from "../../../components/MultiSelectSearch";
import { useHistory } from "react-router-dom";

function AddKlass() {
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);
  const [isFetching, setFetching] = useState({
    trainers: false,
    staffMembers: true,
    students: false,
    course: false,
  });

  const [studentSearchValue, setStudentSearchValue] = useState("");
  const [trainerSearchValue, setTrainerSearchValue] = useState("");
  const [staffSearchValue, setStaffSearchValue] = useState("");
  const [courseSearchValue, setCourseSearchValue] = useState("");

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

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { title: "Классы", to: "/klasses" },
        { title: "Создать класс", to: "" },
      ])
    );

    dispatch(fetchUsers("users/staff-members/", "staffMembers")).then(() =>
      setFetching({
        ...isFetching,
        staffMembers: false,
      })
    );

    dispatch(fetchBranches());
  }, []);

  useEffect(() => {
    setFetching({
      ...isFetching,
      course: true,
    });

    dispatch(fetchCourses(`courses?search=${courseSearchValue}`)).then(() =>
      setFetching({
        ...isFetching,
        course: false,
      })
    );
  }, [courseSearchValue]);

  useEffect(() => {
    setFetching({
      ...isFetching,
      trainers: true,
    });

    dispatch(
      fetchUsers(`users/trainers/?search=${trainerSearchValue}`, "trainers")
    ).then(() =>
      setFetching({
        ...isFetching,
        trainers: false,
      })
    );
  }, [trainerSearchValue]);

  useEffect(() => {
    setFetching({
      ...isFetching,
      students: true,
    });

    dispatch(
      fetchUsers(`users/students/?search=${studentSearchValue}`, "students")
    ).then(() =>
      setFetching({
        ...isFetching,
        students: false,
      })
    );
  }, [studentSearchValue]);

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

  const dispatchedCourses = useSelector((state) => state.courses.courses.data);

  const course = dispatchedCourses
    ? (dispatchedCourses.results || []).map((course) => ({
        id: course.id,
        value: course.id,
        label: course.title,
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

  console.log("dispatchedStudents: ", dispatchedStudents);
  const students = dispatchedStudents
    ? (dispatchedStudents.results || []).map((student) => ({
        id: student.id,
        value: student.id,
        fullName: `${student.user.first_name} ${student.user.last_name}`,
      }))
    : [];

  const { addToast } = useToasts();

  const initialValues = {
    title: "",
    classroom_link: "",
    course: "",
    trainers: [],
    students: [],
    branch: "",
    base: ""
  };

  const validationSchema = Yup.object({
    classroom_link: Yup.string().required("Это обязательное поле!"),
    course: Yup.string().required("Это обязательное поле!"),
  });

  const history = useHistory();

  const createKlass = async (formData, resetForm) => {
    try {
      const response = await axios.post("klasses/", formData);
      setLoading(false);
      addToast("Класс добавлен!", {
        appearance: "success",
        autoDismiss: true,
      });
      resetForm()
      setTimeout(() => {
        history.push(`/klasses`);
      }, 1000);
    } catch (error) {
      setLoading(false);
      addToast("Что-то пошло не так!", {
        appearance: "error",
        autoDismiss: true,
      });
      console.log(error);
    }
  };

  let formData = new FormData();
  const onSubmit = (values, { resetForm }) => {
    setLoading(true);
    values.classroom_link &&
      formData.append("classroom_link", values.classroom_link);
    values.course && formData.append("course", values.course.id);
    students.length &&
      values.students.forEach((student) =>
        formData.append("students", student.id)
      );
    trainers.length &&
      values.trainers.forEach((trainer) =>
        formData.append("trainers", trainer.id)
      );
    values.branch && formData.append("branch", values.branch);
    values.base && formData.append("base", values.base);
    createKlass(formData, resetForm);
  };

  return (
    <Dashboard>
      {isLoading && <Loader />}
      <div>
        <Row>
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <h4 className="card-title">Создать класс</h4>
                </div>
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                >
                  {({
                    values,
                    errors,
                    isSubmitting,
                    touched,
                    handleChange,
                    resetForm,
                    setFieldValue,
                  }) => (
                    <Form className="mt-4">
                      <FormikControl
                        control="input"
                        type="text"
                        label="Ссылка на Google Classroom"
                        placeholder="Ссылка на Google Classroom"
                        name="classroom_link"
                        fullwidth="true"
                        style={{ margin: 4 }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        variant="outlined"
                        as={TextField}
                      />

                      <MultiSelectSearch
                        name="course"
                        options={course}
                        getOptionLabel={(option) =>
                          option.label ? option.label : ""
                        }
                        label="Выберите курс"
                        touched={touched}
                        errors={errors}
                        loading={isFetching.course}
                        onChange={(e) => setCourseSearchValue(e.target.value)}
                        value={courseSearchValue}
                        onBlur={() => setCourseSearchValue("")}
                        multiple={false}
                      />

                      <MultiSelectSearch
                        name="trainers"
                        options={trainers}
                        getOptionLabel={(option) =>
                          option.fullName ? option.fullName : ""
                        }
                        label="Выберите тренеров"
                        touched={touched}
                        errors={errors}
                        loading={isFetching.trainers}
                        onChange={(e) => setTrainerSearchValue(e.target.value)}
                        value={trainerSearchValue}
                        onBlur={() => setTrainerSearchValue("")}
                        multiple={true}
                      />

                      <MultiSelectSearch
                        name="students"
                        options={students}
                        getOptionLabel={(option) =>
                          option.fullName ? option.fullName : ""
                        }
                        label="Выберите студентов"
                        touched={touched}
                        errors={errors}
                        loading={isFetching.students}
                        onChange={(e) => setStudentSearchValue(e.target.value)}
                        value={studentSearchValue}
                        onBlur={() => setStudentSearchValue("")}
                        multiple={true}
                      />

                      <FormikControl
                        control="select"
                        component={TextField}
                        type="text"
                        name="base"
                        label="Выберите класс"
                        placeholder="Выберите класс"
                        select
                        variant="outlined"
                        displayEmpty
                        fullwidth="true"
                        className="mt-4"
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
                          displayEmpty
                          fullwidth="true"
                          className="mt-5"
                          style={{ margin: 4 }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          options={branches}
                          handleChange={handleChange}
                        />
                      ) : (
                        <p>loading...</p>
                      )}

                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        className="mt-4"
                        style={{ margin: 4 }}
                      >
                        Создать
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
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </Row>
      </div>
    </Dashboard>
  );
}

export default AddKlass;
