import React, {useEffect, useState} from "react";
import Dashboard from "../../../../layouts/Dashboard/Dashboard";
import { Form, Formik, Field } from "formik";
import * as Yup from "yup";
import { Row } from "reactstrap";
import FormikControl from "../../../../components/FormikControl";
import { TextField } from "@material-ui/core";
import axios from "../../../../axios/configuratedAxios";
import { useToasts } from 'react-toast-notifications';
import { motion } from "framer-motion";
import Loader from "../../../../components/UI/Loader/Loader";
import { Button } from '@material-ui/core'

function AddWallets() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [loading, setLoading] = useState(false);

  const { addToast } = useToasts();

  const initialValues = {
    name: "",
    balance: "",
    description: "",
    account_number: "",
    privacy: "PRIVATE"
  }

  const validationSchema = Yup.object({
    name: Yup.string().required("Обязательное поле!"),
    balance: Yup.string().required("Обязательное поле!"),
  });

  let formData = new FormData();

  const addWallet = async (formData, resetForm) => {
    try {
      const response = await axios.post(`/finances/wallets/`, formData);
      resetForm()
      setLoading(false)
      addToast("Кошалек создан!", {
        appearance: "success",
        autoDismiss: true
      });

      window.location = ("/wallets")
    } catch (error) {
      setLoading(false)
      let isBalanceError = error.response.data.balance ?? false;
      if(isBalanceError){
        addToast("Требуется численное значение баланса.", {
          appearance: "error",
          autoDismiss: true
        })
      } else {
        addToast("Что-то пошло не так!", {
          appearance: "error",
          autoDismiss: true
        })
      }
    }
  }

  const onSubmit = (values, {resetForm}) => {
    setLoading(true)
    values.name && formData.append("name", values.name);
    values.account_number && formData.append("account_number", values.account_number);
    values.privacy && formData.append("privacy", values.privacy);
    values.balance && formData.append("balance", values.balance);
    values.description && formData.append("description", values.description);
    addWallet(formData, resetForm);
  }

  const privacy = [
    { key: 'PRIVATE', value: 'PRIVATE', label: "Приватный кошелёк" },
    { key: 'PUBLIC', value: 'PUBLIC', label: "Публичный кошелёк" }
  ];

  return (
    <Dashboard>
      {
        loading && <Loader/>
      }
      <motion.div
        layoutId="outline"
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        transition={{ easeInOut: [0, .02, .58, 1], duration: 1 }}
      >
        <Row>
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Добавить кошелёк</h4>
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                >
                  {({ values, touched, errors, isSubmitting, handleChange }) => (
                    <Form className="mt-4">

                      <FormikControl
                        control="input"
                        type="text"
                        label="Наименование кошелька:"
                        name="name"
                        className="mt-4"
                        fullwidth="true"
                        style={{ margin: 4 }}
                        as={TextField}
                      />

                      <FormikControl
                        control="input"
                        type="text"
                        label="Описание"
                        name="description"
                        rows={8}
                        className="mt-4"
                        multiline
                        fullwidth="true"
                        InputLabelProps={{
                        shrink: true,
                      }}
                        style={{ margin: 4 }}
                        as={TextField}
                      />

                      <FormikControl
                        control="input"
                        type="text"
                        label="Сумма"
                        name="balance"
                        className="mt-4"
                        fullwidth="true"
                        style={{ margin: 4 }}
                        as={TextField}
                      />

                      <FormikControl
                        control="input"
                        type="text"
                        label="Номер счета:"
                        name="account_number"
                        className="mt-4"
                        fullwidth="true"
                        style={{ margin: 4 }}
                        as={TextField}
                      />

                      <FormikControl
                        control="select"
                        component={TextField}
                        type="text"
                        name="privacy"
                        label="Приватность"
                        placeholder="Приватность"
                        select
                        variant="outlined"
                        displayEmpty
                        fullwidth="true"
                        className="mt-4"
                        style={{ margin: 4 }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        options={privacy}
                        handleChange={handleChange}
                      />

                      <Button
                        type="submit"
                        color="primary"
                        variant="contained"
                        style={{ margin: 4 }}
                        className="mt-4"
                      >
                        Создать
                      </Button>

                      {/* <pre className="mt-4">{JSON.stringify(values, null, 2)}</pre>
                      <pre>{JSON.stringify(errors, null, 2)}</pre> */}
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </Row>
      </motion.div>
    </Dashboard>
  );
}

export default AddWallets;
