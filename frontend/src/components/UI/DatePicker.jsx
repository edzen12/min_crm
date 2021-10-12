import React from 'react'
import { Field, ErrorMessage } from 'formik'
import TextError from '../TextError';
import { FormGroup } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { ru } from "date-fns/locale";

function DatePicker (props) {
  const { label, name, ...rest } = props
  return (
    <FormGroup>
      <Field name={name}>
        {({ form, field }) => {
          const { setFieldValue } = form
          const { value } = field
          return (
            <MuiPickersUtilsProvider 
              utils={DateFnsUtils}
              locale={ru}
              >
            <KeyboardDatePicker
              format="dd/MM/yyyy"
              id={name}
              {...field}
              {...rest}
              label={label}
              value={value}
              onChange={val => setFieldValue(name, val)}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
            </MuiPickersUtilsProvider>
          )
        }}
      </Field>
      <ErrorMessage component={TextError} name={name} />
    </FormGroup>
  )
}

export default DatePicker