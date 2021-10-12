import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWalletListAction,
  fetchExpenseTagsAction,
  fetchBranches,
  setBreadcrumbs
} from "../../../../redux/actions/index"
import Dashboard from "../../../../layouts/Dashboard/Dashboard";
import { Form, Formik } from "formik";
import Loader from "../../../../components/UI/Loader/Loader";
import * as Yup from "yup";
import { Row } from "reactstrap";
import FormikControl from "../../../../components/FormikControl";
import { TextField } from "@material-ui/core";
import axios from "../../../../axios/configuratedAxios";
import { useToasts } from 'react-toast-notifications';
import {stopLoading} from "../../../../redux/actions/createUser";
import ImageDropzone from "../../../../components/UI/ImageDropzone/ImageDropzone";
import { Button } from '@material-ui/core'

function AddExpenses() {
  const [loader, setLoader] = useState(false)
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setBreadcrumbs(
      [
        {title: "Транзакции", to: "/transactions"},
        {title: "Создать расход", to: ""},
      ]
    ))
    dispatch(fetchWalletListAction());
    dispatch(fetchExpenseTagsAction());
    dispatch(fetchBranches())
    window.scrollTo(0, 0);
  }, [dispatch]);

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

  const dispatchedWalletList = useSelector(
    (state) => state.finance.walletsList.data && state.finance.walletsList.data.results
  );
  const wallets = [];
  if (dispatchedWalletList) {
    dispatchedWalletList.forEach((item) =>
      wallets.push({
        key: item.id,
        value: item.wallet_id,
        label: item.name,
      })
    )
  }

  const dispatchedExpenseTags = useSelector(
    (state) => state.finance.expenseTags.data && state.finance.expenseTags.data.results
  );
  const expenseTags = [];
  if (dispatchedExpenseTags) {
    dispatchedExpenseTags.forEach((item) =>
      expenseTags.push({
        key: item.id,
        value: item.id,
        label: item.name,
      })
    )
  };

  const initialValues = {
    created_date: null,
    created_time: null,
    title: "",
    amount: "",
    confirmation: null,
    comment: "",
    description: "",
    wallet: [],
    categories: []
  }
  console.log(initialValues)

  const validationSchema = Yup.object({
    title: Yup.string().required("Обязательное поле!"),
    amount: Yup.string().required("Обязательное поле!"),
    wallet: Yup.string().required("Обязательное поле!"),
    created_date: Yup.string().required("Обязательное поле!"),
    created_time: Yup.string().required("Обязательное поле!"),
    confirmation: Yup.string().required("Обязательное поле!"),
  });

  let formData = new FormData();

  const addExpense = async (formData, resetForm) => {
    setLoader(true)
    try {
      await axios.post(`/finances/expenses/`, formData);
      setLoader(false)
      addToast("Расход создан!", {
        appearance: "success",
        autoDismiss: true
      });
      resetForm()
      setTimeout(()=> {
        window.location = "/transactions"
      }, 500)
    } catch (error) {
      setLoader(false)
      let isError = error.response.data.amount ?? false;
      if(isError){
        dispatch(stopLoading());
        addToast("Убедитесь, что в числе не больше 2 знаков в дробной части.", {
          appearance: "error",
          autoDismiss: true
        })
      } else {
        dispatch(stopLoading());
        addToast("Что-то пошло не так!", {
          appearance: "error",
          autoDismiss: true
        })
      }
    }
  }

  const formatDate = (date, time) => {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    var t = new Date(time),
      hours = '' + (t.getHours()),
      minutes = '' + t.getMinutes();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;
    if (hours.length < 2)
      hours = '0' + hours;
    if (minutes.length < 2)
      minutes = '0' + minutes;
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  const onSubmit = (values, {resetForm}) => {
    values.title && formData.append("title", values.title);
    values.amount && formData.append("amount", values.amount);
    values.comment && formData.append("comment", values.comment);
    values.description && formData.append("description", values.description);
    values.created_date && values.created_time && formData.append("created_date", formatDate(values.created_date, values.created_time));
    values.confirmation && formData.append("confirmation", values.confirmation, values.confirmation.name);
    values.wallet && formData.append("wallet", `${values.wallet}`);
    values.categories && formData.append("categories", `${values.categories}`);
    values.branch && formData.append('branch', values.branch);

    addExpense(formData, resetForm);
    // actions.resetForm();
  }

  return (
    <Dashboard>
        <Row>
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Добавить расход</h4>
                { loader && <Loader/> }
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                >
                  {({ values, touched, setFieldValue, errors, isSubmitting,handleChange }) => (
                    <Form className="mt-4">

                      <FormikControl
                        control="input"
                        type="text"
                        label="Наименование транзакции"
                        name="title"
                        className="mt-4"
                        fullwidth="true"
                        style={{ margin: 4 }}
                        as={TextField}
                      />

                      <FormikControl
                        control="input"
                        type="text"
                        label="Комментарии"
                        name="comment"
                        className="mt-4"
                        fullwidth="true"
                        style={{ margin: 4 }}
                        as={TextField}
                      />

                      <FormikControl
                        control="input"
                        type="text"
                        label="Описание"
                        name="description"
                        className="mt-4"
                        fullwidth="true"
                        style={{ margin: 4 }}
                        as={TextField}
                      />

                      <FormikControl
                        control="input"
                        type="text"
                        label="Сумма"
                        name="amount"
                        className="mt-4"
                        fullwidth="true"
                        style={{ margin: 4 }}
                        as={TextField}
                      />

                      <ImageDropzone
                        text="Фото или скан чека"
                        name="confirmation"
                        error={errors.confirmation}
                        setFieldValue={setFieldValue}
                      />

                      <FormikControl
                        control="date"
                        type="text"
                        label="Дата создания"
                        className="mt-4"
                        fullwidth="true"
                        style={{ margin: 4 }}
                        name="created_date"
                      />

                      <FormikControl
                        control="time"
                        type="text"
                        label="Время создания"
                        className="mt-4"
                        fullwidth="true"
                        style={{ margin: 4 }}
                        name="created_time"
                      />

                       <FormikControl
                        control="select"
                        component={TextField}
                        type="text"
                        name="wallet"
                        label="Выберите кошелек"
                        placeholder="Выберите кошелек"
                        select
                        displayEmpty
                        fullwidth="true"
                        className="mt-4"
                        style={{ margin: 4 }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        options={wallets}
                        handleChange={handleChange}
                      />
                      
                      <FormikControl
                       control="select"
                       component={TextField}
                       type="text"
                       name="categories"
                       label="Выберите категорию:"
                       placeholder="Выберите категорию"
                       select
                       displayEmpty
                       fullwidth="true"
                       className="mt-4"
                       style={{ margin: 4 }}
                       InputLabelProps={{
                         shrink: true,
                       }}
                       options={expenseTags}
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
                          className="mt-4"
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

                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </Row>
    </Dashboard>
  );
}

export default AddExpenses;
