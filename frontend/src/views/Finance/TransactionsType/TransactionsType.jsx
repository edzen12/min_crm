import React, { useEffect } from 'react';
import Dashboard from "../../../layouts/Dashboard/Dashboard"
import { useSelector, useDispatch } from 'react-redux';
import {fetchTransactionsDetailAction, setBreadcrumbs} from '../../../redux/actions';
import StudentPaymentDetail from "../StudentPayments/StudentPaymentsDetail/StudentPaymentsDetail.jsx";
import ExpensesDetail from "../Expenses/ExpensesDetail/ExpensesDetail.jsx";
import IncomesDetail from "../Incomes/IncomesDetail/IncomesDetail.jsx";
import Loader from "../../../components/UI/Loader/Loader"

function TransactionsType(props) {
  const id = props.match.params.id;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchTransactionsDetailAction(id));
  }, [])

  const transaction = useSelector(state => state.finance.transactionsDetail.data && state.finance.transactionsDetail.data);

  useEffect(() => {
    transaction && dispatch(setBreadcrumbs(
      [
        {title: "Транзакции", to: "/transactions"},
        {title: transaction.title, to: ""},
      ]
    ))
  }, [transaction]);

  if (transaction !== null) {
    return (
      transaction.transaction_type === "STUDENT" ?
        <StudentPaymentDetail id={transaction.id} /> :
        transaction.transaction_type === "EXPENSE" ?
          <ExpensesDetail id={transaction.id} /> :
          transaction.transaction_type === "INCOME" ?
            <IncomesDetail id={transaction.id} /> :
            <Dashboard>
              <Loader/>
            </Dashboard>
    )
  } else {
    return (
      <Dashboard>
        <Loader />
      </Dashboard>
    )
  }
}

export default TransactionsType;