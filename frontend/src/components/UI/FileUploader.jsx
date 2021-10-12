import React from "react";
import { Field, ErrorMessage } from "formik";
import TextError from '../TextError';
import { TextField } from "@material-ui/core";
import { FormGroup } from "@material-ui/core";
import Button from '@material-ui/core/Button';


const FileUploader = (props) => {
  const { label, name, ...rest } = props;

  return (
    <FormGroup className="w-100">
      <Field name={name}>
        {({ form, field }) => {
          const { setFieldValue } = form;

          return (
              <TextField
                {...rest}
                InputLabelProps={{
                  shrink: true,
                }}
                id={name}
                label={label}
                variant="outlined"
                style={{ margin: 4 }}
                fullwidth="true"
                type="file"
                onChange={(event) => {
                  setFieldValue(name, event.currentTarget.files[0]);
                }}
              />
          );
        }}
      </Field>
      <ErrorMessage component={TextError} name={name} />
    </FormGroup>
  );
};

export default FileUploader;
