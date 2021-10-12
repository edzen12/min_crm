import React from 'react'
import { Field, ErrorMessage } from 'formik'
import TextError from '../TextError';
import { FormGroup } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
} from '@material-ui/pickers';

function TimePicker(props) {
  const { label, name, ...rest } = props
  return (
    <FormGroup>
      <Field name={name}>
        {({ form, field }) => {
          const { setFieldValue } = form
          const { value } = field
          return (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardTimePicker
                id={name}
                {...field}
                {...rest}
                label={label}
                value={value}
                ampm={false}
                onChange={val => setFieldValue(name, val)}
                KeyboardButtonProps={{
                  'aria-label': 'change time',
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

export default TimePicker