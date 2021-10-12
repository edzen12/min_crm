import React, {useEffect} from 'react';
import {Button} from '@material-ui/core';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import {makeStyles} from '@material-ui/core/styles';
import {authenticationService} from "../../jwt/_services";
import {useConfirm} from "material-ui-confirm";
import {useDispatch, useSelector} from "react-redux";
import {fetchUserData} from "../../redux/actions";
import {useToasts} from "react-toast-notifications";
import anonymus from "../../assets/images/anonymus.png"
import {NavLink} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  paper: {
    marginRight: theme.spacing(2),
  },
}));

export default function PersonalArea() {
  const confirm = useConfirm();
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  const {addToast} = useToasts();

  const profileData = useSelector(state => state.personalData.profileData.data)
  const getUserError = useSelector(state => state.personalData.userData.error);
  const getProfileError = useSelector(state => state.personalData.profileData.error);

  const prevOpen = React.useRef(open);
  const dispatch = useDispatch();

  useEffect(() => {
    if (getUserError || getProfileError) {
      addToast("Что-то пошло не так!", {
        appearance: "error",
        autoDismiss: true
      })
    }
  }, [getProfileError, getUserError])
  useEffect(() => {
    dispatch(fetchUserData())
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  const handleLogoutClick = () => {
    confirm({description: "Завершить сеанс"})
      .then(() => authenticationService.logout())
      .catch(() => {
        /* ... */
      });
  };

  return (
    <div className={classes.root}>
      <div>
        <Button
          ref={anchorRef}
          aria-controls={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        >
          <img
            style={{width: "30px", height: "30px", borderRadius: "100%"}}
            src={profileData && profileData.user.avatar ? profileData.user.avatar : anonymus}
            alt=""/>
        </Button>
        <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
          {({TransitionProps, placement}) => (
            <Grow
              {...TransitionProps}
              style={{transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'}}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                    <MenuItem component={NavLink} to="/" onClick={handleClose}>Личный кабинет</MenuItem>
                    <MenuItem color="default" onClick={handleLogoutClick}>Выйти</MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </div>
  );
}