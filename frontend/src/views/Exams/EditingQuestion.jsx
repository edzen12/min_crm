import React, { useState, useEffect } from "react";
import { Row } from "reactstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import FormikControl from "../../components/FormikControl";
import {
  FormGroup,
  TextField,
  MenuItem,
  Grid,
  Radio,
  IconButton,
  FormControl,
  FormControlLabel,
} from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import ShortTextIcon from "@material-ui/icons/ShortText";
import SubjectIcon from "@material-ui/icons/Subject";
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import BackupIcon from "@material-ui/icons/Backup";
import EventIcon from "@material-ui/icons/Event";
import TextError from "../../components/TextError";
import ClearIcon from "@material-ui/icons/Clear";
import DeleteIcon from "@material-ui/icons/Delete";
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

const EditingQuestion = (props) => {
  const {
    index,
    values,
    orderNumber,
    questionTypeOptions,
    handleChange,
    setFieldValue,
  } = props;

  return (
    <Row className="col-12 mb-4">
      <div className="card w-100" style={{ borderLeft: "7px solid #4285F4" }}>
        <div className="card-body d-md-flex">
          <h5 className="card-title px-0">{orderNumber}</h5>
          <div className="col-md-6 mt-lg-4 px-0 pr-md-2">
            <FormikControl
              control="input"
              type="text"
              label="Вопрос"
              name={`questions[${index}].title`}
              fullwidth="true"
              variant="outlined"
              multiline
              style={{ margin: 4 }}
              as={TextField}
              className="mt-4"
              key={index}
            />

            {values.questions[index].question_type === "ST" ? (
              <Grid item xs={12}>
                <FormGroup>
                  <TextField
                    placeholder="Краткий ответ"
                    type="text"
                    style={{ margin: 4 }}
                    fullwidth="true"
                    className="mt-4"
                    disabled={true}
                  />
                </FormGroup>
              </Grid>
            ) : values.questions[index].question_type === "LT" ? (
              <Grid item xs={12}>
                <FormGroup>
                  <TextField
                    placeholder="Развернутый ответ"
                    type="text"
                    style={{ margin: 4 }}
                    fullwidth="true"
                    className="mt-4"
                    disabled={true}
                  />
                </FormGroup>
              </Grid>
            ) : values.questions[index].question_type === "R" ? (
              <>
                <div className="mt-4 d-flex-column">
                  {values.questions[index].answers.map(
                    (option, optionIndex) => (
                      <div className="align-items-center mt-3 w-100">
                        <Radio
                          type="radio"
                          color="primary"
                          value={option.title}
                          label={option.title}
                          onClick={() => {
                            setFieldValue(
                              `questions[${index}].answers`,
                              values.questions[
                                index
                              ].answers.map((answer, index) =>
                                index === optionIndex
                                  ? { ...answer, is_correct: true }
                                  : { ...answer, is_correct: false }
                              )
                            );
                          }}
                          checked={option.is_correct}
                        />
                        <Field
                          className="mt-1"
                          style={{ width: "65%" }}
                          as={TextField}
                          name={`questions[${index}].answers[${optionIndex}].title`}
                        />
                        <IconButton
                          aria-label="delete"
                          onClick={() => {
                            setFieldValue(
                              `questions[${index}].answers`,
                              values.questions[index].answers.filter(
                                (_, index) => index !== optionIndex
                              )
                            );
                          }}
                        >
                          <ClearIcon />
                        </IconButton>
                      </div>
                    )
                  )}
                </div>

                <div className="mt-3">
                  <Radio
                    type="radio"
                    value="Добавить новый вариант"
                    disabled={true}
                  />
                  <TextField
                    style={{ width: "65%" }}
                    onClick={() => {
                      if (values.questions[index].answers.length === 5) {
                        alert("Не больше пяти вариантов!");
                      } else {
                        setFieldValue(`questions[${index}].answers`, [
                          ...values.questions[index].answers,
                          {
                            title: `Вариант ${
                              values.questions[index].answers.length + 1
                            }`,
                            is_correct: false,
                          },
                        ]);
                      }
                    }}
                    placeholder="Добавить новый вариант"
                  />
                </div>
              </>
            ) : values.questions[index].question_type === "C" ? (
              <>
                <div className="mt-4 d-block">
                  <FormControl component="fieldset" className="d-block">
                    {values.questions[index].answers.map(
                      (option, optionIndex) => (
                        <FormControlLabel
                          key={optionIndex}
                          className="d-block"
                          control={
                            <Checkbox
                              value={option.title}
                              checked={option.is_correct}
                              color="primary"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  // arrayHelper.push(option.value);
                                  setFieldValue(
                                    `questions[${index}].answers`,
                                    values.questions[
                                      index
                                    ].answers.map((answer, index) =>
                                      index === optionIndex
                                        ? { ...answer, is_correct: true }
                                        : { ...answer }
                                    )
                                  );
                                } else {
                                  // let idx = arrayHelper.indexOf(option.value);
                                  // arrayHelper.splice(idx, 1);
                                  setFieldValue(
                                    `questions[${index}].answers`,
                                    values.questions[
                                      index
                                    ].answers.map((answer, index) =>
                                      index === optionIndex
                                        ? { ...answer, is_correct: false }
                                        : { ...answer }
                                    )
                                  );
                                }
                              }}
                              name={`questions[${index}].answers[${optionIndex}].title`}
                            />
                          }
                          label={
                            <>
                              <Field
                                className="mt-1"
                                style={{ width: "65%" }}
                                as={TextField}
                                name={`questions[${index}].answers[${optionIndex}].title`}
                              />
                              <IconButton
                                aria-label="delete"
                                onClick={() => {
                                  setFieldValue(
                                    `questions[${index}].answers`,
                                    values.questions[index].answers.filter(
                                      (_, index) => index !== optionIndex
                                    )
                                  );
                                }}
                              >
                                <ClearIcon />
                              </IconButton>
                            </>
                          }
                        />
                      )
                    )}
                  </FormControl>
                </div>

                <div className="mt-3">
                  <FormControlLabel
                    control={<Checkbox disabled={true} />}
                    label={
                      <TextField
                        onClick={() => {
                          if (values.questions[index].answers.length === 5) {
                            alert("Не больше пяти вариантов!");
                          } else {
                            setFieldValue(`questions[${index}].answers`, [
                              ...values.questions[index].answers,
                              {
                                title: `Вариант ${
                                  values.questions[index].answers.length + 1
                                }`,
                                is_correct: false,
                              },
                            ]);
                          }
                        }}
                        placeholder="Добавить новый вариант"
                      />
                    }
                  />
                </div>
              </>
            ) : null}
          </div>

          <div className="col-md-6 px-0 pl-md-2">
            <FormGroup className="w-100">
              <Field
                component={TextField}
                type="text"
                name={`questions[${index}].question_type`}
                label="Тип вопроса"
                placeholder="Тип вопроса"
                select
                fullwidth="true"
                className="mt-5"
                variant="outlined"
                defaultValue={values.questions[index].question_type}
                style={{ margin: 4 }}
                // InputLabelProps={{
                //   shrink: true,
                // }}
                onChange={(e) => {
                  setFieldValue(
                    `questions[${index}].question_type`,
                    e.target.value
                  );
                  switch (e.target.value) {
                    case "R":
                      setFieldValue(`questions[${index}].answers`, [
                        {
                          title: "Вариант 1",
                          is_correct: false,
                        },
                      ]);
                    case "C":
                      setFieldValue(`questions[${index}].answers`, [
                        {
                          title: "Вариант 1",
                          is_correct: false,
                        },
                      ]);
                      break;
                    default:
                      setFieldValue(`questions[${index}].answers`, []);
                      break;
                  }
                }}
              >
                {questionTypeOptions.map((option) =>
                  option.value === "ST" ? (
                    <MenuItem
                      className="mt-3"
                      key={option.value}
                      value={option.value}
                    >
                      <ShortTextIcon /> &nbsp; {option.label}
                    </MenuItem>
                  ) : option.value === "LT" ? (
                    <MenuItem
                      className="mt-3"
                      key={option.value}
                      value={option.value}
                    >
                      <SubjectIcon /> &nbsp; {option.label}
                    </MenuItem>
                  ) : option.value === "R" ? (
                    <MenuItem
                      className="mt-3"
                      key={option.value}
                      value={option.value}
                    >
                      <RadioButtonCheckedIcon /> &nbsp; {option.label}
                    </MenuItem>
                  ) : option.value === "C" ? (
                    <MenuItem
                      className="mt-3"
                      key={option.value}
                      value={option.value}
                    >
                      <CheckBoxIcon /> &nbsp; {option.label}
                    </MenuItem>
                  ) : option.value === "F" ? (
                    <MenuItem
                      className="mt-3"
                      key={option.value}
                      value={option.value}
                    >
                      <BackupIcon /> &nbsp; {option.label}
                    </MenuItem>
                  ) : option.value === "D" ? (
                    <MenuItem
                      className="mt-3"
                      key={option.value}
                      value={option.value}
                    >
                      <EventIcon /> &nbsp; {option.label}
                    </MenuItem>
                  ) : null
                )}
              </Field>

              {/* <pre>{JSON.stringify(props.values, 0, 2)}</pre> */}

              <ErrorMessage component={TextError} name="question_type" />
            </FormGroup>

            <IconButton
              aria-label="delete-question"
              className="mt-2"
              style={{ marginLeft: "auto", display: "flex" }}
              onClick={() => {
                setFieldValue(
                  "questions",
                  values.questions.filter((_, q_index) => q_index !== index)
                );
              }}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        </div>
      </div>
    </Row>
  );
};

export default EditingQuestion;
