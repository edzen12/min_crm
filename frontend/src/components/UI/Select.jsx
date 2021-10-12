import React from 'react';
import { Field, ErrorMessage } from 'formik';
import TextError from '../TextError';
import { FormGroup, MenuItem } from '@material-ui/core';

function Select (props) {
  const { name, options, handleChange, ...rest} = props
  return (
    <FormGroup className="w-100">
      <Field name={name} {...rest} onChange={handleChange(name)}>
      {
        options.length ? options.map((option, index) => {
          return (
            <MenuItem key={index} value={option.value}>
              {option.label}
            </MenuItem>
          )
        }) : <MenuItem disabled={true}>
            Пусто
          </MenuItem>}
      </Field>
    
      <ErrorMessage component={TextError} name={name} />
    </FormGroup>
  )
}

export default Select;

