import React, { useEffect, useState } from 'react'
import axios from "../../../axios/configuratedAxios";
import DashBoard from '../../../layouts/Dashboard/Dashboard'
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveBar } from '@nivo/bar'
import { Grid, FormControl, MenuItem, Select, Typography } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import { Divider } from '@material-ui/core';
import classes from '../Analytics.module.css';
import { func } from 'prop-types';


const StudentPieChart = ({ data }) => (
  <ResponsivePie
      data={data}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      colors={{ scheme: 'nivo' }}
      borderWidth={1}
      borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.2 ] ] }}
      radialLabelsSkipAngle={1}
      radialLabelsTextColor="#333333"
      radialLabelsLinkColor={{ from: 'color' }}
      sliceLabelsSkipAngle={10}
      sliceLabelsTextColor="#333333"
      legends={[
          {
              anchor: 'bottom',
              direction: 'row',
              justify: false,
              translateX: 0,
              translateY: 56,
              itemsSpacing: 0,
              itemWidth: 100,
              itemHeight: 18,
              itemTextColor: '#999',
              itemDirection: 'left-to-right',
              itemOpacity: 1,
              symbolSize: 18,
              symbolShape: 'circle',
              effects: [
                  {
                      on: 'hover',
                      style: {
                          itemTextColor: '#000'
                      }
                  }
              ]
          }
      ]}
  />
)

const StudentsStatusesBarChart = ({data}) => (
  <ResponsiveBar
        data={data}
        keys={[ 'Активные', 'Ушли' ]}
        indexBy="year"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        valueScale={{ type: 'linear' }}
        colors={{ scheme: 'nivo' }}
        borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Год',
            legendPosition: 'middle',
            legendOffset: 32
        }}
        axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Кол-во',
            legendPosition: 'middle',
            legendOffset: -40
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
        legends={[
            {
                dataFrom: 'keys',
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 120,
                translateY: 0,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: 'left-to-right',
                itemOpacity: 0.85,
                symbolSize: 20,
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemOpacity: 1
                        }
                    }
                ]
            }
        ]}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
    />
)

export default function Analytics() {
  const [studentsStatuses, setStudentsStatuses] = useState([]); 
  const [studentsStatusesYears, setStudentsStatusesYears] = useState([]); 
  const [studentsStatusesBranches, setStudentsStatusesBranches] = useState([]);
  const [studentsStatusesBranchesYears, setStudentsStatusesBranchesYears] = useState([]);
  const [studentsReferrals, setStudentsReferrals] = useState([]);
  const [studentsGender, setStudentsGender] = useState([]);
  const [studentsEmployed, setStudentsEmployed] = useState([]);
  const [studentsCourses, setStudentsCourses] = useState([]); 
  const [activeStudentsCourses, setActiveStudentsCourses] = useState([]);
  const [selectedTime, setSelectedTime] = useState('все время');


  const infoFromOptions = {
    A: 'Знакомые',
    SN: 'Социальные сети',
    G: 'Google',
    SM: 'СМИ',
    O: 'Другое'
  };

  const genderOptions = {
    M: 'Мужчина',
    F: 'Женщина',
  };

  const statusOptions = {
    A: 'Активные',
    G: 'Окончили',
    L: 'Ушли'
  }
  

  async function fetchStudentsStatuses(){
    try {
      const {data} = await axios.get(`analytics/students/students-statuses-all/`);

      setStudentsStatuses(data.map(statusData => ({
        id: statusOptions[statusData.status],
        label: statusOptions[statusData.status],
        value: statusData.count,
        color: "hsl(53, 70%, 50%)"   
      })))
    } catch (error) {
      // pass
    }
  }

  async function fetchStudentsStatusesYears(){
    try {
      const {data} = await axios.get(`analytics/students/students-statuses-years/`)

      const statusesYears = [];

      data.active.forEach(activeData => {
        statusesYears.push({
          year: activeData.year,
          'Активные': activeData.count,
          activeColor: "hsl(106, 70%, 50%)"
        })
      })
      
      data.left.forEach((leftData, index) => {
        const id = statusesYears.findIndex(statusData => statusData.year === leftData.year);
        statusesYears[id]['Ушли'] = leftData.count;
        statusesYears[id].leftColor = "hsl(106, 70%, 50%)";
      })
      
      // data.graduated.forEach((graduatedData, index) => {
      //   const id = statusesYears.findIndex(statusData => statusData.year === graduatedData.year);
      //   statusesYears[id].graduated = graduatedData.count;
      //   statusesYears[id].graduatedColor = "hsl(106, 70%, 50%)";
      // })
      
      console.log('statusesYears: ', statusesYears);

      setStudentsStatusesYears(statusesYears);
    } catch (error) {
      // pass
    }
  }

  async function fetchStudentsRefferal(){
    try {
      const { data } = await axios.get('analytics/students/students-referral/');
      setStudentsReferrals(data.map(referral => ({
        id: infoFromOptions[referral.info_from],
        label: infoFromOptions[referral.info_from],
        value: referral.count,
        color: "hsl(326, 70%, 50%)"
      })))

    } catch (error) {
      // pass
    }
  }

  async function fetchStudentsEmployed(){
    try {
      const { data } = await axios.get('analytics/students/students-employed/');
      setStudentsEmployed(data.employed.map(employed_data => ({
        id: `Устроенные на работу за ${employed_data.year}`,
        label: `Устроенные на работу за ${employed_data.year}`,
        value: employed_data.count,
        color: "hsl(326, 70%, 50%)"
      })))

    } catch (error) {
      // pass
    }
  }

  async function fetchStudentsCourses(){
    try {
      const { data } = await axios.get('analytics/students/students-courses-all/');
      setStudentsCourses(data.map(studentCourse => ({
        id: studentCourse.title,
        label: studentCourse.title,
        value: studentCourse.count,
        color: "hsl(326, 70%, 50%)"
      })))

    } catch (error) {
      // pass
    }
  }

  async function fetchActiveStudentCourses(){
    try {
      const { data } = await axios.get('analytics/students/students-active-courses/');
      // setActiveStudentsCourses(data.map(studentCourse => ({
      //   id: studentCourse.title,
      //   label: studentCourse.title,
      //   value: studentCourse.count,
      //   color: "hsl(326, 70%, 50%)"
      // })))

    } catch (error) {
      // pass
    }
  }

  async function fetchStudentsGender(){
    try {
      const { data } = await axios.get('analytics/students/students-gender/');
      const filteredData = data.filter(item => !!item.title);
      setStudentsGender(filteredData.map(studentGender => (
        {
          id: genderOptions[studentGender.title],
          label: genderOptions[studentGender.title],
          value: studentGender.gender,
          color: "hsl(326, 70%, 50%)"
        }
      )))

    } catch (error) {
      // pass
    }
  }

  async function fetchStudentsStatusesBranches(){
    try {
      const {data} = await axios.get('analytics/students/students-statuses-all-branch/');
      const branchesPieData = [];

      data.forEach((branch, index) => {
          branchesPieData.push({
            name: branch.name,
            data: [
            {
              id: "Активные",
              label: "Активные",
              value: branch.active,
              color: "hsl(53, 70%, 50%)"
            },
            {
              id: "Ушли",
              label: "Ушли",
              value: branch.left,
              color: "hsl(326, 70%, 50%)"
            },
            {
              id: "Окончили",
              label: "Окончили",
              value: branch.graduated,
              color: "hsl(326, 70%, 50%)"
            }
          ]});
      });      
      setStudentsStatusesBranches(branchesPieData);
    } catch (error) {
      // pass
    }
  }


  useEffect(() => {
    fetchStudentsStatuses();
    fetchStudentsStatusesYears();
    fetchStudentsStatusesBranches();
    fetchStudentsRefferal();
    fetchStudentsGender();
    fetchStudentsEmployed();
    fetchStudentsCourses();
    fetchActiveStudentCourses();
  }, [])
  
  
  return (
    <DashBoard>
      {/* <div className={classes.timeSwitcher}>

      <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">Выберите время</InputLabel>
        <Select
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
        >
          <MenuItem value={"все время"}>
            За все время
          </MenuItem>
          <MenuItem value={2020}>
            2020
          </MenuItem>
        </Select>
      </FormControl>
      </div> */}

      <div className={classes.mainPieChart}>
      <Typography variant="body1" style={{textAlign: 'center', fontWeight: 600}}>
        Кол-во студентов <br/> со статусами за {selectedTime}
      </Typography>
      <StudentPieChart data={studentsStatuses}/>
      </div>

      {/* <pre>
        {JSON.stringify(studentsStatusesYears, 0, 2)}
      </pre> */}

      <div className={classes.mainBarChart}>
      <Typography variant="body1" style={{textAlign: 'center', marginTop: 80, fontWeight: 600}}>
        Кол-во студентов <br/> со статусами за все года
      </Typography>
      <StudentsStatusesBarChart data={studentsStatusesYears}/>
      </div>

      <Typography variant="body1" style={{textAlign: 'center', marginTop: 80, fontWeight: 600}}>
      Кол-во студентов <br/> за всё время <br/> по филиалам со статусами
      </Typography>
      <Grid container>
        {studentsStatusesBranches.map((branch, index) =>
          <Grid item xs={12} md={6} key={index} className={classes.pieChart}>
            <Typography variant="body2" style={{textAlign: 'center', fontWeight: 600}}>
              {branch.name}
            </Typography>
            <StudentPieChart data={branch.data}/>
          </Grid>
        )}
      </Grid>

      <Divider variant="middle" style={{height: 3}}/>

      <Grid container>
        <Grid item xs={12} md={6} className={classes.pieChart}>
          <Typography variant="body2" style={{textAlign: 'center', fontWeight: 600}}>
            Рефералы студентов
          </Typography>
          <StudentPieChart data={studentsReferrals}/>
        </Grid>

        <Grid item xs={12} md={6} className={classes.pieChart}>
          <Typography variant="body2" style={{textAlign: 'center', fontWeight: 600}}>
            Соотношение полов
          </Typography>
          <StudentPieChart data={studentsGender}/>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={12} md={6} className={classes.pieChart}>
          <Typography variant="body2" style={{textAlign: 'center', fontWeight: 600}}>
              Кол-во трудоустроенных по годам
          </Typography>
          <StudentPieChart data={studentsEmployed}/>
        </Grid>
      </Grid>

      <div className={classes.mainPieChart}>
      <Typography variant="body2" style={{textAlign: 'center', fontWeight: 600}}>
        Кол-во студентов за всё время по направлениям
      </Typography>
      <StudentPieChart data={studentsCourses} />
      </div>

      <pre>
        {/* {JSON.stringify(studentsStatusesBranches, 0, 2)} */}
      </pre>
    </DashBoard>
  )
}
