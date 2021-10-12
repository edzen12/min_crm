import React, { useState, useEffect } from "react";
import DashBoard from "../../../layouts/Dashboard/Dashboard";
import { makeStyles, ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { fetchExams } from "../../../redux/actions";
import Loader from "../../../components/UI/Loader/Loader";
import {
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  IconButton,
} from "@material-ui/core";

import examPhoto from "../../../images/examDefault.jpg";
import { green, indigo } from "@material-ui/core/colors";
import { NavLink } from "react-router-dom";
import EditIcon from '@material-ui/icons/Edit';
import axios from "../../../axios/configuratedAxios";
import {clearBreadcrumbs, setBreadcrumbs} from "../../../redux/actions";

const useStyles = makeStyles({
  wrapper: {
    maxWidth: 1080,
    margin: "0 auto",
  },
  root: {
    maxWidth: 500,
    color: "#007bff",
  },
  media: {
    height: 140,
    minWidth: 345,
  },
  flex: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  linkColor: {
    textDecoration: "none",
    color: "white",
    border: "0",
  },
});

const ExamsList = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const isLoading = useSelector((state) => {
    return state.exams.loading;
  });

  const exams = useSelector((state) => {
    return state.exams.exams;
  });

  useEffect(() => {
    dispatch(clearBreadcrumbs())
    dispatch(fetchExams());
  }, []);

  const theme = createMuiTheme({
    palette: {
      primary: green,
      secondary: indigo
    },
  });

  const userData = useSelector((state) => state.personalData.userData.data);

  return (
    <DashBoard>
      {isLoading ? (
        <Loader />
      ) : (
        <Grid container justify="center" className={classes.wrapper}>
          {exams.map((exam) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              container
              justify="center"
              key={exam.id}
              className="mt-4"
            >
              <Card className={`${(classes.root, classes.flex)} mx-2`}>
                <CardActionArea>
                  <CardMedia
                    className={classes.media}
                    image={examPhoto}
                    title="Exam"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      {exam.title}
                    </Typography>
                  </CardContent>
                </CardActionArea>

                <CardActions>

                {userData && !userData.is_student ? (
                <IconButton
                  aria-label="edit"
                  component={NavLink}
                  to={`/exams/${exam.id}`}
                >
                  <EditIcon/>
                </IconButton>
                ) : null}

                  <ThemeProvider theme={theme}>
                  <Button
                    className="mb-2 ml-2"
                    style={{ color: "#fff", backgroundColor: `${!exam.is_active || exam.passed_exam ? '#707070' : '#3f51b5'}` }}
                    variant="contained"
                    component={NavLink}
                    to={`/exams-pass/${exam.id}`}
                    disabled={!exam.is_active || exam.passed_exam}
                  >
                    Пройти 
                  </Button>
                  </ThemeProvider>

                  <ThemeProvider theme={theme}>
                    <Button
                      style={{ color: "#fff", backgroundColor: `${!exam.is_active ? '#707070' : ''}` }}
                      variant="contained"
                      color="primary"
                      className="mb-2 ml-2"
                      component={NavLink}
                      disabled={!exam.is_active}
                      to={`/exams-result/${exam.id}`}
                    >
                      Результаты
                    </Button>
                  </ThemeProvider>

                  
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </DashBoard>
  );
};

export default ExamsList;
