import React, {useEffect, useState} from 'react';
import AddUser from '../AddUser/AddUser';
import AddAdmin from "../AddAdmin/AddAdmin";
import AddTeacher from '../AddTeacher/AddTeacher';
import AddStaffMember from "../AddStaffMember/AddStaffMember"
import AddStudent from '../AddStudent/AddStudent';
import {useDispatch} from "react-redux";
import {setBreadcrumbs} from "../../redux/actions";

function AddUserType(props) {
  const [isFirstStep, setFirstStep] = useState(true);
  const dispatch = useDispatch()

  useEffect(() => {
    if (props.userType === 'admin') {
      dispatch(setBreadcrumbs(
        [
          {title: "Админ-ы", to: "/adminsList"},
          {title: "Шаг-1", to: ""},
        ]
      ))
    } else if (props.userType === 'teacher') {
      dispatch(setBreadcrumbs(
        [
          {title: "Менторы", to: "/trainersList"},
          {title: "Шаг-1", to: ""},
        ]
      ))
    } else if (props.userType === 'staff') {
      dispatch(setBreadcrumbs(
        [
          {title: "Сотрудники", to: "/staffMembersList"},
          {title: "Шаг-1", to: ""},
        ]
      ))
    } else if (props.userType === 'student') {
      dispatch(setBreadcrumbs(
        [
          {title: "Студенты", to: "/studentsList"},
          {title: "Шаг-1", to: ""},
        ]
      ))
    }
  }, [props])

  if (props.userType === 'admin') {
    return <>
      {isFirstStep
        ? <AddUser setFirstStep={setFirstStep} userType={props.userType}/>
        :
        <AddAdmin setFirstStep={setFirstStep}/>}
    </>;
  } else if (props.userType === 'teacher') {
    return <>
      {isFirstStep
        ? <AddUser setFirstStep={setFirstStep} userType={props.userType}/>
        :
        <AddTeacher setFirstStep={setFirstStep}/>}
    </>
  } else if (props.userType === 'staff') {
    return <>
      {isFirstStep
        ? <AddUser setFirstStep={setFirstStep} userType={props.userType}/>
        :
        <AddStaffMember setFirstStep={setFirstStep}/>}
    </>
  } else if (props.userType === 'student') {
    return <>
      {isFirstStep
        ? <AddUser setFirstStep={setFirstStep} userType={props.userType}/>
        :
        <AddStudent setFirstStep={setFirstStep}/>}
    </>
  }
}

export default AddUserType;
