import React from 'react';
import { Field, ErrorMessage } from 'formik';
import TextError from '../TextError';
import { FormLabel, Radio } from "@material-ui/core";


function RadioButtons (props) {
  const { label, name, options, ...rest } = props;
  return (
    <div className="mt-5">
      <FormLabel component="legend" className="mb-0">{label}</FormLabel>
      <br/>
      <Field name={name}>
        {({ field }) => {
          return options.map(option => {
            return (
              <React.Fragment key={option.key}>
                <Radio 
                  type="radio"
                  id={option.value}
                  {...field}
                  {...rest}
                  value={option.value}
                  label={option.key}
                  checked={field.value === option.value}
                />
                <label>{option.key}</label>
              </React.Fragment>
            )
          })
        }}
      </Field>
      <ErrorMessage component={TextError} name={name} />
    </div>
  )
}

export default RadioButtons;