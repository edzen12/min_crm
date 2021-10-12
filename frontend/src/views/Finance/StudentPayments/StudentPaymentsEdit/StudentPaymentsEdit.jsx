import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTransactionsDetailAction,
  fetchCourses,
  fetchBranches,
  setBreadcrumbs
} from "../../../../redux/actions/index"
import Dashboard from "../../../../layouts/Dashboard/Dashboard";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import {Button, Row} from "reactstrap";
import { Button as StrapBtn } from "reactstrap"
import FormikControl from "../../../../components/FormikControl";
import { TextField } from "@material-ui/core";
import axios from "../../../../axios/configuratedAxios";
import { useToasts } from 'react-toast-notifications';
import { motion } from "framer-motion";
import Loader from '../../../../components/UI/Loader/Loader';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import ImageDropzone from "../../../../components/UI/ImageDropzone/ImageDropzone";

function StudentPaymentsEdit(props) {

  const studentPaymentsDetailId = props.id;

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false)
  useEffect(() => {
    dispatch(fetchTransactionsDetailAction(studentPaymentsDetailId))
      .then(() => dispatch(fetchCourses('courses/')))
      .then(() => setLoading(false))
    dispatch(fetchBranches())
    window.scrollTo(0, 0);
  }, [dispatch, studentPaymentsDetailId]);

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

  const dispatchedCourses = useSelector(
    (state) => state.courses.courses.data
  );

  const courses = dispatchedCourses
    ? (dispatchedCourses.results || []).map((course) => ({
        id: course.id,
        value: course.id,
        label: course.title,
      }))
    : [];

  const dispatchedStudents = useSelector(
    (state) => state.student.studentsList.data && state.student.studentsList.data.results
  );

  const students = [];
  if (dispatchedStudents) {
    dispatchedStudents.forEach((item) =>
      students.push({
        id: item.id,
        value: item.id,
        label: item.student_id,
      })
    );
  }

  const fetchedValues = useSelector(state => state.finance.transactionsDetail && state.finance.transactionsDetail.data)
  useEffect(() => {
    fetchedValues && dispatch(setBreadcrumbs(
      [
        {title: "Транзакции", to: "/transactions"},
        {title: fetchedValues.title, to: ""},
      ]
    ))
  }, [fetchedValues]);
  const validationSchema = Yup.object({});

  let formData = new FormData();

  const addExpense = async (formData, resetForm) => {
    try {
      const response = await axios.put(`/finances/transactions/${fetchedValues.id}/`, formData);
      setLoading(false)
      addToast("Оплата изменена!", {
        appearance: "success",
        autoDismiss: true
      });
      resetForm()
      setTimeout(()=> {
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

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  const onSubmit = (values, {resetForm}) => {
    setLoading(true)
    values.title && formData.append("title", values.title);
    values.amount && formData.append("amount", values.amount);
    values.comment && formData.append("comment", values.comment);
    (timeValue || dateValue) && formData.append("created_date", formatDate(dateValue, timeValue));
    values.confirmation &&
    typeof values.confirmation !== 'string' &&
    formData.append("confirmation", values.confirmation, values.confirmation.name);
    values.wallet && formData.append("wallet", values.wallet);
    values.course && formData.append("course", values.course);
    values.student && formData.append("student", values.student);
    values.method && formData.append("method", values.method);
    values.branch && formData.append('branch', values.branch);

    addExpense(formData, resetForm);
    props.setFirstStep(true);
  }

  const methods = [
    { key: 'TRANSFER', value: 'TRANSFER', label: "Трансфер" },
    { key: 'DEPOSIT', value: 'DEPOSIT', label: "Пополнение" }
  ];

  const [timeValue, setTimeValue] = useState(null);
  const [dateValue, setDateValue] = useState(null);
  return (
    <Dashboard>
      {loading &&
        <Loader />
      }
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
                <h4 className="card-title">Изменить оплату студента</h4>
                {fetchedValues && <Formik
                  initialValues={fetchedValues}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                >
                  {({ values, errors, isSubmitting, setFieldValue, handleChange }) => (
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
                        defaultValue={values ? values.wallet : null}
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

                      <FormikControl
                        control="select"
                        component={TextField}
                        type="text"
                        name="method"
                        label="Выберите метод"
                        placeholder="Выберите метод"
                        defaultValue={values ? values.method : null}
                        select
                        variant="outlined"
                        displayEmpty
                        fullwidth="true"
                        className="mt-4"
                        style={{ margin: 4 }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        options={methods}
                        handleChange={handleChange}
                      />

                      <FormikControl
                        control="select"
                        component={TextField}
                        type="text"
                        name="course"
                        label="Выберите курс"
                        defaultValue={values ? values.course : null}
                        placeholder="Выберите курс"
                        select
                        variant="outlined"
                        displayEmpty
                        fullwidth="true"
                        className="mt-4"
                        style={{ margin: 4 }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        options={courses}
                        handleChange={handleChange}
                      />

                      <FormikControl
                        control="select"
                        component={TextField}
                        type="text"
                        name="student"
                        label="Выберите студента"
                        defaultValue={values ? values.student : null}
                        placeholder="Выберите студента"
                        select
                        variant="outlined"
                        displayEmpty
                        fullwidth="true"
                        className="mt-4"
                        style={{ margin: 4 }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        options={students}
                        handleChange={handleChange}
                      />

                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          format="dd/MM/yyyy"
                          className="mt-4"
                          fullwidth="true"
                          style={{ margin: 4 }}
                          label={"Дата создания"}
                          value={dateValue ? dateValue : fetchedValues.created_date}
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
                          placeholder="Выберите филиал"
                          select
                          displayEmpty
                          fullwidth="true"
                          defaultValue={fetchedValues ? fetchedValues.branch : null}
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
                        style={{ margin: 4, display: "block" }}
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
      </motion.div>
    </Dashboard>
  );
}

export default StudentPaymentsEdit;
