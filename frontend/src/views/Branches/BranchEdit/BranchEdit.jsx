import React, {useState, useEffect} from "react";
import Dashboard from "../../../layouts/Dashboard/Dashboard";
import {Form, Formik} from "formik";
import * as Yup from "yup";
import {Button, Row} from "reactstrap";
import FormikControl from "../../../components/FormikControl";
import Loader from "../../../components/UI/Loader/Loader"
import {TextField} from "@material-ui/core";
import axios from "../../../axios/configuratedAxios";
import {useToasts} from 'react-toast-notifications';
import FormikErrorFocus from 'formik-error-focus'
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import {setBreadcrumbs} from "../../../redux/actions";
import {useDispatch} from "react-redux";
function BranchEdit(props) {

  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const branchId = props.match.params.id;
  const {addToast} = useToasts()

  const [initialValues, setInitialValues] = useState(null);

  const validationSchema = Yup.object({
    passportNumber: Yup.string().max(20, 'Не больше 20 символов!'),
    authority: Yup.string().max(10, 'Не больше 10 символов!'),
  });

  const dispatch = useDispatch();

  async function fetchBranchDetail() {
    try {
      const response = await axios.get(`/branches/${branchId}/`);
      setInitialValues(response.data)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      addToast("Что-то пошло не так!", {
        appearance: "error",
        autoDismiss: true
      })
    }
  }

  useEffect(() => {
    setLoading(true)
    fetchBranchDetail()
  }, []);
  useEffect(() => {
    initialValues && dispatch(setBreadcrumbs(
      [
        {title: "Филиалы", to: "/branches"},
        {title: initialValues.name, to: ""},
      ]
    ))
  }, [initialValues]);

  const patchBranch = async (userData, resetForm) => {
    try {
      const response = await axios.patch(`branches/${branchId}/`, userData);
      addToast("Филиал обновлен!", {
        appearance: "success",
        autoDismiss: true,
      });
      setLoading(false);
      setTimeout(() => {
        window.location = `/branches/${response.data.id}`
      }, 500);
      resetForm();
    } catch (error) {
      setLoading(false)
      addToast("Что-то пошло не так!", {
        appearance: "error",
        autoDismiss: true
      })
    }
  };

  const appendBranchData = (values, resetForm) => {
    const formData = new FormData();
    values.name && formData.append("name", values.name);
    values.oblast && formData.append("oblast", values.oblast);
    values.city && formData.append("city", values.city);
    values.address && formData.append("address", values.address);
    values.email && formData.append("email", values.email);
    values.description && formData.append("description", values.description);
    values.phone && formData.append("telephone_number", values.phone.split(' ').join(''));
    formData.append("class9", !!values.class9);
    formData.append("class10", !!values.class10);
    formData.append("class11", !!values.class11);

    setLoading(true);
    patchBranch(formData, resetForm);
  }

  const onSubmit = (values, {resetForm}) => {
    appendBranchData(values, resetForm)
  }

  const oblasts = [
    {
      id: 0,
      label: "Ыссык-Кульская",
      value: "IK",
    },
    {
      id: 1,
      label: "Чуйская",
      value: "CH",
    },
    {
      id: 2,
      label: "Нарынская",
      value: "NR",
    },
    {
      id: 3,
      label: "Таласская",
      value: "TS",
    },
    {
      id: 4,
      label: "Джалал-Абадская",
      value: "JL",
    },
    {
      id: 5,
      label: "Ошская",
      value: "OS",
    },
    {
      id: 6,
      label: "Баткенская",
      value: "BT",
    },
  ];
console.log(initialValues)
  return (
    <Dashboard>
      {isLoading && <Loader/>}
      <div>
        <Row>
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <div style={{display: "flex", justifyContent: "space-between"}}>
                  <h4 className="card-title">Редактирование филиала</h4>
                </div>
                {initialValues &&
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                >
                  {({values, errors, isSubmitting, touched, handleChange, resetForm, setFieldValue}) => (
                    <Form className="mt-4">

                      <FormikControl
                        control="input"
                        type="text"
                        label="Название"
                        placeholder="Название"
                        name="name"
                        fullwidth="true"
                        style={{margin: 4}}
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
                        name="oblast"
                        label="Выберите область"
                        placeholder="Выберите область"
                        defaultValue={values.oblast}
                        select
                        variant="outlined"
                        displayEmpty
                        fullwidth="true"
                        className="mt-4"
                        style={{margin: 4}}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        options={oblasts}
                        handleChange={handleChange}
                      />

                      <FormikControl
                        control="input"
                        type="text"
                        label="Город или населенный пункт"
                        placeholder="Город или населенный пункт"
                        name="city"
                        className="mt-4"
                        fullwidth="true"
                        style={{margin: 4}}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        variant="outlined"
                        as={TextField}
                      />

                      <FormikControl
                        control="input"
                        type="text"
                        label="Адресс"
                        placeholder="Адресс"
                        name="address"
                        className="mt-4"
                        fullwidth="true"
                        style={{margin: 4}}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        variant="outlined"
                        as={TextField}
                      />

                      <FormikControl
                        control="input"
                        type="text"
                        label="Email"
                        placeholder="Email"
                        name="email"
                        className="mt-4"
                        fullwidth="true"
                        style={{margin: 4}}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        variant="outlined"
                        as={TextField}
                      />

                      <FormikControl
                        control="maskedInput"
                        mask="+\9\96 999 999 999"
                        type="text"
                        label="Номер телефона"
                        name="telephone_number"
                        className="mt-4"
                        fullwidth="true"
                        style={{margin: 4}}
                      />

                      <FormikControl
                        control="input"
                        type="text"
                        label="Описание"
                        placeholder="Описание"
                        name="description"
                        fullwidth="true"
                        className="mt-4"
                        style={{margin: 4}}
                        multiline
                        rows={8}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        variant="outlined"
                        as={TextField}
                      />

                      <FormGroup style={{margin: 4}}>
                        <FormControlLabel
                          control={<Checkbox color="primary" checked={values.class9} onChange={handleChange} name="class9" />}
                          label="9 - класс"
                        />
                        <FormControlLabel
                          control={<Checkbox color="primary" checked={values.class10} onChange={handleChange} name="class10" />}
                          label="10 - класс"
                        />
                        <FormControlLabel
                          control={<Checkbox color="primary" checked={values.class11} onChange={handleChange} name="class11" />}
                          label="11 - класс"
                        />
                      </FormGroup>

                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        className="mt-4"
                        style={{margin: 4}}
                      >
                        Изменить
                      </Button>

                      <FormikErrorFocus
                        offset={0}
                        align={'top'}
                        focusDelay={100}
                        ease={'linear'}
                        duration={700}
                      />

                      {/* <pre className="mt-5">{JSON.stringify(values, null, 2)}</pre>
                      <pre>{JSON.stringify(errors, null, 2)}</pre> */}
                    </Form>
                  )}
                </Formik>
                }
              </div>
            </div>
          </div>
        </Row>
      </div>
    </Dashboard>
  );
}

export default BranchEdit;
