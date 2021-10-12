import React, { useEffect, useState } from "react";
import DashBoard from "../../../layouts/Dashboard/Dashboard";
import axios from "../../../axios/configuratedAxios";
import { ResponsiveLine } from '@nivo/line';
import { ResponsivePie } from '@nivo/pie';
import classes from '../Analytics.module.css';
import { Typography } from "@material-ui/core";


const FinanceLineChart = ({ data /* see data tab */ }) => (
  <ResponsiveLine
      data={data}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: 'point' }}
      yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
      yFormat=" >-.2f"
      axisTop={null}
      axisRight={null}
      axisBottom={{
          orient: 'bottom',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'месяцы',
          legendOffset: 36,
          legendPosition: 'middle'
      }}
      axisLeft={{
          orient: 'left',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'сумма',
          legendOffset: -40,
          legendPosition: 'middle'
      }}
      pointSize={10}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={2}
      pointBorderColor={{ from: 'serieColor' }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={[
          {
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 100,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: 'left-to-right',
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: 'circle',
              symbolBorderColor: 'rgba(0, 0, 0, .5)',
              effects: [
                  {
                      on: 'hover',
                      style: {
                          itemBackground: 'rgba(0, 0, 0, .03)',
                          itemOpacity: 1
                      }
                  }
              ]
          }
      ]}
  />
)


const FinancePieChart = ({ data }) => (
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


export default function FinanceAnalytics() {
  const [studentsPayments, setStudentsPayments] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [studentsPaymentsCourses, setStudentsPaymentsCourses] = useState([]);
  const [branchesFinance, setBranchesFinance] = useState([]);
  const [categoryExpenses, setCategoryExpenses] = useState([]);


  async function fetchBranchesFinance(){
    try {
      const { data } = await axios.get('analytics/finances/finances-brances/');

      setBranchesFinance(data.map(branchFinance => ({
        id: branchFinance.name,
        label: branchFinance.name,
        value: branchFinance.balance,
        color: "hsl(223, 70%, 50%)"
      })))
    } catch (error) {
      
    }
  }

  async function fetchCategoriesExpenses(){
    try {
      const { data } = await axios.get('analytics/finances/expences-categories/');

      setCategoryExpenses(data.map(categoryExpense => ({
        id: categoryExpense.name,
        label: categoryExpense.name,
        value: categoryExpense.summary,
        color: "hsl(223, 70%, 50%)"
      })))
    } catch (error) {}
  }

  async function fetchStudentsPaymentsCourses() {
    try {
      const { data } = await axios.get('analytics/finances/students-payments-courses/');
      // console.log('paymentsCourses: ', data);
      setStudentsPaymentsCourses(data.map(coursePayment => ({
        id: coursePayment.name,
        label:coursePayment.name,
        value: coursePayment.summary,
        color: "hsl(223, 70%, 50%)"
      })))
    } catch (error) {
      // pass
    }
  }

  async function fetchIncomes() {
    try {
      const { data } = await axios.get('analytics/finances/incomes/');
      const incomesData = [];

      data.forEach(income => {
        let currentId = incomesData.findIndex(
          (item) => item.id === income.year
        );
        if (currentId !== -1) {
          incomesData[currentId].data = [...incomesData[currentId].data, 
          {
            x: income.month,
            y: income.summary,
          }];
        } else {
          incomesData.push({
            id: income.year,
            color: "hsl(103, 70%, 50%)",
            data: [
              {
                x: income.month,
                y: income.summary,
              },
            ],
          });
        }
      })
      setIncomes(incomesData);
    } catch (error) {}
  }

  async function fetchExpenses() {
    try {
      const { data } = await axios.get('analytics/finances/expences/');

      const expensesData = [];

      data.forEach(expense => {
        let currentId = expensesData.findIndex(
          (item) => item.id === expense.year
        );
        if (currentId !== -1) {
          expensesData[currentId].data = [...expensesData[currentId].data, 
          {
            x: expense.month,
            y: expense.summary,
          }];
        } else {
          expensesData.push({
            id: expense.year,
            color: "hsl(103, 70%, 50%)",
            data: [
              {
                x: expense.month,
                y: expense.summary,
              },
            ],
          });
        }
      })
      setExpenses(expensesData);
    } catch (error) {}
  }

  async function fetchStudentsPayments() {
    try {
      const { data } = await axios.get("analytics/finances/students-payments/");
      const studentsPaymentsData = [];
      
      data.forEach((paymentData) => {
        let currentId = studentsPaymentsData.findIndex(
          (item) => item.id === paymentData.year
        );
        if (currentId !== -1) {
          studentsPaymentsData[currentId].data = [...studentsPaymentsData[currentId].data, 
          {
            x: paymentData.month,
            y: paymentData.summary,
          }];
        } else {
          studentsPaymentsData.push({
            id: paymentData.year,
            color: "hsl(103, 70%, 50%)",
            data: [
              {
                x: paymentData.month,
                y: paymentData.summary,
              },
            ],
          });
        }
      });
      
      setStudentsPayments(studentsPaymentsData);
    } catch (error) {}
  }

  useEffect(() => {
    fetchStudentsPayments();
    fetchStudentsPaymentsCourses();
    fetchIncomes();
    fetchBranchesFinance();
    fetchExpenses();
    fetchCategoriesExpenses();
  }, []);

  return (
  <DashBoard>
    <div className={classes.mainLineChart}>
      <Typography variant="body1" style={{textAlign: 'center', fontWeight: 600}}>
        Плата студентов по годам и месяцам
      </Typography>
      <FinanceLineChart data={studentsPayments}/>
    </div>

    <div className={classes.mainPieChart}>
      <Typography variant="body1" style={{textAlign: 'center', fontWeight: 600}}>
        Плата студентов за курсы
      </Typography>
      <FinancePieChart data={studentsPaymentsCourses}/>
    </div>

    <div className={classes.mainLineChart}>
      <Typography variant="body1" style={{textAlign: 'center', fontWeight: 600}}>
        Доходы по годам и месяцам
      </Typography>
      <FinanceLineChart data={incomes}/>
    </div>

    <div className={classes.mainLineChart}>
      <Typography variant="body1" style={{textAlign: 'center', fontWeight: 600}}>
        Общий баланс филиалов
      </Typography>
      <FinancePieChart data={branchesFinance}/>
    </div>

    <div className={classes.mainLineChart}>
      <Typography variant="body1" style={{textAlign: 'center', fontWeight: 600}}>
        Расходы по годам и месяцам
      </Typography>
      <FinanceLineChart data={expenses}/>
    </div>

    <div className={classes.mainPieChart}>
      <Typography variant="body1" style={{textAlign: 'center', fontWeight: 600}}>
        Расходы по категориям
      </Typography>
      <FinancePieChart data={categoryExpenses}/>
    </div>
  </DashBoard>
  )
}
