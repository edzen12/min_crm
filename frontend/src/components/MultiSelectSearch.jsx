import React from "react";
import { Form, Formik, Field } from "formik";
import MuiTextField from "@material-ui/core/TextField";
import { Autocomplete } from "formik-material-ui-lab";
import { CircularProgress, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  inputLoader: {
    position: "absolute",
    right: 40,
    top: "37%",
  },
}));

export default function MultiSelectSearch(props) {
  const {
    options,
    getOptionLabel,
    name,
    label,
    touched,
    errors,
    loading,
    value,
    onChange,
    onBlur,
    multiple
  } = props;
  const classes = useStyles();

  return (
    <div style={{ position: "relative" }}>
      <Field
        name={name}
        multiple={multiple}
        component={Autocomplete}
        options={options}
        style={{ width: "99%" }}
        getOptionLabel={getOptionLabel}
        renderInput={(params) => (
          <MuiTextField
            {...params}
            error={touched[name] && !!errors[name]}
            helperText={touched[name] && errors[name]}
            label={label}
            variant="outlined"
            style={{ margin: 4 }}
            className="mt-4"
            value={value}
            onChange={onChange}
            onBlur={onBlur}
          />
        )}
      />
      {loading && <CircularProgress className={classes.inputLoader} />}
    </div>
  );
}
