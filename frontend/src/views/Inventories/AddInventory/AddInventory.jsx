import React from "react";
import Dashboard from "../../../layouts/Dashboard/Dashboard";
import {Form, Formik} from "formik";
import * as Yup from "yup";
import {Row} from "reactstrap";
import FormikControl from "../../../components/FormikControl";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
  fetchBranches, setBreadcrumbs,
} from "../../../redux/actions";
import {
  TextField
} from "@material-ui/core";
import Button from '@material-ui/core/Button';
import {withStyles} from '@material-ui/core/styles';
import 'react-toastify/dist/ReactToastify.css';
import FormikErrorFocus from 'formik-error-focus'
import axios from "../../../axios/configuratedAxios";
import Loader from "../../../components/UI/Loader/Loader";
import {useToasts} from 'react-toast-notifications';


const AddButton = withStyles(theme => ({
  root: {},

}))(Button);

function AddInventory() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setBreadcrumbs(
      [
        {title: "Инвентарь", to: "/inventories"},
        {title: "Добавить инв.", to: ""},
      ]
    ))
    dispatch(fetchBranches());
  }, [dispatch]);

  const [isLoading, setLoading] = useState(false)

  const dispatchedBranches = useSelector(
    (state) =>
      state.branches.branches.data &&
      state.branches.branches.data.results
  );

  const branches = [];
  if (dispatchedBranches) {
    dispatchedBranches.forEach((item) =>
      branches.push({
        id: item.id,
        value: item.id,
        label: item.name,
      })
    );
  }


  const {addToast} = useToasts();

  const initialValues = {
    title: "",
    amount: "",
    price: "",
    comment: "",
    branch: []
  };

  const validationSchema = Yup.object({
    branch: Yup.string().required("Это обязательное поле!"),
    title: Yup.string().required("Это обязательное поле!"),
    amount: Yup.string().required("Обязательное поле!"),
    price: Yup.string().required("Обязательное поле!"),
    comment: Yup.string().required("Обязательное поле!"),
  });

  const createInventory = async (formData, resetForm) => {
    try {
      setLoading(true);
      const response = await axios.post('inventories/', formData);
      addToast("Инвентари добавлен!", {
        appearance: "success",
        autoDismiss: true
      })
      resetForm()
      setTimeout(() => {
        window.location = `/inventories`
      }, 1000);
      setLoading(false);
    } catch (error) {
      let isAmountError = error.response.data.amount ?? false;
      if (isAmountError) {
        setLoading(false)
        addToast("Требуется целочисленное значение.", {
          appearance: "error",
          autoDismiss: true
        })
      } else {
        setLoading(false)
        addToast("Что-то пошло не так!", {
          appearance: "error",
          autoDismiss: true
        })
      }
      console.log(error)
    }
  }

  let formData = new FormData();
  const onSubmit = (values, {resetForm}) => {
    setLoading(true);
    values.total_price && formData.append("total_price", values.total_price);
    values.branch && formData.append("branch", values.branch);
    values.title && formData.append("title", values.title);
    values.amount && formData.append("amount", values.amount);
    values.price && formData.append("price", values.price);
    values.comment && formData.append("comment", values.comment);
    createInventory(formData, resetForm);
  };

  return (
    <Dashboard>
      {isLoading && <Loader/>}
      <div>
        <Row>
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <div style={{display: "flex", justifyContent: "space-between"}}>
                  <h4 className="card-title">Создать инвентаря</h4>
                </div>
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
                        name="title"
                        label="Название инвентаря"
                        placeholder="Название инвентаря"
                        fullwidth="true"
                        className="mt-4"
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
                        name="branch"
                        label="Филиал"
                        placeholder="Филиал"
                        select
                        displayEmpty
                        variant="outlined"
                        fullwidth="true"
                        className="mt-4"
                        style={{margin: 4}}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        options={branches}
                        handleChange={handleChange}
                      />

                      <FormikControl
                        control="input"
                        type="number"
                        label="Количество"
                        placeholder="Введите количество"
                        name="amount"
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
                        type="number"
                        label="Стоимость за 1 штуку"
                        placeholder="Стоимость за 1 штуку"
                        name="price"
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
                        label="Комментарии"
                        placeholder="Комментарии"
                        name="comment"
                        className="mt-4"
                        fullwidth="true"
                        style={{margin: 4}}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        variant="outlined"
                        as={TextField}
                      />
                      <AddButton
                        type="submit"
                        variant="contained"
                        color="primary"
                        className="mt-4"
                        style={{margin: 4}}
                      >
                        Создать
                      </AddButton>

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
              </div>
            </div>
          </div>
        </Row>
      </div>
    </Dashboard>
  );
}

export default AddInventory;
