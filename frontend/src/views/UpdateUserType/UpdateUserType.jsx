import React, { useState } from 'react';
import AddUser from '../AddUser/AddUser';
import UpdateUser from "../UpdateUser/UpdateUser";
import AddAdmin from '../AddAdmin/AddAdmin';
import { motion, AnimateSharedLayout } from "framer-motion";
import AddTeacher from '../AddTeacher/AddTeacher';
import AddStaff from '../AddStaffMember/AddStaffMember'

function UpdateUserType(props) {
  const [isFirstStep, setFirstStep] = useState(true);
  if (props.userType === 'admin') {
    return <>
      { isFirstStep
        ? <UpdateUser setFirstStep={setFirstStep} id={props.match.params.id} userType={props.userType} />
        :
        <AddAdmin setFirstStep={setFirstStep} />}
    </>;
  }

  else if (props.userType === 'trainer') {
    return <>
      { isFirstStep
        ? <UpdateUser setFirstStep={setFirstStep} id={props.match.params.id} userType={props.userType} />
        :
        <AddTeacher setFirstStep={setFirstStep} />}
    </>
  }

  else if (props.userType === 'staff') {
    return <>
      { isFirstStep
        ? <UpdateUser setFirstStep={setFirstStep} id={props.match.params.id} userType={props.userType} />
        :
        <AddStaff setFirstStep={setFirstStep} />}
    </>
  }
}

export default UpdateUserType;
