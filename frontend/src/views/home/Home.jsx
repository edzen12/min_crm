import React, {useEffect} from "react";
import {useDispatch, useSelector} from 'react-redux'
import TrainerDetail from "../Trainer/trainerDetail/TrainerDetail";
import StaffMemberDetail from "../StaffMember/staffMemberDetail/StaffMemberDetail";
import AdminDetail from "../Admin/AdminDetail/AdminDetail";
import StudentDetail from "../Student/StudentDetail/StudentDetail";
import DashBoard from "../../layouts/Dashboard/Dashboard";
import Loader from "../../components/UI/Loader/Loader";
import {clearBreadcrumbs} from "../../redux/actions";
function Home() {
  const profileData = useSelector(state => state.personalData.profileData.data);
  const userData = useSelector(state => state.personalData.userData.data);
  const dispatch = useDispatch()
  useEffect(()=>{
    dispatch(clearBreadcrumbs())
  }, [])
  if (userData && userData.is_trainer){
    return (
      <TrainerDetail match = {{params: {id: profileData && profileData.id}}}/>
      )
  }

  if (userData && userData.is_staff_member){
    return (
      <StaffMemberDetail match = {{params: {id:profileData && profileData.id}}}/>
    )
  }

  if (userData && userData.is_administrator){
    return (
      <AdminDetail match = {{params: {id:profileData && profileData.id}}}/>
    )
  }

  if (userData && userData.is_student){
    return (
      <StudentDetail match = {{params: {id:profileData && profileData.id}}}/>
    )
  }
  else {
    return (
      <DashBoard>
        <Loader/>
      </DashBoard>
    )
  }

}

export default Home;
