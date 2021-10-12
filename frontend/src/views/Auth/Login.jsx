import React, { useState } from "react";
import { Row } from "reactstrap";
import { TextField, Button, Typography, CircularProgress } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { authenticationService } from "../../jwt/_services";
import { Redirect } from 'react-router-dom'
import FormikControl from "../../components/FormikControl";
import { makeStyles } from '@material-ui/core/styles';
import styles from './Login.module.scss'
import {useDispatch} from "react-redux";


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
  },
}));

function Login(props) {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false);
  const [alertError, setAlertError] = useState(false);
  const classes = useStyles();

  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object({
    username: Yup.string().required("Обязательное поле!"),
    password: Yup.string().required("Обязательное поле!"),
  });

  const onSubmit = (values, actions) => {
    actions.setStatus();
    if (!loading) {
      setLoading(true);
    }

    authenticationService.login(values.username, values.password, dispatch).then(
      (user) => {
        const { from } = props.location.state || {
          from: { pathname: "/" },
        };
        props.history.push(from);
        setLoading(false);
      },
      (error) => {
        actions.setSubmitting(false);
        actions.setStatus(error);
        setAlertError(true);
        actions.resetForm({ values: "" });
        setLoading(false);
      }
    );
  }

  if (authenticationService.isUserAuth()) return <Redirect to="/" />;


  return (
    <div className="container-fluid">
      <Row>
        <div className="col-lg-5 col-md-8 col-sm-12 mx-auto">
          <div className={['card', 'mt-5', 'py-3', 'px-2', styles.Card].join(' ')}>
            <div className="card-body">
              <Typography variant="h5" className="mb-1">
                Войти в систему
              </Typography>

              <Typography variant="body1" color="textSecondary">
                Введите ваш email и пароль
              </Typography>

              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
              >
                {formProps => (

                  <Form className={['mt-4', styles.Form].join(' ')}>

                    <FormikControl
                      control="input"
                      type="email"
                      id="outlined-full-width"
                      label="Электронный адрес"
                      placeholder="Введите ваш электронный адрес"
                      fullwidth="true"
                      name="username"
                      style={{ margin: 4 }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant="outlined"
                      as={TextField}
                    />

                    <FormikControl
                      control="input"
                      type="password"
                      id="outlined-full-width"
                      label="Пароль"
                      placeholder="Введите пароль"
                      fullwidth="true"
                      name="password"
                      className="mt-4"
                      style={{ margin: 4 }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant="outlined"
                      as={TextField}
                    />

                    { alertError && <Alert style={{ margin: 8 }} className="mb-3" severity="error">Неверный email или пароль!</Alert>}

                    <div className={classes.wrapper}>
                      <Button
                        disabled={formProps.isSubmitting}
                        type="submit"
                        variant="contained"
                        color="primary"
                      >
                        Войти
                    </Button>
                      {loading && <CircularProgress className={classes.buttonProgress} />}
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </Row>
    </div>
  );
}

export default Login;
