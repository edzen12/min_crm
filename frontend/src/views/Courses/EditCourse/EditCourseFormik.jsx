import React, { useEffect, useState } from "react";
import { Form, Formik, Field } from "formik";
import FormikControl from "../../../components/FormikControl";
import { useDispatch, useSelector } from "react-redux";
import { fetchBranches, fetchCoursesTags } from "../../../redux/actions";
import { TextField } from "@material-ui/core";
import { Autocomplete } from "formik-material-ui-lab";
import MuiTextField from "@material-ui/core/TextField";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../../../components/UI/Loader/Loader";
import "react-toastify/dist/ReactToastify.css";
import axios from "../../../axios/configuratedAxios";
import { Button } from "@material-ui/core";
import { useToasts } from "react-toast-notifications";
import ImageDropzone from "../../../components/UI/ImageDropzone/ImageDropzone";
import style from "../../Admin/AdminDetail/admin.module.css";
import { useHistory } from "react-router-dom";

function EditCourseFormik(props) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const initialValues = props.fetchedValues;
  const { addToast } = useToasts();

  useEffect(() => {
    dispatch(fetchCoursesTags());
    dispatch(fetchBranches());
  }, []);

  const dispatchedTags = useSelector((state) => state.courseCreate.tags.data);
  const tags = dispatchedTags.length
    ? dispatchedTags.map((item) => ({
        id: item.id,
        value: item.title,
        title: item.title,
      }))
    : [];

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

  const history = useHistory();

  async function putCourse(formData, resetForm) {
    try {
      const response = await axios.put(`/courses/${props.id}/`, formData);
      addToast("Курс обновлен!", {
        appearance: "success",
        autoDismiss: true,
      });
      resetForm()
      setTimeout(() => {
        history.push(`/courseDetail/${props.id}`);
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
    values.title && formData.append("title", values.title);
    values.description && formData.append("description", values.description);
    values.status && formData.append("status", values.status);
    values.period && formData.append("period", values.period);
    values.price && formData.append("price", values.price);
    values.image &&
      typeof values.image !== "string" &&
      formData.append("image", values.image, values.image.name);
    values.program_link && formData.append("program_link", values.program_link);
    values.tags.length &&
      values.tags.forEach((tag) => formData.append("tags", tag.id));
    values.branch && formData.append('branch', values.branch);

    setLoading(true);
    putCourse(formData, resetForm);
  };

  return (
    <>
      {loading && <Loader />}

      {props.fetchedValues ? (
        <Formik initialValues={props.fetchedValues} onSubmit={onSubmit}>
          {({
            values,
            errors,
            isSubmitting,
            touched,
            handleChange,
            setFieldValue,
            setFieldTouched
          }) => {
            return (
              <Form className="mt-4">
                <img
                  className={style.img}
                  src={(() => {
                    try {
                      return touched.image
                        ? URL.createObjectURL(values.image)
                        : values.image || "";
                    } catch (e) {
                      return "";
                    }
                  })()}
                  alt="course-img"
                />

                <ImageDropzone
                  text="Изображение"
                  name="image"
                  acceptedFiles={["image/*"]}
                  setFieldValue={setFieldValue}
                  setFieldTouched={setFieldTouched}
                />

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
                  defaultValue={initialValues ? initialValues.status : null}
                  variant="outlined"
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

                <FormikControl
                  control="input"
                  type="text"
                  label="Стоимость курса"
                  placeholder="Стоимость курса"
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
                  name="program_link"
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

                <FormikControl
                  control="select"
                  component={TextField}
                  type="text"
                  name="branch"
                  label="Выберите филиал"
                  placeholder="Выберите филиал"
                  defaultValue={values ? values.branch : null}
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

                <Button
                  variant="contained"
                  type="submit"
                  color="primary"
                  className="mt-4"
                  style={{ margin: 4 }}
                >
                  Изменить
                </Button>

                <ToastContainer
                  position="top-right"
                  autoClose={2500}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                />
              </Form>
            );
          }}
        </Formik>
      ) : (
        <Loader />
      )}
    </>
  );
}

export default EditCourseFormik;
