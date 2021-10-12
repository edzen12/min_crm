/* eslint-disable max-classes-per-file */
/* eslint-disable react/no-unused-state */
import * as React from 'react';
import {connect, useDispatch, useSelector} from 'react-redux';
import Paper from '@material-ui/core/Paper';
import { ViewState, EditingState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  MonthView,
  Toolbar,
  DateNavigator,
  AppointmentTooltip,
  AppointmentForm,
  WeekView,
  ViewSwitcher,
  Appointments,
  AllDayPanel,
  TodayButton,
} from '@devexpress/dx-react-scheduler-material-ui';
import { connectProps } from '@devexpress/dx-react-core';
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import DashBoard from '../../../layouts/Dashboard/Dashboard';
import ScheDuleForm from './ScheduleForm';
import { fetchKlassDetail } from '../../../redux/actions/klassDetail';
import axios from "../../../axios/configuratedAxios";
import { useToasts } from 'react-toast-notifications';
import {setBreadcrumbs} from "../../../redux/actions";


const containerStyles = theme => ({
  container: {
    width: theme.spacing(68),
    padding: 0,
    paddingBottom: theme.spacing(2),
  },
  content: {
    padding: theme.spacing(2),
    paddingTop: 0,
  },
  header: {
    overflow: 'hidden',
    paddingTop: theme.spacing(0.5),
  },
  closeButton: {
    float: 'right',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 2),
  },
  button: {
    marginLeft: theme.spacing(2),
  },
  picker: {
    marginRight: theme.spacing(2),
    '&:last-child': {
      marginRight: 0,
    },
    width: '50%',
  },
  wrapper: {
    display: 'flex',
    justifyContent: 'space-start',
    padding: theme.spacing(1, 0),
  },
  icon: {
    margin: theme.spacing(2, 0),
    marginRight: theme.spacing(2),
  },
  textField: {
    width: '100%',
  },
});


const AppointmentFormContainer = withStyles(containerStyles, { name: 'AppointmentFormContainer' })(ScheDuleForm);

const styles = theme => ({
  addButton: {
    position: 'absolute',
    bottom: theme.spacing(1) * 3,
    right: theme.spacing(1) * 4,
  },
});

const ToolbarWithLoading = withStyles(styles, { name: 'Toolbar' })(
  ({ children, classes, ...restProps }) => (
    <div className={classes.toolbarRoot}>
      <Toolbar.Root {...restProps}>
        {children}
      </Toolbar.Root>
      <LinearProgress className={classes.progress} />
    </div>
  ),
);

const mapSchedules = (schedule) => ({
  title: schedule.title,
  startDate: new Date(`${schedule.day}T${schedule.start_time}`),
  endDate: new Date(`${schedule.day}T${schedule.end_time}`),
  id: schedule.id,
  material: schedule.material,
  homework_link: schedule.homework_link,
  schedule_attendances: schedule.schedule_attendances
});


class Demo extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      fetchedData: {},
      currentDate: '2018-06-27',
      confirmationVisible: false,
      editingFormVisible: false,
      deletedAppointmentId: undefined,
      editingAppointment: undefined,
      previousAppointment: undefined,
      addedAppointment: {},
      startDayHour: 9,
      endDayHour: 19,
      isNewAppointment: false,
    };

    this.toggleConfirmationVisible = this.toggleConfirmationVisible.bind(this);
    this.commitDeletedAppointment = this.commitDeletedAppointment.bind(this);
    this.toggleEditingFormVisibility = this.toggleEditingFormVisibility.bind(this);

    this.commitChanges = this.commitChanges.bind(this);
    this.onEditingAppointmentChange = this.onEditingAppointmentChange.bind(this);
    this.onAddedAppointmentChange = this.onAddedAppointmentChange.bind(this);
    this.appointmentForm = connectProps(AppointmentFormContainer, () => {
    const {
      editingFormVisible,
      editingAppointment,
      data,
      addedAppointment,
      isNewAppointment,
      previousAppointment,
    } = this.state;

      const currentAppointment = data
        .filter(appointment => editingAppointment && appointment.id === editingAppointment.id)[0]
        || addedAppointment;
      const cancelAppointment = () => {
        if (isNewAppointment) {
          this.setState({
            editingAppointment: previousAppointment,
            isNewAppointment: false,
          });
        }
      };

      return {
        visible: editingFormVisible,
        appointmentData: currentAppointment,
        current_chedule_attendances: currentAppointment.schedule_attendances,
        commitChanges: this.commitChanges,
        visibleChange: this.toggleEditingFormVisibility,
        onEditingAppointmentChange: this.onEditingAppointmentChange,
        cancelAppointment,
        klassId: this.props.match.params.id,
        locale: 'ru-RU',
        userData: this.props.userData
      };
    });
  }

  async changeLocalState() {
    await this.props.fetchKlassDetail(this.props.match.params.id);
    let formattedData = this.props.schedules
      ? this.props.schedules.map(mapSchedules) : [];

    this.setState({ data: formattedData });
  }

  componentDidMount() {
    this.props.setBreadcrumbs()
    this.changeLocalState()
  }

  componentDidUpdate() {
    this.appointmentForm.update();
  }

  onEditingAppointmentChange(editingAppointment) {
    this.setState({ editingAppointment });
  }

  onAddedAppointmentChange(addedAppointment) {
    this.setState({ addedAppointment });
    const { editingAppointment } = this.state;
    if (editingAppointment !== undefined) {
      this.setState({
        previousAppointment: editingAppointment,
      });
    }
    this.setState({ editingAppointment: undefined, isNewAppointment: true });
  }

  setDeletedAppointmentId(id) {
    this.setState({ deletedAppointmentId: id });
  }

  toggleEditingFormVisibility() {
    const { editingFormVisible } = this.state;
    this.setState({
      editingFormVisible: !editingFormVisible,
    });
  }

  toggleConfirmationVisible() {
    const { confirmationVisible } = this.state;
    this.setState({ confirmationVisible: !confirmationVisible });
  }
  
  commitDeletedAppointment() {
    // const { addToast } = useToasts();
    this.setState((state) => {
      const { data, deletedAppointmentId } = state;
      const nextData = data.filter(appointment => appointment.id !== deletedAppointmentId);

      axios.delete(`schedules/${deletedAppointmentId}`)
        .then(response => {
        })
        .catch(e => {
          // addToast("Что-то пошло не так!", {
          //   appearance: "error",
          //   autoDismiss: true
          // })
        })

      return { data: nextData, deletedAppointmentId: null };
    });
    this.toggleConfirmationVisible();
  }

  commitChanges({ added, changed, deleted }) {
    this.setState((state) => {
      let { data } = state;
      if (added) {
        const startingAddedId = data.length > 0 ? data[data.length - 1].id + 1 : 0;
        data = [...data, { id: startingAddedId, ...added }];
      }
      if (changed) {
        data = data.map(appointment => (
          changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment));
      }
      if (deleted !== undefined) {
        this.setDeletedAppointmentId(deleted);
        this.toggleConfirmationVisible();
      }
      return { data, addedAppointment: {} };
    });
  }
  

  render() {
    const {
      currentDate,
      data,
      confirmationVisible,
      editingFormVisible,
      startDayHour,
      endDayHour,
    } = this.state;
    const { classes } = this.props;

    return (
      <DashBoard>
        <Paper>
          <Scheduler
            data={data}
            height={660}
            locale="ru-RU"
          >
            <ViewState
            />

            <EditingState
              onCommitChanges={this.commitChanges}
              onEditingAppointmentChange={this.onEditingAppointmentChange}
              onAddedAppointmentChange={this.onAddedAppointmentChange}
            />

            <MonthView 
              locale="ru-RU"
            />

            <WeekView
              startDayHour={startDayHour}
              endDayHour={endDayHour}
              locale="ru-RU"
            />

            <Toolbar
              {...this.props.loading ? { rootComponent: ToolbarWithLoading } : null}
            />
            
            <DateNavigator />
            <TodayButton 
              messages={{today: 'Сегодня'}}
            />

            <AllDayPanel 
              messages={{allDay: 'Целый день'}}
            />

            <Appointments />
            {/* <ViewSwitcher 
              monthsLabel={'Месяц'}
            /> */}

            <AppointmentTooltip
              showOpenButton
              showCloseButton
            />

            <AppointmentForm
              overlayComponent={this.appointmentForm}
              visible={editingFormVisible}
              onVisibilityChange={this.toggleEditingFormVisibility}
            />


          </Scheduler>

          <Dialog
            open={confirmationVisible}
            onClose={this.cancelDelete}
          >
            <DialogTitle>
              Удаление занятие
          </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Вы уверены что хотите удалить занятие?
            </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.toggleConfirmationVisible} color="primary" variant="outlined">
                Отмена
            </Button>
              <Button onClick={this.commitDeletedAppointment} color="secondary" variant="outlined">
                Удалить
            </Button>
            </DialogActions>
          </Dialog>
          
          {this.props.userData && this.props.userData.is_student ? null : (
          <Fab
            color="secondary"
            className={classes.addButton}
            onClick={() => {
              this.setState({ editingFormVisible: true });
              this.onEditingAppointmentChange(undefined);
              this.onAddedAppointmentChange({
                startDate: new Date(currentDate).setHours(startDayHour),
                endDate: new Date(currentDate).setHours(startDayHour + 1),
              });
            }}
          >
            <AddIcon />
          </Fab>
          )}

        </Paper>
      </DashBoard>
    );
  }
}

function mapStateToProps(state) {
  return {
    klassDetail: state.klassDetail.klassDetail,
    loading: state.klassDetail.loading,
    schedules: state.klassDetail.schedules,
    userData: state.personalData.userData.data
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchKlassDetail: (klassId) => dispatch(fetchKlassDetail(klassId)),
    setBreadcrumbs: () => dispatch(setBreadcrumbs(
    [
      {title: "Классы", to: "/klasses"},
      {title: "Подробнее", to: ""},
    ]
  ))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { name: 'EditingDemo' })(Demo));
