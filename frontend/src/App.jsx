import React from "react";
import { ConfirmProvider } from 'material-ui-confirm';
import { Router, Route, Switch } from "react-router-dom";
import LoginLayout from "./layouts/LoginLayout";
import { history } from "./jwt/_helpers";
import PrivateRoute from "./routes/privateRoutes";
import AddUserType from "./views/AddUserType/AddUserType";
import HomePage from './views/home/Home';
import AddCourse from "./views/Courses/AddCourse/AddCourse";
import CoursesList from "./views/Courses/CoursesList/CoursesList";
import Tags from "./views/Tags/Tags";
import Scopes from "./views/Scopes/Scopes";
import Partners from "./views/Partners/Partners";
import CourseDetail from "./views/Courses/CourseDetail/CourseDetail";
import EditCourse from "./views/Courses/EditCourse";
import AdminTable from "./views/Admin/AdminsList/AdminTable";
import AdminEdit from "./views/Admin/AdminEdit/AdminEdit";
import AdminsDetail from "./views/Admin/AdminDetail/AdminDetail";
import TrainersTable from "./views/Trainer/trainersList/TrainersTable";
import TrainerDetail from "./views/Trainer/trainerDetail/TrainerDetail";
import TrainerEdit from "./views/Trainer/TrainerEdit/TrainerEdit";
import StaffMemberList from "./views/StaffMember/staffMemberList/StaffMemberList";
import StaffMemberDetail from "./views/StaffMember/staffMemberDetail/StaffMemberDetail";
import AddKlassPart1 from "./views/Klasses/AddKlass/AddKlassPart1";
import KlassSchedule from "./views/Klasses/KlassSchedule/KlassSchedule.jsx";
import StudentEdit from "./views/Student/StudentEdit/StudentEdit";

import TransactionsList from "./views/Finance/TransactionsList/TransactionsList";

import AddExpenses from "./views/Finance/Expenses/AddExpenses/AddExpenses";
import ExpensesDetail from "./views/Finance/Expenses/ExpensesDetail/ExpensesDetail.jsx";
import ExpensesEdit from "./views/Finance/Expenses/ExpensesEdit/ExpensesEdit";

import AddIncomes from "./views/Finance/Incomes/AddIncomes/AddIncomes";
import IncomesDetail from "./views/Finance/Incomes/IncomesDetail/IncomesDetail.jsx";
import IncomesEdit from "./views/Finance/Incomes/IncomesEdit/IncomesEdit";

import AddStudentPayments from "./views/Finance/StudentPayments/AddStudentPayments/AddStudentPayments";
import StudentPaymentsDetail from "./views/Finance/StudentPayments/StudentPaymentsDetail/StudentPaymentsDetail.jsx";
import StudentPaymentsEdit from "./views/Finance/StudentPayments/StudentPaymentsEdit/StudentPaymentsEdit";


import WalletsTable from "./views/Finance/Wallets/WalletsList/WalletsTable.jsx";
import AddWallets from "./views/Finance/Wallets/AddWallets/AddWallets";
import WalletsDetail from "./views/Finance/Wallets/WalletsDetail/WalletsDetail.jsx";
import WalletsEdit from "./views/Finance/Wallets/WalletsEdit/WalletsEdit";

import TransactionsType from "./views/Finance/TransactionsType/TransactionsType"

import ExpenseTags from "./views/Finance/ExpenseTags/ExpenseTags"

import {useSelector} from 'react-redux';

import { ToastProvider } from 'react-toast-notifications';
import StudentsTable from "./views/Student/StudentList/StudentsTable";
import StudentDetail from "./views/Student/StudentDetail/StudentDetail";
import AddExam from "./views/Exams/AddExam/AddExam";
import ExamsList from "./views/Exams/ExamsList/ExamsList";
import ExamEdit from "./views/Exams/ExamEdit/ExamEdit";
import KlassesList from "./views/Klasses/KlassesList/KlassesList";
import EditKlass from "./views/Klasses/EditKlass/EditKlass";
import KlassStudents from "./views/Klasses/KlassStudents";

import AddBranch from "./views/Branches/AddBranch/AddBranch.jsx";
import BranchesTable from "./views/Branches/BranchesTable/BranchesTable";
import BranchDetail from "./views/Branches/BranchDetail/BranchDetail";
import BranchEdit from "./views/Branches/BranchEdit/BranchEdit";
import StaffEdit from './views/StaffMember/StaffMemberEdit/StaffEdit';
import ExamPass from "./views/Exams/ExamPass/ExamPass";
import ExamResults from "./views/Exams/ExamResults/ExamResults";
import TransactionsUpdateType from "./views/Finance/TransactionsType/TransactionUpdateType";

import AddInventory from "./views/Inventories/AddInventory/AddInventory";
import Inventories from "./views/Inventories/Inventories/Inventories";
import InventoryDetail from "./views/Inventories/InventoryDetail/InventoryDetail";
import EditInventory from "./views/Inventories/EditInventory/EditInventory";
import StudentsAnalytics from "./views/Analytics/StudentsAnalytics/StudentsAnalytics";
import FinanceAnalytics from "./views/Analytics/FinanceAnalytics/FinanceAnalytics";
import ExamResultUser from "./views/Exams/ExamResultUser/ExamResultUser";
import klassDetail from "./views/Klasses/KlassDetail/KlassDetail";
import StudentsCategories from "./views/Student/StudentsCategories/StudentsCategories";


const App = () => {
  const transactionType = useSelector(state => state.finance.transactionsDetail.data && state.finance.transactionsDetail.data);

  const confirmDefaultOptions = {title: 'Вы уверены?', confirmationText:"Да", cancellationText: "Отмена"};
  return (
    <ConfirmProvider defaultOptions={confirmDefaultOptions}>
      <ToastProvider placement="bottom-right" autoDismissTimeout={2500}>
        <Router basename="/" history={history}>
          <Switch>
            <Route path="/authentication/login" component={LoginLayout} />
            <PrivateRoute path="/" component={HomePage} exact/>
            <PrivateRoute path="/addAdmin" component={() => <AddUserType userType="admin" />} exact/>
            <PrivateRoute path="/addTeacher" component={() => <AddUserType userType="teacher" />} exact/>
            <PrivateRoute path="/addStaffMember" component={() => <AddUserType userType="staff" />} exact/>
            <PrivateRoute path="/addStudent" component={() => <AddUserType userType="student" />} exact/>
            <PrivateRoute path="/addCourse" component={AddCourse} exact/>
            <PrivateRoute path="/courses" component={CoursesList} exact/>
            <PrivateRoute path="/courseDetail/:id" component={CourseDetail} exact/>
            <PrivateRoute path="/tags" component={Tags} exact/>
            <PrivateRoute path="/scopes" component={Scopes} exact/>
            <PrivateRoute path="/partners" component={Partners} exact/>
            <PrivateRoute path="/adminsList" component={AdminTable} exact/>

            <PrivateRoute path="/adminDetail/:id" component={AdminsDetail} exact/>
            <PrivateRoute path="/adminUpdate/:id" component={AdminEdit} exact/>

            <PrivateRoute path="/trainersList" component={TrainersTable} exact/>
            <PrivateRoute path="/trainer/:id" component={TrainerDetail} exact/>
            <PrivateRoute path="/trainer/update/:id" component={TrainerEdit} exact/>

            <PrivateRoute path="/studentsList" component={StudentsTable} exact/>
            <PrivateRoute path="/student/:id" component={StudentDetail} exact/>
            <PrivateRoute path="/student/update/:id" component={StudentEdit} exact/>

            <PrivateRoute path="/staffMembersList" component={StaffMemberList} exact/>
            <PrivateRoute path="/staffMember/:id" component={StaffMemberDetail} exact/>
            <PrivateRoute path="/staffMember/update/:id" component={StaffEdit} exact/>

            <PrivateRoute path="/courses/update/:id" component={EditCourse} exact/>
            <PrivateRoute path="/klasses" component={KlassesList} exact/>
            <PrivateRoute path="/klasses/addKlassPart1" component={AddKlassPart1} exact/>
            <PrivateRoute path="/klasses/:id" component={klassDetail} exact/>
            <PrivateRoute path="/klasses/update/:id" component={EditKlass} exact/>
            <PrivateRoute path="/klassStudents/:id" component={KlassStudents} exact/>
            <PrivateRoute path="/klass-schedule/:id" component={KlassSchedule} exact/>

            <PrivateRoute path="/students-categories/" component={StudentsCategories} exact/>

            <PrivateRoute path="/branches" component={BranchesTable} exact/>
            <PrivateRoute path="/branches/add" component={AddBranch} exact/>
            <PrivateRoute path="/branches/:id" component={BranchDetail} exact/>
            <PrivateRoute path="/branches/update/:id" component={BranchEdit} exact/>

            <PrivateRoute path="/transactions" component={TransactionsList} exact/>

            <PrivateRoute path="/finances/addExpenses" component={AddExpenses} exact/>
            <PrivateRoute path={"/transactions/:id"} component={TransactionsType} exact/>
            <PrivateRoute path={"/transactions/update/:id"} component={TransactionsUpdateType} exact/>
            <PrivateRoute path="/exams/addExam" component={AddExam} exact/>
            <PrivateRoute path="/exams/" component={ExamsList} exact/>
            <PrivateRoute path="/exams/:id" component={ExamEdit} exact/>
            <PrivateRoute path="/exams-pass/:id" component={ExamPass} exact/>
            <PrivateRoute path="/exams-result/:id" component={ExamResults} exact/>
            <PrivateRoute path="/exams-result/user/:id/" component={ExamResultUser} exact/>

            <PrivateRoute path="/expenses/addExpenses" component={AddExpenses} exact/>
            <PrivateRoute path="/expenses/:id" component={ExpensesDetail} exact/>

            <PrivateRoute path="/finances/addIncomes" component={AddIncomes} exact/>
            <PrivateRoute path="/incomes/:id" component={IncomesDetail} exact/>
            
            <PrivateRoute path="/finances/addStudentPayments" component={AddStudentPayments} exact/>
            <PrivateRoute path="/studentPayments/:id" component={StudentPaymentsDetail} exact/>
            <PrivateRoute path="/studentPayments/update/:id" component={StudentPaymentsEdit} exact/>

            <PrivateRoute path="/wallets" component={WalletsTable} exact/>
            <PrivateRoute path="/wallets/create" component={AddWallets} exact/>
            <PrivateRoute path="/wallets/:id" component={WalletsDetail} exact/>
            <PrivateRoute path="/wallets/update/:id" component={WalletsEdit} exact/>

            <PrivateRoute path="/inventories/addInventory" component={AddInventory} exact/>
            <PrivateRoute path="/inventories" component={Inventories} exact/>
            <PrivateRoute path="/inventories/:id" component={InventoryDetail} exact/>
            <PrivateRoute path="/inventories/update/:id" component={EditInventory} exact/>

            <PrivateRoute path="/expenseTags" component={ExpenseTags} exact/>

            <PrivateRoute path="/students-analytics" component={StudentsAnalytics}/>
            <PrivateRoute path="/finance-analytics" component={FinanceAnalytics}/>
          </Switch>
        </Router>
      </ToastProvider>
    </ConfirmProvider>
  );
}

export default App;
