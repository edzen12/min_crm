import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import Dashboard from "../../layouts/Dashboard/Dashboard";
import {Form, Formik, Field} from "formik";
import MuiTextField from "@material-ui/core/TextField";
import * as Yup from "yup";
import {Button, Row} from "reactstrap";
import FormikControl from "../../components/FormikControl";
import {useToasts} from "react-toast-notifications";
import {
  Typography
} from "@material-ui/core";
import {stopLoading} from "../../redux/actions/createUser";
import {TextField} from "@material-ui/core";
import axios from "../../axios/configuratedAxios";
import FormikErrorFocus from 'formik-error-focus'
import ImageDropzone from "../../components/UI/ImageDropzone/ImageDropzone";
import {Autocomplete} from "formik-material-ui-lab";


function AddStudent(props) {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.userCreate.userId);
  const {addToast} = useToasts();

  const [fetchedKlasses, setFetchedKlasses] = useState([]);
  const [fetchedCategories, setCategories] = useState([]);

  const fetchStudenCategories = () => {
    axios.get('users/students/student-categories/')
      .then(response => {
        setCategories(response.data.results.map(item => ({id: item.id, title: item.title})));
      })
      .catch(e => {
        console.log(e.response)
      })
  }

  const fetchKlasses = () => {
    axios.get('klasses/')
      .then(response => {
        setFetchedKlasses(response.data.results.map(item => ({value: item.id, label: item.klass_id})));
      })
      .catch(e => {
        console.log(e.response)
      })
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchKlasses();
    fetchStudenCategories();
  }, []);

  const initialValues = {
    enrollmentDate: null,
    studyStartDate: null,
    studyFinishDate: null,
    status: "",
    address: "",
    residenceAddress: "",
    motherName: "",
    motherPhoneNumber: "",
    fatherName: "",
    fatherPhoneNumber: "",
    english_level: "",
    quitReason: "",
    region: "",
    country: "",
    residence: "",
    passportNumber: "",
    authority: "",
    dateOfIssue: null,
    dateOfExpire: null,
    placeOfWork: "",
    info_from: "",
    contract_amount: 0,
    category: [],
    klass: ""
  };

  const validationSchema = Yup.object({
    passportNumber: Yup.string().max(20, '???? ???????????? 20 ????????????????!'),
    authority: Yup.string().max(10, '???? ???????????? 10 ????????????????!')
  });

  const statusOptions = [
    {
      id: 0,
      label: "????????????????(????)",
      value: "A"
    },
    {
      id: 1,
      label: "????????(????)",
      value: "L"

    },
    {
      id: 2,
      label: "??????????????(??)",
      value: "G"
    },
  ];

  const oblasts = [
    {
      id: 0,
      label: "??????????-????????????????",
      value: "IK",
    },
    {
      id: 1,
      label: "??????????????",
      value: "CH",
    },
    {
      id: 2,
      label: "??????????????????",
      value: "NR",
    },
    {
      id: 3,
      label: "??????????????????",
      value: "TS",
    },
    {
      id: 4,
      label: "????????????-????????????????",
      value: "JL",
    },
    {
      id: 5,
      label: "????????????",
      value: "OS",
    },
    {
      id: 6,
      label: "????????????????????",
      value: "BT",
    },
  ];

  const englishLevelOptions = [
    {
      id: 0,
      label: "Elementary",
      value: "E"
    },
    {
      id: 1,
      label: "Beginner",
      value: "B"

    },
    {
      id: 2,
      label: "Intermediate",
      value: "I"
    },
    {
      id: 3,
      label: "Advanced",
      value: "A"
    }
  ];

  const infoFromOptions = [
    {
      id: 0,
      label: "????????????????",
      value: "A"
    },
    {
      id: 1,
      label: "???????????????????? ????????",
      value: "SN"

    },
    {
      id: 2,
      label: "Google",
      value: "G"
    },
    {
      id: 3,
      label: "??????",
      value: "SM"
    },
    {
      id: 4,
      label: "????????????",
      value: "O"
    }
  ]

  let formData = new FormData();

  const putStudent = async (formData, resetForm) => {
    try {
      const response = await axios.put(`users/students/${userId}/`, formData);
      addToast("?????????????? ????????????????!", {
        appearance: "success",
        autoDismiss: true
      })
      dispatch(stopLoading());
      setTimeout(() => {
        window.location = `student/${response.data.id}`
      }, 1000);
      resetForm();
      props.setFirstStep(true);
      return response.data.id;
    } catch (error) {
      console.log(error.response);
      dispatch(stopLoading());
      addToast("??????-???? ?????????? ???? ??????!", {
        appearance: "error",
        autoDismiss: true
      })
      return null;
    }
  };

  const formatDate = (date) => {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }

  const onSubmit = async (values, {resetForm}) => {
    values.enrollmentDate && formData.append('enrollment_date', formatDate(values.enrollmentDate));
    values.studyStartDate && formData.append('study_start_date', formatDate(values.studyStartDate));
    values.studyFinishDate && formData.append('finish_date', formatDate(values.studyFinishDate));
    values.status && formData.append('status', values.status);
    values.address && formData.append('address', values.address);
    values.residenceAddress && formData.append('residence_address', values.residenceAddress);
    values.motherName && formData.append('mother_name', values.motherName);
    values.motherPhoneNumber && formData.append('mother_phone_number', values.motherPhoneNumber.split(' ').join(''));
    values.fatherName && formData.append('father_name', values.fatherName);
    values.fatherPhoneNumber && formData.append('father_phone_number', values.fatherPhoneNumber.split(' ').join(''));
    values.english_level && formData.append('english_level', values.english_level);
    values.quitReason && formData.append('quit_reason', values.quitReason);
    values.region && formData.append("region", values.region);
    values.country && formData.append('country', values.country);
    values.residence && formData.append('residence', values.residence);
    values.passportNumber &&
    formData.append("passport_number", values.passportNumber);
    values.authority && formData.append("authority", values.authority);
    values.dateOfIssue &&
    formData.append("date_of_issue", formatDate(values.dateOfIssue));
    values.dateOfExpire &&
    formData.append("date_of_expire", formatDate(values.dateOfExpire));
    values.passportScan &&
    formData.append("passport_scan", values.passportScan);
    values.placeOfWork &&
    formData.append("place_of_work", values.placeOfWork);
    values.info_from && formData.append('info_from', values.info_from);
    values.contractAmount && formData.append('contract_amount', values.contractAmount);
    values.klass && formData.append('klass', values.klass);
    fetchedCategories.length && values.category.length &&
    values.category.forEach((category) => formData.append("category", category.id));

    const personId = await putStudent(formData, resetForm);
  };

  return (
    <Dashboard>
      <div>
        <Row>
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <div style={{display: "flex", justifyContent: "space-between"}}>
                  <h4 className="card-title">???????????????? ????????????????</h4>
                  <Typography
                    color="primary"
                    component="p"
                    className="mt-2"
                    style={{margin: 4}}
                  >
                    ?????? 2
                  </Typography>
                </div>
                <h6 className="card-subtitle"></h6>

                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                >
                  {({values, errors, isSubmitting, setFieldValue, handleChange, touched}) => (
                    <Form className="mt-4">
                      <FormikControl
                        control="date"
                        type="text"
                        label="???????? ????????????????????"
                        className="mt-4"
                        fullwidth="true"
                        variant="outlined"
                        style={{margin: 4}}
                        name="enrollmentDate"
                      />

                      <FormikControl
                        control="date"
                        type="text"
                        label="???????????? ????????????????"
                        className="mt-4"
                        fullwidth="true"
                        variant="outlined"
                        style={{margin: 4}}
                        name="studyStartDate"
                      />

                      <FormikControl
                        control="date"
                        type="text"
                        label="?????????? ????????????????"
                        className="mt-4"
                        fullwidth="true"
                        variant="outlined"
                        style={{margin: 4}}
                        name="studyFinishDate"
                      />

                      <FormikControl
                        control="select"
                        component={TextField}
                        type="text"
                        name="status"
                        label="???????????????? ????????????"
                        placeholder="???????????????? ????????????"
                        select
                        displayEmpty
                        fullwidth="true"
                        className="mt-5"
                        style={{margin: 4}}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        options={statusOptions}
                        handleChange={handleChange}
                      />

                      <ImageDropzone
                        text="???????? ??????????????????"
                        acceptedFiles={[""]}
                        name="passportScan"
                        setFieldValue={setFieldValue}
                      />

                      <FormikControl
                        control="input"
                        type="text"
                        label="?????????? ????????????????????"
                        className="mt-4"
                        fullwidth="true"
                        style={{margin: 4}}
                        name="address"
                        as={TextField}
                      />

                      <FormikControl
                        control="input"
                        type="text"
                        label="?????????? ????????????????"
                        className="mt-4"
                        fullwidth="true"
                        style={{margin: 4}}
                        name="residenceAddress"
                        as={TextField}
                      />

                      <FormikControl
                        control="input"
                        type="text"
                        label="?????? ????????????"
                        className="mt-4"
                        fullwidth="true"
                        style={{margin: 4}}
                        name="motherName"
                        as={TextField}
                      />

                      <FormikControl
                        control="maskedInput"
                        mask="+\9\96 999 999 999"
                        type="text"
                        label="?????????? ???????????????? ????????????"
                        name="motherPhoneNumber"
                        className="mt-4"
                        fullwidth="true"
                        style={{margin: 4}}
                      />

                      <FormikControl
                        control="input"
                        type="text"
                        label="?????? ????????"
                        className="mt-4"
                        fullwidth="true"
                        style={{margin: 4}}
                        name="fatherName"
                        as={TextField}
                      />

                      <FormikControl
                        control="maskedInput"
                        mask="+\9\96 999 999 999"
                        type="text"
                        label="?????????? ???????????????? ????????"
                        name="fatherPhoneNumber"
                        className="mt-4"
                        fullwidth="true"
                        style={{margin: 4}}
                      />

                      <FormikControl
                        control="select"
                        component={TextField}
                        type="text"
                        name="english_level"
                        label="?????????????? ??????????????????????"
                        placeholder="?????????????? ??????????????????????"
                        select
                        displayEmpty
                        fullwidth="true"
                        className="mt-5"
                        style={{margin: 4}}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        options={englishLevelOptions}
                        handleChange={handleChange}
                      />

                      <FormikControl
                        control="input"
                        type="text"
                        label="?????????????? ??????????"
                        className="mt-4"
                        fullwidth="true"
                        style={{margin: 4}}
                        name="quitReason"
                        as={TextField}
                      />

                      <FormikControl
                        control="input"
                        type="text"
                        label="???????????? ????????????????????"
                        className="mt-4"
                        fullwidth="true"
                        style={{margin: 4}}
                        name="country"
                        as={TextField}
                      />

                      <FormikControl
                        control="select"
                        component={TextField}
                        type="text"
                        name="region"
                        label="???????????????? ??????????????"
                        placeholder="???????????????? ??????????????"
                        select
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
                        label="??????????????????????"
                        className="mt-4"
                        fullwidth="true"
                        style={{margin: 4}}
                        name="residence"
                        as={TextField}
                      />

                      <FormikControl
                        control="input"
                        type="text"
                        label="?????????? ??????????????????"
                        name="passportNumber"
                        className="mt-4"
                        fullwidth="true"
                        style={{margin: 4}}
                        as={TextField}
                      />

                      <FormikControl
                        control="input"
                        type="text"
                        label="?????? ??????????"
                        name="authority"
                        className="mt-4"
                        fullwidth="true"
                        style={{margin: 4}}
                        as={TextField}
                      />

                      <FormikControl
                        control="date"
                        type="text"
                        label="???????? ????????????"
                        className="mt-4"
                        fullwidth="true"
                        style={{margin: 4}}
                        name="dateOfIssue"
                      />

                      <FormikControl
                        control="date"
                        type="text"
                        label="???????? ????????????????"
                        className="mt-4"
                        fullwidth="true"
                        style={{margin: 4}}
                        name="dateOfExpire"
                      />

                      <FormikControl
                        control="input"
                        type="text"
                        label="?????????? ????????????"
                        className="mt-4"
                        fullwidth="true"
                        style={{margin: 4}}
                        name="placeOfWork"
                        as={TextField}
                      />

                      <FormikControl
                        control="select"
                        component={TextField}
                        type="text"
                        name="info_form"
                        label="???????????? ??????????"
                        placeholder="???????????? ??????????"
                        select
                        displayEmpty
                        fullwidth="true"
                        className="mt-5"
                        style={{margin: 4}}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        options={infoFromOptions}
                        handleChange={handleChange}
                      />

                      <FormikControl
                        control="input"
                        type="text"
                        label="?????????????? ?????????? ??????????????????"
                        className="mt-4"
                        fullwidth="true"
                        style={{margin: 4}}
                        name="contractAmount"
                        as={TextField}
                      />

                      {fetchedCategories ? (
                        <Field
                          name="category"
                          multiple
                          component={Autocomplete}
                          options={fetchedCategories}
                          style={{width: "99%"}}
                          getOptionLabel={(option) => option.title}
                          renderInput={(params) => (
                            <MuiTextField
                              {...params}
                              error={touched["category"] && !!errors["category"]}
                              helperText={touched["category"] && errors["category"]}
                              label="???????????????? ?????????????????? ????????????????"
                              style={{margin: 4}}
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
                        name="klass"
                        label="??????????"
                        placeholder="?????????? ????????????????"
                        select
                        displayEmpty
                        fullwidth="true"
                        className="mt-5"
                        defaultValue={values.klass}
                        style={{margin: 4}}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        options={fetchedKlasses}
                        handleChange={handleChange}
                      />

                      <Button
                        disabled={isSubmitting}
                        type="submit"
                        color="info"
                        className="mt-4"
                        style={{margin: 4}}
                      >
                        ????????????????
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

export default AddStudent;
