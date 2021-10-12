import React from "react";
import { Field, ErrorMessage } from "formik";
import TextError from "../TextError";
import { FormGroup, TextField } from "@material-ui/core";
import InputMask from "react-input-mask";

function FormikMaskedInput({...props}) {
  // const { label, name, mask, ...rest } = props;
  return (
    <FormGroup>
      {/* <label htmlFor={name}>{label}</label> */}
     

      <Field name={props.name} id={props.name}>
        {({field}) => (
          <InputMask {...field} mask={props.mask}>
            {(innerProps) => ( 
              <TextField 
                {...innerProps}
                style={props.style}
                className={props.className}
                label={props.label} 
                />
            )}
          </InputMask>
        )}
      </Field>
      <ErrorMessage component={TextError} name={props.name} />
    </FormGroup>
  );
}

export default FormikMaskedInput;
