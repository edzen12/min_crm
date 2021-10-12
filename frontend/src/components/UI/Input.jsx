import React from 'react';
import { Field, ErrorMessage } from 'formik';
import TextError from '../TextError';
import { FormGroup } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';


function Input (props) {
  const {label, placeholder, name, ...rest} = props
  return (
    <Grid item xs={12}>
    <FormGroup>
      <Field name={name} label={label} placeholder={placeholder} {...rest}/>
      <ErrorMessage component={TextError} name={name} />
    </FormGroup>
    </Grid>
  )
}

export default Input;