import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWalletDetailAction } from "../../../../redux/actions/index"
import Dashboard from "../../../../layouts/Dashboard/Dashboard";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { Row } from "reactstrap";
import { Button as StrapBtn } from "reactstrap"
import FormikControl from "../../../../components/FormikControl";
import { TextField } from "@material-ui/core";
import axios from "../../../../axios/configuratedAxios";
import { useToasts } from 'react-toast-notifications';
import { motion } from "framer-motion";
import Loader from '../../../../components/UI/Loader/Loader';


function WalletsEdit(props) {

  const walletsDetailId = props.match.params.id;

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true)
  useEffect(() => {
    dispatch(fetchWalletDetailAction(walletsDetailId))
    .then(()=>setLoading(false))
    window.scrollTo(0, 0);
  }, []);

  const { addToast } = useToasts();

  const fetchedValues = useSelector(state => state.finance.walletDetail.data)

  const validationSchema = Yup.object({

  });

  let formData = new FormData();

  const editWallet = async (formData, resetForm) => {
    try {
      const response = await axios.put(`/finances/wallets/${walletsDetailId}/`, formData);
      resetForm()
      window.location = "/wallets"
    } catch (error) {
      console.log(error.response)
    }
  }

  const onSubmit = (values, {resetForm}) => {
    values.name && formData.append("name", values.name);
    values.account_number && formData.append("account_number", values.account_number);
    values.privacy && formData.append("privacy", values.privacy);
    values.balance && formData.append("balance", values.balance);
    values.description && formData.append("description", values.description);

    editWallet(formData, resetForm);
    addToast("Кошелёк изменен!", {
      appearance: "success",
      autoDismiss: true
    });
    props.setFirstStep(true);
  }

  const privacy = [
    { key: 'PRIVATE', value: 'PRIVATE', label: "Приватный кошелёк" },
    { key: 'PUBLIC', value: 'PUBLIC', label: "Публичный кошелёк" }
  ];

  return (
    <Dashboard>
      {loading &&
        <Loader />
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
                <h4 className="card-title">Изменить кошелек</h4>
                {fetchedValues && <Formik
                  initialValues={fetchedValues}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                >
                  {({ values, errors, isSubmitting, handleChange }) => (
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
                        className="mt-4"
                        multiline
                        rows={8}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullwidth="true"
                        style={{ margin: 4 }}
                        as={TextField}
                      />

                      <FormikControl
                        control="input"
                        type="text"
                        label="Баланс"
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
                        defaultValue={fetchedValues ? fetchedValues.privacy : null}
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

                      <StrapBtn
                        type="submit"
                        color="primary"
                        style={{ margin: 4, display: "block" }}
                        className="mt-4"
                      >
                        Изменить
                      </StrapBtn>

                      {/* <pre className="mt-4">{JSON.stringify(values, null, 2)}</pre>
                      <pre>{JSON.stringify(errors, null, 2)}</pre> */}
                    </Form>
                  )}
                </Formik>}
              </div>
            </div>
          </div>
        </Row>
      </motion.div>
    </Dashboard>
  );
}

export default WalletsEdit;
