import React from 'react';
import Dashboard from "../../../layouts/Dashboard/Dashboard";
import { Row } from "reactstrap";
import EditCourseFormik from "./EditCourseFormik"
import { useEffect, useState } from "react";
import axios from "../../../axios/configuratedAxios";
import 'react-toastify/dist/ReactToastify.css';
import {setBreadcrumbs} from "../../../redux/actions";
import {useDispatch} from "react-redux";

function EditCourse(props) {

  const [fetchedValues, setFetchedValues] = useState(null);
  const dispatch = useDispatch();
  
  let courseId = props.match.params.id;
  async function fetchCourseDetail() {
    try {
      const response = await axios.get(`/courses/${courseId}/`)
      setFetchedValues(response.data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    fetchCourseDetail()
  }, []);
  useEffect(() => {
    fetchedValues && dispatch(setBreadcrumbs(
      [
        {title: "Курсы", to: "/courses"},
        {title: fetchedValues.title, to: ""},
      ]
    ))
  }, [fetchedValues]);

  return (
    <Dashboard>
      <div>
        <Row>
          <div className="col-12">
            <div className="card">
              <div style={{minHeight: "80vh"}} className="card-body">
                <h4 className="card-title">Редактировать курс</h4>
                <EditCourseFormik
                  fetchedValues={fetchedValues}
                  id={courseId}
                />
              </div>
            </div>
          </div>
        </Row>
      </div>
    </Dashboard>
  )
}

export default EditCourse;