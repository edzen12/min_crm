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
  Typography,
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
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";

const Question = (props) => {
  const {
    index,
    values,
    orderNumber,
    questionTypeOptions,
    handleChange,
    setFieldValue,
    setEditingQuestion,
  } = props;

  return (
    <Row className="col-12 mb-4">
      <div className="card w-100" onClick={() => setEditingQuestion(index)}>
        <div className="card-body d-md-flex">
          <h6 className="card-title px-0">{orderNumber}</h6>
          <div className="col-md-6 mt-lg-4 px-0 pr-md-2">
            {/* <Typography 
              variant="h6" 
              className="mt-2" 
              style={{ margin: 4, whiteSpace: "pre-line" }}>
              {values.questions[index].title}
            </Typography> */}

            <pre 
              className="mt-2"
              style={{
                fontSize: "1rem",
                fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                fontWeight: 500,
                lineHeight: 1.6,
                letterSpacing: "0.0075em"
              }}
              >
            {values.questions[index].title}
            </pre>

            {values.questions[index].question_type === "ST" ? (
              <Grid item xs={12}>
                <FormGroup>
                  <TextField
                    placeholder="Краткий ответ"
                    type="text"
                    style={{ margin: 4 }}
                    fullwidth="true"
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
                    disabled={true}
                  />
                </FormGroup>
              </Grid>
            ) : values.questions[index].question_type === "R" ? (
              <>
                <div className="mt-4 d-flex-column">
                  {values.questions[index].answers.map(
                    (option, optionIndex) => (
                      <div className="align-items-center d-flex mt-3 w-100" key={optionIndex}>
                        <Radio type="radio" color="primary" disabled={true} />
                        <Typography variant="body2">
                          {values.questions[index].answers[optionIndex].title}
                        </Typography>
                      </div>
                    )
                  )}
                </div>
              </>
            ) : values.questions[index].question_type === "C" ? (
              <div className="mt-4 d-block">
                <FormControl component="fieldset" className="d-block">
                  {values.questions[index].answers.map(
                    (option, optionIndex) => (
                      <div className="align-items-center d-flex mt-3 w-100" key={optionIndex}>
                          <Checkbox
                            disabled={true}
                          />
                          <Typography variant="body2">
                            {values.questions[index].answers[optionIndex].title}
                          </Typography>
                      </div>
                    )
                  )}
                </FormControl>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </Row>
  );
};

export default Question;
