import {
    TRANSACTIONS_LIST_GET_REQUEST,
    TRANSACTIONS_LIST_GET_REQUEST_ERROR,
    TRANSACTIONS_DETAIL_GET_REQUEST,
    CLEAR_TRANSACTIONS,

    TRANSACTIONS_DETAIL_GET_REQUEST_ERROR,
    EXPENSES_LIST_GET_REQUEST,
    EXPENSES_LIST_GET_REQUEST_ERROR,
    EXPENSES_DETAIL_GET_REQUEST,

    EXPENSES_DETAIL_GET_REQUEST_ERROR,
    INCOMES_LIST_GET_REQUEST_ERROR,
    INCOMES_LIST_GET_REQUEST,
    INCOMES_DETAIL_GET_REQUEST,

    INCOMES_DETAIL_GET_REQUEST_ERROR,
    STUDENT_PAYMENTS_LIST_GET_REQUEST_ERROR,
    STUDENT_PAYMENTS_LIST_GET_REQUEST,
    STUDENT_PAYMENTS_DETAIL_GET_REQUEST,

    STUDENT_PAYMENTS_DETAIL_GET_REQUEST_ERROR,
    WALLET_LIST_GET_REQUEST,
    WALLET_LIST_GET_REQUEST_ERROR,
    WALLET_DETAIL_GET_REQUEST,

    WALLET_DETAIL_GET_REQUEST_ERROR,
    EXPENSES_TAGS_GET_REQUEST,
    EXPENSES_TAGS_GET_REQUEST_ERROR,
} from "../actions/actionTypes";

const initialState = {
    transactionsList: {
        data: null,
        error: null
    },
    transactionsDetail: {
        data: null,
        error: null
    },
    expensesList: {
        data: null,
        error: null,
    },
    expenseDetail: {
        data: null,
        error: null
    },
    incomesList: {
        data: null,
        error: null,
    },
    incomesDetail: {
        data: null,
        error: null
    },
    studentPaymentsList: {
        data: null,
        error: null,
    },
    studentPaymentsDetail: {
        data: null,
        error: null
    },
    walletsList: {
        data: null,
        error: null
    },
    walletDetail: {
        data: null,
        error: null
    },
    expenseTags: {
        data: null,
        error: null
    }
};

export default function expensesReducer(state = initialState, action) {
    switch (action.type) {
        case EXPENSES_TAGS_GET_REQUEST:
            return {
                ...state,
                expenseTags: {
                    data: action.expenseTags,
                    error: null,
                },
            };
        case EXPENSES_TAGS_GET_REQUEST_ERROR:
            return {
                ...state,
                expenseTags: {
                    data: {},
                    error: action.error,
                },
            };
            //////////////////////////////////////////////////////////////////////////////////////////////////
        case TRANSACTIONS_LIST_GET_REQUEST:
            return {
                ...state,
                transactionsList: {
                    data: action.transactionsList,
                    error: null,
                },
            };
        case TRANSACTIONS_LIST_GET_REQUEST_ERROR:
            return {
                ...state,
                transactionsList: {
                    data: {},
                    error: action.error,
                },
            };
        case TRANSACTIONS_DETAIL_GET_REQUEST:
            return {
                ...state,
                transactionsDetail: {
                    data: action.transactionsDetail,
                    error: null,
                },
            };
        case TRANSACTIONS_DETAIL_GET_REQUEST_ERROR:
            return {
                ...state,
                transactionsDetail: {
                    data: {},
                    error: action.error,
                },
            };
        case CLEAR_TRANSACTIONS:
            return {
                ...state,
                transactionsList: {
                    data: null,
                    error: null,
                },
            };
            //////////////////////////////////////////////////////////////////////////////////////////////////
        case EXPENSES_LIST_GET_REQUEST:
            return {
                ...state,
                expensesList: {
                    data: action.expensesList,
                    error: null,
                },
            };
        case EXPENSES_LIST_GET_REQUEST_ERROR:
            return {
                ...state,
                expensesList: {
                    data: {},
                    error: action.error,
                },
            };
        case EXPENSES_DETAIL_GET_REQUEST:
            return {
                ...state,
                expenseDetail: {
                    data: action.expenseDetail,
                    error: null,
                },
            };
        case EXPENSES_DETAIL_GET_REQUEST_ERROR:
            return {
                ...state,
                expenseDetail: {
                    data: null,
                    error: action.error,
                },
            };
            ////////////////////////////////INCOMES////////////////////////////////////////////////////////////
        case INCOMES_LIST_GET_REQUEST:
            return {
                ...state,
                incomesList: {
                    data: action.incomesList,
                    error: null,
                },
            };
        case INCOMES_LIST_GET_REQUEST_ERROR:
            return {
                ...state,
                incomesList: {
                    data: {},
                    error: action.error,
                },
            };
        case INCOMES_DETAIL_GET_REQUEST:
            return {
                ...state,
                incomesDetail: {
                    data: action.incomesDetail,
                    error: null,
                },
            };
        case INCOMES_DETAIL_GET_REQUEST_ERROR:
            return {
                ...state,
                incomesDetail: {
                    data: null,
                    error: action.error,
                },
            };
            ////////////////////////////////STUDENT_PAYMENTS////////////////////////////////////////////////////////////
        case STUDENT_PAYMENTS_LIST_GET_REQUEST:
            return {
                ...state,
                studentPaymentsList: {
                    data: action.studentPaymentsList,
                    error: null,
                },
            };
        case STUDENT_PAYMENTS_LIST_GET_REQUEST_ERROR:
            return {
                ...state,
                studentPaymentsList: {
                    data: {},
                    error: action.error,
                },
            };
        case STUDENT_PAYMENTS_DETAIL_GET_REQUEST:
            return {
                ...state,
                studentPaymentsDetail: {
                    data: action.studentPaymentsDetail,
                    error: null,
                },
            };
        case STUDENT_PAYMENTS_DETAIL_GET_REQUEST_ERROR:
            return {
                ...state,
                studentPaymentsDetail: {
                    data: null,
                    error: action.error,
                },
            };
            //////////////////////////////////WALLET///////////////////////////////////////////////////
        case WALLET_LIST_GET_REQUEST:
            return {
                ...state,
                walletsList: {
                    data: action.walletsList,
                    error: null,
                },
            };
        case WALLET_LIST_GET_REQUEST_ERROR:
            return {
                ...state,
                walletsList: {
                    data: null,
                    error: action.error,
                },
            };
        case WALLET_DETAIL_GET_REQUEST:
            return {
                ...state,
                walletDetail: {
                    data: action.walletDetail,
                    error: null,
                },
            };
        case WALLET_DETAIL_GET_REQUEST_ERROR:
            return {
                ...state,
                walletDetail: {
                    data: null,
                    error: action.error,
                },
            };
        default:
            return state;
    }
}