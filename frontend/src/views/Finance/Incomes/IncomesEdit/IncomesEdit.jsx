import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {fetchBranches, fetchTransactionsDetailAction, setBreadcrumbs} from "../../../../redux/actions/index"
import Dashboard from "../../../../layouts/Dashboard/Dashboard";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import {Button, Row} from "reactstrap";
import { Button as StrapBtn } from "reactstrap"
import FormikControl from "../../../../components/FormikControl";
import { TextField } from "@material-ui/core";
import axios from "../../../../axios/configuratedAxios";
import { useToasts } from 'react-toast-notifications';
import DateFnsUtils from '@date-io/date-fns';
import Loader from '../../../../components/UI/Loader/Loader';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import ImageDropzone from "../../../../components/UI/ImageDropzone/ImageDropzone";

function IncomesEdit(props) {

  const incomesDetailId = props.id;

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false)
  useEffect(() => {
    dispatch(fetchTransactionsDetailAction(incomesDetailId)).then(()=>
    setLoading(false))
    dispatch(fetchBranches())
    window.scrollTo(0, 0);
  }, [dispatch, incomesDetailId]);

  const { addToast } = useToasts();

  const dispatchedBranches = useSelector(
    (state) =>
      state.branches.branches.data && state.branches.branches.data
  );

  const branches = dispatchedBranches ? (dispatchedBranches.results || []).map(branch => ({
    id: branch.id,
    value: branch.id,
    label: branch.name
  })) : [];

  const dispatchedWalletList = useSelector(
    (state) => state.finance.walletsList.data && state.finance.walletsList.data.results
  );
  const wallets = [];
  if (dispatchedWalletList) {
    dispatchedWalletList.forEach((item) =>
      wallets.push({
        id: item.id,
        value: item.wallet_id,
        label: item.name,
      }),
    )
  }

  const fetchedValues = useSelector(state => state.finance.transactionsDetail.data)
  useEffect(() => {
    fetchedValues && dispatch(setBreadcrumbs(
      [
        {title: "Транзакции", to: "/transactions"},
        {title: fetchedValues.title, to: ""},
      ]
    ))
  }, [fetchedValues]);
  const validationSchema = Yup.object({
    title: Yup.string().required("Обязательное поле!"),
    amount: Yup.string().required("Обязательное поле!"),
  });

  let formData = new FormData();

  const addIncomes = async (formData, resetForm) => {
    try {
      const response = await axios.put(`/finances/transactions/${incomesDetailId}/`, formData);
      addToast("Доход изменен!", {
        appearance: "success",
        autoDismiss: true
      });
      resetForm()
      setTimeout(()=> {
        setLoading(false)
        window.location = "/transactions"
      }, 500)
    } catch (error) {
      setLoading(false)
      addToast("Что-то пошло не так!", {
        appearance: "error",
        autoDismiss: true
      })
    }
  }

  const formatDate = (date, time) => {
    var d = new Date(date),
      month = '' + (d.getMonth()+1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    var t = new Date(time),
      hours = '' + (t.getHours()),
      minutes = '' + t.getMinutes();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  const onSubmit = (values, {resetForm}) => {
    setLoading(true)
    values.title && formData.append("title", values.title);
    values.amount && formData.append("amount", values.amount);
    values.comment && formData.append("comment", values.comment);
    (timeValue || dateValue ) &&  formData.append("created_date", formatDate(dateValue, timeValue));
    values.confirmation &&
    typeof values.confirmation !== 'string' &&
    formData.append("confirmation", values.confirmation, values.confirmation.name);
    values.wallet && formData.append("wallet", values.wallet);
    values.branch && formData.append('branch', values.branch);

    addIncomes(formData, resetForm);
    props.setFirstStep(true);
  }

  const [timeValue, setTimeValue] = useState(null);
  const [dateValue, setDateValue] = useState(null);
  return (
    <Dashboard>
      {loading &&
        <Loader />
      }
        <Row>
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Изменить доход</h4>
                {fetchedValues && <Formik
                  initialValues={fetchedValues}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                >
                  {({ values, errors, setFieldValue, isSubmitting, handleChange }) => (
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
                        existingFileLink={values.confirmation && values.confirmation}
                        setFieldValue={setFieldValue}
                      />

                        <FormikControl
                        control="select"
                        component={TextField}
                        type="text"
                        name="wallet"
                        label="Выберите кошелек"
                        placeholder="Выберите кошелек"
                        defaultValue={fetchedValues ? fetchedValues.wallet : null}
                        select
                        variant="outlined"
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

                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          format="dd/MM/yyyy"
                          className="mt-4"
                          fullwidth="true"
                          style={{ margin: 4 }}
                          label={"Дата создания"}
                          value={dateValue?dateValue:fetchedValues.created_date}
                          onChange={val => setDateValue(val)}
                          KeyboardButtonProps={{
                            'aria-label': 'change date',
                          }}
                        />
                      </MuiPickersUtilsProvider>

                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardTimePicker
                          label="Время создания"
                          value={timeValue ? timeValue : fetchedValues.created_date}
                          ampm={false}
                          className="mt-4"
                          fullwidth="true"
                          style={{ margin: 4 }}
                          onChange={val => setTimeValue(val)}
                          KeyboardButtonProps={{
                            'aria-label': 'change time',
                          }}
                        />
                      </MuiPickersUtilsProvider>


                      {branches ? (

                        <FormikControl
                          control="select"
                          component={TextField}
                          type="text"
                          name="branch"
                          label="Выберите филиал"
                          defaultValue={fetchedValues ? fetchedValues.branch : null}
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

                      <StrapBtn
                        type="submit"
                        color="primary"
                        style={{ margin: 4, display:"block" }}
                        className="mt-4"
                      >
                        Изменить
                      </StrapBtn>

                      {/* <pre className="mt-4">{JSON.stringify(values, null, 2)}</pre>
                      <pre>{JSON.stringify(errors, null, 2)}</pre> */}
                    </Form>
                  )}
                </Formik>}
              </div>
            </div>
          </div>
        </Row>
    </Dashboard>
  );
}

export default IncomesEdit;
