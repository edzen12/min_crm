import React from 'react';
import { DateRange } from 'react-date-range';
import { FormGroup } from '@material-ui/core';
import { Field } from 'formik';

const RangePicker = (props) => {
  
  const { label, name, ...rest } = props;
  
  return (
    <FormGroup>
      <Field name={name}>
        {({ form, field }) => {
          const { setFieldValue } = form;
          const { value } = field;
          return (
            <DateRange
              {...rest} 
              editableDateInputs={true}
              onChange={val => setFieldValue(name, val.selection)}
              moveRangeOnFirstSelection={false}
              ranges={value}
            />
          )
        }}
      </Field>
    </FormGroup>
  )
}

export default RangePicker;