import React from "react";
import Dashboard from "../../../layouts/Dashboard/Dashboard";
import { Form, Formik, Field } from "formik";
import * as Yup from "yup";
import { Row } from "reactstrap";
import FormikControl from "../../../components/FormikControl";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBranches, fetchCoursesTags, setBreadcrumbs } from "../../../redux/actions";
import { TextField } from "@material-ui/core";
import { Autocomplete } from "formik-material-ui-lab";
import MuiTextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useToasts } from "react-toast-notifications";
import "react-toastify/dist/ReactToastify.css";
import FormikErrorFocus from "formik-error-focus";
import axios from "../../../axios/configuratedAxios";
import Loader from "../../../components/UI/Loader/Loader";
import ImageDropzone from "../../../components/UI/ImageDropzone/ImageDropzone";

function AddCourse() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { title: "Курсы", to: "/courses" },
        { title: "Добавить курс", to: "" },
      ])
    );
    dispatch(fetchCoursesTags());
    dispatch(fetchBranches());
  }, []);

  const dispatchedTags = useSelector((state) => state.courseCreate.tags.data);
  const tags = dispatchedTags.length
    ? dispatchedTags.map((item) => ({
        id: item.id,
        // value: item.id,
        title: item.title,
      }))
    : [];

  const dispatchedBranches = useSelector(
    (state) =>
      state.branches.branches.data && state.branches.branches.data
  );

  const branches = dispatchedBranches ? (dispatchedBranches.results || []).map(branch => ({
    id: branch.id,
    value: branch.id,
    label: branch.name
  })) : [];

  const { addToast } = useToasts();

  const statuses = [
    {
      id: 0,
      label: "Идет набор",
      value: "E",
    },
    {
      id: 1,
      label: "Открыт",
      value: "O",
    },
    {
      id: 2,
      label: "Завершен",
      value: "C",
    },
  ];

  const initialValues = {
    title: "",
    description: "",
    status: "",
    period: 0,
    program: null,
    image: null,
    price: 0,
    programLink: "",
    tags: [],
    branch: ""
  };

  const validationSchema = Yup.object({
    title: Yup.string().required("Это обязательное поле!"),
    description: Yup.string().required("Это обязательное поле!"),
    status: Yup.string().required("Это обязательное поле!"),
    period: Yup.number().typeError("Введите число"),
    programLink: Yup.string().required("Это обязательное поле!").max(200, 'Количество символов в ссылке не должно превышать 200'),
    price: Yup.number()
      .max(99999, "Число не должно привышать 99999")
      .typeError("Введите число"),
  });

  async function createCourse(formData, resetForm) {
    try {
      const response = await axios.post("courses/", formData);
      addToast("Курс добавлен!", {
        appearance: "success",
        autoDismiss: true,
      });
      setLoading(false);
      resetForm();
    } catch (error) {
      addToast("Что-то пошло не так!", {
        appearance: "error",
        autoDismiss: true,
      });
      setLoading(false);
      console.log(error.response);
    }
  }

  let formData = new FormData();
  const onSubmit = (values, { resetForm }) => {
    values.title && formData.append("title", values.title);
    values.description && formData.append("description", values.description);
    values.status && formData.append("status", values.status);
    values.period && formData.append("period", values.period);
    values.image && formData.append("image", values.image, values.image.name);
    values.price && formData.append("price", values.price);
    values.programLink && formData.append("program_link", values.programLink);
    tags.length &&
      values.tags.forEach((tag) => formData.append("tags", tag.id));
    values.branch && formData.append('branch', values.branch);

    setLoading(true);
    console.log("sendData: ", formData.tags);
    createCourse(formData, resetForm);

    setTimeout(() => {
      window.location = `/courses`;
    }, 1000);
  };

  return (
    <Dashboard>
      <div>
        <Row>
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Создать курс</h4>

                {loading && <Loader />}

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
                    setFieldValue,
                    resetForm,
                  }) => (
                    <Form className="mt-4">
                      <FormikControl
                        control="input"
                        type="text"
                        label="Название курса"
                        placeholder="Название"
                        name="title"
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
                        label="Описание"
                        placeholder="Описание"
                        name="description"
                        fullwidth="true"
                        className="mt-4"
                        style={{ margin: 4 }}
                        multiline
                        rows={8}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        variant="outlined"
                        as={TextField}
                      />

                      <FormikControl
                        control="select"
                        component={TextField}
                        type="text"
                        name="status"
                        label="Выберите статус"
                        placeholder="Выберите статус"
                        select
                        variant="outlined"
                        displayEmpty
                        fullwidth="true"
                        className="mt-4"
                        style={{ margin: 4 }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        options={statuses}
                        handleChange={handleChange}
                      />

                      <FormikControl
                        control="input"
                        type="text"
                        label="Продолжительность курса (кол-во месяцов)"
                        placeholder="Продолжительность курса"
                        name="period"
                        fullwidth="true"
                        className="mt-4"
                        style={{ margin: 4 }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        variant="outlined"
                        as={TextField}
                      />

                      <ImageDropzone
                        text="Изображение"
                        name="image"
                        acceptedFiles={["image/*"]}
                        setFieldValue={setFieldValue}
                      />

                      <FormikControl
                        control="input"
                        type="text"
                        label="Стоимость курса (в USD)"
                        placeholder="Стоимость курса"
                        values
                        name="price"
                        fullwidth="true"
                        className="mt-4"
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
                        label="Ссылка на программу курса"
                        placeholder="Ссылка на программу курса"
                        name="programLink"
                        fullwidth="true"
                        className="mt-4"
                        style={{ margin: 4 }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        variant="outlined"
                        as={TextField}
                      />
                      
                      {tags ? (
                        <Field
                          name="tags"
                          multiple
                          component={Autocomplete}
                          options={tags}
                          style={{ width: "99%" }}
                          getOptionLabel={(option) => option.title}
                          renderInput={(params) => (
                            <MuiTextField
                              {...params}
                              error={touched["tags"] && !!errors["tags"]}
                              helperText={touched["tags"] && errors["tags"]}
                              label="Выберите тэги"
                              variant="outlined"
                              style={{ margin: 4 }}
                              className="mt-4"
                            />
                          )}
                        />
                      ) : (
                        <p>loading ...</p>
                      )}

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
                        color="primary"
                        variant="contained"
                        style={{ margin: 4 }}
                        className="mt-4"
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

                      {/* <pre className="mt-5">
                          {JSON.stringify(values, null, 2)}
                        </pre>
                        <pre>{JSON.stringify(errors, null, 2)}</pre>
                        <pre>{JSON.stringify(tags, null, 2)}</pre> */}
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

export default AddCourse;
