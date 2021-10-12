import React from 'react'
import { Field, ErrorMessage } from 'formik'
import TextError from '../TextError';
import { FormGroup } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: 'none',
  },
}));
function UploadFile(props) {
  const { label, name, accept, ...rest } = props
  const classes = useStyles();
  return (
    <FormGroup>
      <Field name={name}>
        {({ form, field }) => {
          const { setFieldValue } = form
          return (
            <>
              <input
                accept={accept}
                className={classes.input}
                id={name}
                label={label}
                onChange={e => setFieldValue(name, e.target.files[0])}
                multiple={false}
                type="file"
              />
              <label
                id={name}
                {...field}
                {...rest}
                label={label}
                htmlFor={name}
              >
                <Button variant="contained" color="primary" component="span">
                  {label}
                </Button>
              </label>
            </>
          )
        }}
      </Field>

      <ErrorMessage component={TextError} name={name} />
    </FormGroup>
  )
}

export default UploadFile