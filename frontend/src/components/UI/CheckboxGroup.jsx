import React from 'react';
import { Field, ErrorMessage } from 'formik'
import TextError from '../TextError';
import { FormLabel, FormControl, FormControlLabel } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';


function CheckboxGroup (props) {
  const { label, name, options, arrayHelper, style, color, ...rest } = props

  return (
    <FormControl component="fieldset" style={style} className="mt-5 d-block">
      <FormLabel className="d-block">{label}</FormLabel>
      <Field name={name}>
        {({ form, field }) => {

          const { setFieldValue } = form

          return options.map(option => {
            return (
              <FormControlLabel
                {...rest}
                {...field}
                key={option.key}
                className="d-block"
                control={
                <Checkbox
                  value={option.value}
                  id={option.value}
                  checked={field.value.includes(option.value)}
                  color={color}
                  onChange={e => {
                      if (e.target.checked) {
                        arrayHelper.push(option.value);
                        setFieldValue(name, arrayHelper);
                      } else {
                        let idx = arrayHelper.indexOf(option.value);
                        arrayHelper.splice(idx, 1);
                        setFieldValue(name, arrayHelper);
                      }
                  }}
                  name={option.key} 
                  />
                }
                label={option.key}
              />
            )
          })
        }}
      </Field>
      <ErrorMessage component={TextError} name={name} />
    </FormControl>
  )
}

export default CheckboxGroup