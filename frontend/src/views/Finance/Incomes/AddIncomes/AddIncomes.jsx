import React, {useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import {fetchWalletListAction, fetchBranches, setBreadcrumbs} from "../../../../redux/actions/index";
import Dashboard from "../../../../layouts/Dashboard/Dashboard";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { Row } from "reactstrap";
import FormikControl from "../../../../components/FormikControl";
import { TextField } from "@material-ui/core";
import axios from "../../../../axios/configuratedAxios";
import { useToasts } from 'react-toast-notifications';
import { motion } from "framer-motion";
import Loader from "../../../../components/UI/Loader/Loader";
import ImageDropzone from "../../../../components/UI/ImageDropzone/ImageDropzone";
import {stopLoading} from "../../../../redux/actions/createUser";
import { Button } from '@material-ui/core'

function AddIncomes() {
  const [loader, setLoader] = useState(false)
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setBreadcrumbs(
      [
        {title: "Транзакции", to: "/transactions"},
        {title: "Создать доход", to: ""},
      ]
    ))
    dispatch(fetchWalletListAction())
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
  console.log(wallets);

  let initialValues = {
    created_date: null,
    created_time: null,
    title: "",
    amount: "",
    confirmation: null,
    comment: "",
    wallet: []
  }

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
    initialValues = {
      created_date: null,
      created_time: null,
      title: "",
      amount: "",
      confirmation: null,
      comment: "",
      wallet: []
    }
    setLoader(true)
    try {
      const response = await axios.post(`/finances/incomes/`, formData);
      setLoader(false)
      addToast("Доход создан!", {
        appearance: "success",
        autoDismiss: true
      });
      resetForm();
      setTimeout(()=> {
        window.location = "/transactions"
      }, 500)
    } catch (error) {
      setLoader(false)
      let isEmailError = error.response.data.amount ?? false;
      if(isEmailError){
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
    values.created_date && values.created_time && formData.append("created_date", formatDate(values.created_date, values.created_time));
    values.confirmation && formData.append("confirmation", values.confirmation, values.confirmation.name);
    values.wallet && formData.append("wallet", values.wallet);
    values.branch && formData.append('branch', values.branch);

    addExpense(formData, resetForm);
  }

  return (
    <Dashboard>
      <motion.div
        layoutId="outline"
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        transition={{ easeInOut: [0, .02, .58, 1], duration: 1 }}
      >
        <Row>
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Добавить доход</h4>
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

                      {/* <pre className="mt-4">{JSON.stringify(values, null, 2)}</pre>
                      <pre>{JSON.stringify(errors, null, 2)}</pre> */}

                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </Row>
      </motion.div>
    </Dashboard>
  );
}

export default AddIncomes;
