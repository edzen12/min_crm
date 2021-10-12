import React from 'react';
import { Field, ErrorMessage } from 'formik';
import {
  Autocomplete,
  ToggleButtonGroup,
  AutocompleteRenderInputParams,
} from 'formik-material-ui-lab';
import { FormGroup } from '@material-ui/core';
import MuiTextField from '@material-ui/core/TextField';


const SelectAutoComplete = (props) => {
  
  const { label, options, name, defaultValue, ...rest } = props;

  return (
    <Field
      name={name}
      fullwidth="true"
      multiple
      component={Autocomplete}
      defaultValue={defaultValue}
      options={options}
      getOptionLabel={(option) => option.label}
      renderInput={(params) => (
        <MuiTextField
          {...rest}
          {...params}
          label={label}
        />
      )}
    />
  )
}

export default SelectAutoComplete;
