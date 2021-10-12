import React, {useState} from "react";
import clsx from "clsx";
import {useTheme} from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import SchoolIcon from "@material-ui/icons/School";
import PeopleIcon from "@material-ui/icons/People";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import BusinessIcon from "@material-ui/icons/Business";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import CheckIcon from "@material-ui/icons/Check";
import ShowChartIcon from "@material-ui/icons/ShowChart";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import AmpStoriesIcon from "@material-ui/icons/AmpStories";
import ExpandMore from "@material-ui/icons/ExpandMore";
import FaceIcon from '@material-ui/icons/Face';
import {NavLink} from "react-router-dom";

import moduleClasses from "./Dashboard.module.css";
import {HomeIcon, useStyles} from "./DashboardStyles";

import PersonalArea from "../../components/PersonalArea/PersonalArea";
import {useSelector} from "react-redux";
import {Button} from "@material-ui/core";
import { useMediaQuery } from 'react-responsive'

export default function DashBoard({children}) {
  const classes = useStyles();
  const theme = useTheme();
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 768px)' })

  const [open, setOpen] = useState(() => isTabletOrMobile ? false : true);

  const [usersListDropdown, setUsersListDropdown] = useState(false);
  const [coursesDropdown, setCoursesDropdown] = useState(false);
  const [examsDropdown, setExamsDropdown] = useState(false);
  const [financeDropdown, setFinanceDropdown] = useState(false);
  const [analyticsDropdown, setAnalyticsDropdown] = useState(false);

  const userData = useSelector((state) => state.personalData.userData.data);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleUsersListDropdownClick = () => {
    setUsersListDropdown(!usersListDropdown);
  };

  const handleCoursesDropdownClick = () => {
    setCoursesDropdown(!coursesDropdown);
  };

  const handleExamsDropdownClick = () => {
    setExamsDropdown(!examsDropdown);
  };

  const handleFinanceDropdownClick = () => {
    setFinanceDropdown(!financeDropdown);
  };

  const handleAnalyticsDropdown = () => {
    setAnalyticsDropdown(!analyticsDropdown);
  };

  const breadcrumbs = useSelector(state => state.breadcrumbs.breadcrumbs);

  function isLast(ci) {
    return ci === breadcrumbs.length - 1;
  }

  return (
    <div className={classes.root}>
      <CssBaseline/>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon style={{fill: "#000"}}/>
          </IconButton>
          <div style={{width: "100%"}} className="d-flex justify-content-between align-items-center">
            <nav className={`${moduleClasses.breadcrumbs} row justify-content-center align-items-center`}>
              <ol style={{backgroundColor: "#fff"}} className="breadcrumb p-0 m-0">
                {
                  breadcrumbs.map((crumb, ci) => {
                    const disabled = isLast(ci) ||
                    (crumb["disabled"] !== undefined && crumb["disabled"]) ? "disabled" : "";
                    return (
                      <li
                        key={ci}
                        className="breadcrumb-item align-items-center"
                      >
                        <NavLink className={`btn p-0 btn-link ${disabled} ${moduleClasses.crums}`} to={crumb.to}>
                          <Button style={{textTransform: "unset"}} color="primary">
                            {crumb.title}
                          </Button>
                        </NavLink>
                      </li>
                    )
                  })
                }
              </ol>
            </nav>
            <PersonalArea/>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div
          className={classes.drawerHeader}
          style={{backgroundColor: "#232f3e"}}
        >
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon style={{fill: "#fff"}}/>
            ) : (
              <ChevronRightIcon style={{fill: "#fff"}}/>
            )}
          </IconButton>
        </div>
        <Divider/>
        <List>
          <NavLink to="/">
            <ListItem button key="Home">
              <ListItemIcon>
                <HomeIcon color="action" style={{fill: "#fff"}}/>
              </ListItemIcon>
              <ListItemText
                className={moduleClasses.DrawerLink}
                primary="Мои данные"
              />
            </ListItem>
          </NavLink>

          {userData && userData.is_trainer ? (
            <NavLink to="/studentsList">
              <ListItem
                button
                key="UsersList/studentsList"
              >
                <ListItemIcon>
                  <PeopleIcon color="action" style={{fill: "#fff"}}/>
                </ListItemIcon>
                <ListItemText
                  className={moduleClasses.DrawerLink}
                  primary="Студенты"
                />
              </ListItem>
            </NavLink>
          ) : null}

          {userData && userData.is_administrator ? (
            <>
              <ListItem
                button
                key="UsersList"
                onClick={handleUsersListDropdownClick}
              >
                <ListItemIcon>
                  <PeopleIcon color="action" style={{fill: "#fff"}}/>
                </ListItemIcon>
                <ListItemText
                  primary="Пользователи"
                  className={moduleClasses.DrawerLink}
                />
                {usersListDropdown ? <ExpandLess/> : <ExpandMore/>}
              </ListItem>

              <Collapse in={usersListDropdown} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <NavLink to="/adminsList">
                    <ListItem
                      button
                      key="UsersList/adminsList"
                      className={classes.nested}
                    >
                      <ListItemText
                        className={moduleClasses.DrawerLink}
                        primary="Администраторы"
                      />
                    </ListItem>
                  </NavLink>

                  <NavLink to="/trainersList">
                    <ListItem
                      button
                      key="UsersList/trainersList"
                      className={classes.nested}
                    >
                      <ListItemText
                        className={moduleClasses.DrawerLink}
                        primary="Менторы"
                      />
                    </ListItem>
                  </NavLink>
                  <NavLink to="/studentsList">
                    <ListItem
                      button
                      key="UsersList/studentsList"
                      className={classes.nested}
                    >
                      <ListItemText
                        className={moduleClasses.DrawerLink}
                        primary="Студенты"
                      />
                    </ListItem>
                  </NavLink>
                  <NavLink to="/staffMembersList">
                    <ListItem
                      button
                      key="UsersList/staffMembers"
                      className={classes.nested}
                    >
                      <ListItemText
                        className={moduleClasses.DrawerLink}
                        primary="Сотрудники"
                      />
                    </ListItem>
                  </NavLink>
                </List>
              </Collapse>
            </>
          ) : null}

          {userData && userData.is_administrator ? (
            <>
            <ListItem button key="StudentsCategories">
            <NavLink style={{display: "flex"}} to="/students-categories">
              <ListItemIcon>
                <FaceIcon color="action" style={{fill: "#fff"}}/>
              </ListItemIcon>
              <ListItemText
                className={moduleClasses.DrawerLink}
                primary="Категории студентов"
              />
            </NavLink>
          </ListItem>
            </>
          ) : null}

          {userData && userData.is_administrator ? (
            <>
              <ListItem
                button
                key="Courses"
                onClick={handleCoursesDropdownClick}
              >
                <ListItemIcon>
                  <MenuBookIcon color="action" style={{fill: "#fff"}}/>
                </ListItemIcon>
                <ListItemText
                  className={moduleClasses.DrawerLink}
                  primary="Курсы"
                />
                {coursesDropdown ? <ExpandLess/> : <ExpandMore/>}
              </ListItem>

              <Collapse in={coursesDropdown} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <NavLink to="/courses">
                    <ListItem
                      button
                      key="courses/getCourses"
                      className={classes.nested}
                    >
                      <ListItemText
                        className={moduleClasses.DrawerLink}
                        primary="Курсы"
                      />
                    </ListItem>
                  </NavLink>

                  <NavLink to="/tags">
                    <ListItem
                      button
                      key="courses/getTags"
                      className={classes.nested}
                    >
                      <ListItemText
                        className={moduleClasses.DrawerLink}
                        primary="Тэги"
                      />
                    </ListItem>
                  </NavLink>
                </List>
              </Collapse>
            </>
          ) : null}

          <ListItem button key="Klasses">
            <NavLink style={{display: "flex"}} to="/klasses">
              <ListItemIcon>
                <SchoolIcon color="action" style={{fill: "#fff"}}/>
              </ListItemIcon>
              <ListItemText
                className={moduleClasses.DrawerLink}
                primary="Классы"
              />
            </NavLink>
          </ListItem>

          {userData && userData.is_administrator ? (
            <ListItem button key="Branches">
              <NavLink style={{display: "flex"}} to="/branches">
                <ListItemIcon>
                  <BusinessIcon color="action" style={{fill: "#fff"}}/>
                </ListItemIcon>
                <ListItemText
                  className={moduleClasses.DrawerLink}
                  primary="Филиалы"
                />
              </NavLink>
            </ListItem>
          ) : null}

          <ListItem button key="Exams" onClick={handleExamsDropdownClick}>
            <ListItemIcon>
              <CheckIcon color="action" style={{fill: "#fff"}}/>
            </ListItemIcon>
            <ListItemText
              className={moduleClasses.DrawerLink}
              primary="Экзамены"
            />
            {examsDropdown ? <ExpandLess/> : <ExpandMore/>}
          </ListItem>

          <Collapse in={examsDropdown} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <NavLink to="/exams">
                <ListItem
                  button
                  key="exams/getExams"
                  className={classes.nested}
                >
                  <ListItemText
                    className={moduleClasses.DrawerLink}
                    primary="Посмотреть экзамены"
                  />
                </ListItem>
              </NavLink>
              
              {userData && !userData.is_student ? (
              <NavLink to="/exams/addExam">
                <ListItem button key="exams/addExam" className={classes.nested}>
                  <ListItemText
                    className={moduleClasses.DrawerLink}
                    primary="Добавить экзамен"
                  />
                </ListItem>
              </NavLink>
              ) : null}
            </List>
          </Collapse>

          {userData && userData.is_administrator ? (
            <>
              <ListItem
                button
                key="finance"
                onClick={handleFinanceDropdownClick}
              >
                <ListItemIcon>
                  <MonetizationOnIcon color="action" style={{fill: "#fff"}}/>
                </ListItemIcon>
                <ListItemText
                  className={moduleClasses.DrawerLink}
                  primary="Финансы"
                />
                {financeDropdown ? <ExpandLess/> : <ExpandMore/>}
              </ListItem>

              <Collapse in={financeDropdown} timeout="auto" unmountOnExit>
                <List className="ml-3" component="div" disablePadding>
                  <NavLink className="p-0" to="/transactions">
                    <ListItem button key="finance/transactions">
                      <ListItemText
                        className={moduleClasses.DrawerLink}
                        primary="Транзакции"
                      />
                    </ListItem>
                  </NavLink>


                  <NavLink className="p-0" to="/wallets">
                    <ListItem button key="finance/wallets">
                      <ListItemText
                        className={moduleClasses.DrawerLink}
                        primary="Кошельки"
                      />
                    </ListItem>
                  </NavLink>

                  <NavLink className="p-0" to="/expenseTags">
                    <ListItem button key="finance/transactions">
                      <ListItemText
                        className={moduleClasses.DrawerLink}
                        primary="Категории расходов"
                      />
                    </ListItem>
                  </NavLink>
                </List>
              </Collapse>
            </>
          ) : null}

          {userData && userData.is_administrator ? (
            <ListItem button key="Inventories">
              <NavLink style={{display: "flex"}} to="/inventories">
                <ListItemIcon>
                  <AmpStoriesIcon color="action" style={{fill: "#fff"}}/>
                </ListItemIcon>
                <ListItemText
                  className={moduleClasses.DrawerLink}
                  primary="Инвентарь"
                />
              </NavLink>
            </ListItem>
          ) : null}

          {userData && userData.is_administrator ? (
          <ListItem button key="analytics" onClick={handleAnalyticsDropdown}>
            <ListItemIcon>
              <ShowChartIcon color="action" style={{fill: "#fff"}}/>
            </ListItemIcon>
            <ListItemText
              className={moduleClasses.DrawerLink}
              primary="Аналитика"
            />
            {analyticsDropdown ? <ExpandLess/> : <ExpandMore/>}
          </ListItem>
          ) : null}
          

          <Collapse in={analyticsDropdown} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <NavLink to="/students-analytics">
                <ListItem
                  button
                  key="students-analytics"
                  className={classes.nested}
                >
                  <ListItemText
                    className={moduleClasses.DrawerLink}
                    primary="Аналитика по студентам"
                  />
                </ListItem>
              </NavLink>
              <NavLink to="/finance-analytics">
                <ListItem
                  button
                  key="/finance-analytics"
                  className={classes.nested}
                >
                  <ListItemText
                    className={moduleClasses.DrawerLink}
                    primary="Аналитика по финансам"
                  />
                </ListItem>
              </NavLink>
            </List>
          </Collapse>

          {/* <ListItem button key="Inventories">
            <NavLink style={{ display: "flex" }} to="/students-analytics">
              <ListItemIcon>
                <ShowChartIcon color="action" style={{ fill: "#fff" }} />
              </ListItemIcon>
              <ListItemText
                className={moduleClasses.DrawerLink}
                primary="Аналитика"
              />
            </NavLink>
          </ListItem> */}
        </List>

        <Divider/>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader}/>
        {children}
      </main>
    </div>
  );
}
