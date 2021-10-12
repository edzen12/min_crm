import React from 'react'
import { Field, ErrorMessage } from 'formik'
import TextError from '../TextError';
import { FormGroup } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from '@material-ui/pickers';

function DatePicker (props) {
  const { label, name, ...rest } = props
  return (
    <>
      <Field name={name}>
        {({ form, field }) => {
          const { setFieldValue } = form
          const { value } = field
          return (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDateTimePicker
              format="dd/mm/yyyy HH:mm"
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
    </>
  )
}

export default DatePicker