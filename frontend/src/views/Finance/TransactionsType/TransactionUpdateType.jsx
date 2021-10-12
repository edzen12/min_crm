import React, { useEffect } from 'react';
import Dashboard from "../../../layouts/Dashboard/Dashboard"
import { useSelector, useDispatch } from 'react-redux';
import { fetchTransactionsDetailAction } from '../../../redux/actions';
import StudentPaymentsEdit from "../StudentPayments/StudentPaymentsEdit/StudentPaymentsEdit";
import ExpensesEdit from "../Expenses/ExpensesEdit/ExpensesEdit";
import IncomesEdit from "../Incomes/IncomesEdit/IncomesEdit";
import Loader from "../../../components/UI/Loader/Loader"

function TransactionsUpdateType(props) {
  const id = props.match.params.id;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchTransactionsDetailAction(id));
  }, [dispatch, id])

  const transaction = useSelector(state => state.finance.transactionsDetail.data && state.finance.transactionsDetail.data);

  if (transaction !== null) {
    return (
      transaction.transaction_type === "STUDENT" ?
        <StudentPaymentsEdit id={transaction.id} /> :
        transaction.transaction_type === "EXPENSE" ?
          <ExpensesEdit id={transaction.id} /> :
          transaction.transaction_type === "INCOME" ?
            <IncomesEdit id={transaction.id} /> :
            <Dashboard>
              <div>
                Ошибка
              </div>
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

export default TransactionsUpdateType;