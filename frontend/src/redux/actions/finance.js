import axios from "../../axios/configuratedAxios";
import {
    fetchCourseDetailAction,
    fetchStudentDetailAction,
    fetchStudentsListAction,
} from "./index"
import {
    TRANSACTIONS_LIST_GET_REQUEST,
    TRANSACTIONS_LIST_GET_REQUEST_ERROR,
    TRANSACTIONS_DETAIL_GET_REQUEST,
    TRANSACTIONS_DETAIL_GET_REQUEST_ERROR,
    CLEAR_TRANSACTIONS,

    EXPENSES_LIST_GET_REQUEST,
    EXPENSES_LIST_GET_REQUEST_ERROR,
    EXPENSES_DETAIL_GET_REQUEST,
    EXPENSES_DETAIL_GET_REQUEST_ERROR,

    WALLET_LIST_GET_REQUEST,
    WALLET_LIST_GET_REQUEST_ERROR,
    WALLET_DETAIL_GET_REQUEST,
    WALLET_DETAIL_GET_REQUEST_ERROR,

    INCOMES_LIST_GET_REQUEST_ERROR,
    INCOMES_LIST_GET_REQUEST,
    INCOMES_DETAIL_GET_REQUEST,
    INCOMES_DETAIL_GET_REQUEST_ERROR,

    STUDENT_PAYMENTS_LIST_GET_REQUEST_ERROR,
    STUDENT_PAYMENTS_LIST_GET_REQUEST,
    STUDENT_PAYMENTS_DETAIL_GET_REQUEST,
    STUDENT_PAYMENTS_DETAIL_GET_REQUEST_ERROR,

    EXPENSES_TAGS_GET_REQUEST,
    EXPENSES_TAGS_GET_REQUEST_ERROR,
} from "./actionTypes";

export function fetchTransactionsListAction(url) {
    return async(dispatch) => {
        try {
            const response = await axios.get(url);
            dispatch(transactionsListAction(response.data));
        } catch (error) {
            dispatch(transactionsListActionError(error));
        }
    };
}

export function fetchPageTransactions(url) {
    return async(dispatch) => {
        try {
            const response = await axios.get(url);
            dispatch(transactionsListAction(response.data));
        } catch (error) {
            dispatch(transactionsListActionError(error));
        }
    };
}

export function fetchOrderedTransactions(url) {
    return async (dispatch, getState) => {
        try {
            const transactionsData = getState().finance.transactionsList.data;
            const response = await axios.get(url);
            const updatedTransactions = {
                ...transactionsData,
                results: [...transactionsData.results.slice(0, 20), ...response.data.results],
                next: response.data.next
            };
            dispatch(transactionsListAction(updatedTransactions));
        } catch (error) {
            dispatch(transactionsListActionError(error));
        }
    };
}

export function transactionsListAction(transactionsList) {
    return {
        type: TRANSACTIONS_LIST_GET_REQUEST,
        transactionsList: transactionsList,
    };
}

export function transactionsListActionError(error) {
    return {
        type: TRANSACTIONS_LIST_GET_REQUEST_ERROR,
        error: error,
    };
}

export function clearTransaction() {
    return {
        type: CLEAR_TRANSACTIONS,
    };
}

export function fetchTransactionsDetailAction(id) {
    return async(dispatch) => {
        try {
            const response = await axios.get(`finances/transactions/${id}`);
            dispatch(transactionsDetailAction(response.data));
            response.data.wallet && dispatch(fetchWalletDetailAction(response.data.wallet));
            response.data.wallet && dispatch(fetchWalletListAction());
            response.data.course && dispatch(fetchCourseDetailAction(response.data.course));
            response.data.student && dispatch(fetchStudentDetailAction(response.data.student))
            response.data.student && dispatch(fetchStudentsListAction())


        } catch (error) {
            dispatch(transactionsDetailActionError(error));
        }
    };
}

export function transactionsDetailAction(transactionsDetail) {
    return {
        type: TRANSACTIONS_DETAIL_GET_REQUEST,
        transactionsDetail: transactionsDetail,
    };
}

export function transactionsDetailActionError(error) {
    return {
        type: TRANSACTIONS_DETAIL_GET_REQUEST_ERROR,
        error: error,
    };
}

//////////////////////////////////////////////////////////////////////
export function fetchExpensesAction() {
    return async(dispatch) => {
        try {
            const response = await axios.get("finances/expenses/");
            dispatch(expensesListAction(response.data));
            dispatch(fetchWalletListAction());
        } catch (error) {
            dispatch(expensesListActionError(error));
        }
    };
}

export function expensesListAction(expensesList) {
    return {
        type: EXPENSES_LIST_GET_REQUEST,
        expensesList: expensesList,
    };
}

export function expensesListActionError(error) {
    return {
        type: EXPENSES_LIST_GET_REQUEST_ERROR,
        error: error,
    };
}
export function fetchExpensesDetailAction(id) {
    return async(dispatch) => {
        try {
            const response = await axios.get(`finances/expenses/${id}`);
            dispatch(expensesDetailAction(response.data));
            response.data.wallet && dispatch(fetchWalletDetailAction(response.data.wallet));

        } catch (error) {
            dispatch(expensesDetailActionError(error));
        }
    };
}

export function expensesDetailAction(expenseDetail) {
    return {
        type: EXPENSES_DETAIL_GET_REQUEST,
        expenseDetail: expenseDetail,
    };
}

export function expensesDetailActionError(error) {
    return {
        type: EXPENSES_DETAIL_GET_REQUEST_ERROR,
        error: error,
    };
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function fetchIncomesAction() {
    return async(dispatch) => {
        try {
            const response = await axios.get("finances/incomes/");
            dispatch(incomesListAction(response.data));
        } catch (error) {
            dispatch(incomesListActionError(error));
        }
    };
}
export function incomesListAction(incomesList) {
    return {
        type: INCOMES_LIST_GET_REQUEST,
        incomesList: incomesList,
    };
}

export function incomesListActionError(error) {
    return {
        type: INCOMES_LIST_GET_REQUEST_ERROR,
        error: error,
    };
}
export function fetchIncomesDetailAction(id) {
    return async(dispatch) => {
        try {
            const response = await axios.get(`finances/incomes/${id}`);
            dispatch(incomesDetailAction(response.data));
            response.data.wallet && dispatch(fetchWalletDetailAction(response.data.wallet));

        } catch (error) {
            dispatch(incomesDetailActionError(error));
        }
    };
}

export function incomesDetailAction(incomesDetail) {
    return {
        type: INCOMES_DETAIL_GET_REQUEST,
        incomesDetail: incomesDetail,
    };
}

export function incomesDetailActionError(error) {
    return {
        type: INCOMES_DETAIL_GET_REQUEST_ERROR,
        error: error,
    };
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function fetchStudentPaymentsAction() {
    return async(dispatch) => {
        try {
            const response = await axios.get("finances/student-payments/");
            dispatch(studentPaymentsListAction(response.data));
        } catch (error) {
            dispatch(studentPaymentsListActionError(error));
        }
    };
}
export function studentPaymentsListAction(studentPaymentsList) {
    return {
        type: STUDENT_PAYMENTS_LIST_GET_REQUEST,
        studentPaymentsList: studentPaymentsList,
    };
}

export function studentPaymentsListActionError(error) {
    return {
        type: STUDENT_PAYMENTS_LIST_GET_REQUEST_ERROR,
        error: error,
    };
}
export function fetchStudentPaymentsDetailAction(id) {
    return async(dispatch) => {
        try {
            const response = await axios.get(`finances/student-payments/${id}`);
            dispatch(studentPaymentsDetailAction(response.data));
            response.data.course && dispatch(fetchCourseDetailAction(response.data.course));
            response.data.wallet && dispatch(fetchWalletDetailAction(response.data.wallet));
        } catch (error) {
            dispatch(studentPaymentsDetailActionError(error));
        }
    };
}

export function studentPaymentsDetailAction(studentPaymentsDetail) {
    return {
        type: STUDENT_PAYMENTS_DETAIL_GET_REQUEST,
        studentPaymentsDetail: studentPaymentsDetail,
    };
}

export function studentPaymentsDetailActionError(error) {
    return {
        type: STUDENT_PAYMENTS_DETAIL_GET_REQUEST_ERROR,
        error: error,
    };
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////
export function fetchWalletListAction(url) {
    return async(dispatch) => {
        try {
            const response = await axios.get(`finances/wallets/`);
            dispatch(walletListAction(response.data));
        } catch (error) {
            dispatch(walletListActionError(error));
        }
    };
}

export function walletListAction(wallet) {
    return {
        type: WALLET_LIST_GET_REQUEST,
        walletsList: wallet,
    };
}

export function walletListActionError(error) {
    return {
        type: WALLET_LIST_GET_REQUEST_ERROR,
        error: error,
    };
}

export function fetchWalletDetailAction(id) {
    return async(dispatch) => {
        try {
            const response = await axios.get(`finances/wallets/${id}`);
            dispatch(walletDetailAction(response.data));
        } catch (error) {
            dispatch(walletDetailActionError(error));
        }
    };
}

export function walletDetailAction(wallet) {
    return {
        type: WALLET_DETAIL_GET_REQUEST,
        walletDetail: wallet,
    };
}

export function walletDetailActionError(error) {
    return {
        type: WALLET_DETAIL_GET_REQUEST_ERROR,
        error: error,
    };
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
export function fetchExpenseTagsAction(id) {
    return async(dispatch) => {
        try {
            const response = await axios.get(`finances/expense-tags/`);
            dispatch(expenseTagsAction(response.data));
        } catch (error) {
            dispatch(expenseTagsActionError(error));
        }
    };
}

export function expenseTagsAction(expenseTags) {
    return {
        type: EXPENSES_TAGS_GET_REQUEST,
        expenseTags: expenseTags,
    };
}

export function expenseTagsActionError(error) {
    return {
        type: EXPENSES_TAGS_GET_REQUEST_ERROR,
        error: error,
    };
}