import React, { useEffect, useState } from "react";
import Dashboard from "../../layouts/Dashboard/Dashboard";
import axios from "../../axios/configuratedAxios";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import Paper from '@material-ui/core/Paper';
import {
  Typography, Grid
} from "@material-ui/core";
import { useConfirm } from "material-ui-confirm";
import DeleteIcon from '@material-ui/icons/Delete';
import { useToasts } from 'react-toast-notifications';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CardMedia from '@material-ui/core/CardMedia';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Loader from "../../components/UI/Loader/Loader";
import InfoIcon from '@material-ui/icons/Info';
import DialogContentText from '@material-ui/core/DialogContentText';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Slide from '@material-ui/core/Slide';


const useStyles = makeStyles(theme => ({
  partnerPaper: {
    padding: '15px',
    // border: '1px solid rgb(27, 36, 48)',
    fontWeight: 'bold',
    color: 'rgb(27, 36, 48)',
    display: 'flex',
  },
  cardInfo: {
    display: "flex",
    alignItems: "center",
  },
  media: {
    height: "80px",
    width: "80px",
    objectFit: "contain",
    marginRight: "5px",
  },
  partnerBtn: {
    cursor: 'pointer',
    opacity: '1',
    '&:hover': {
      opacity: '0.7'
    }
  },
  editDialog: {
    width: "40vw",
  },
  input: {
    display: 'none',
  },
}))

const AddButton = withStyles(theme => ({
  root: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
}))(Button);


function Partners() {
  const classes = useStyles();
  const [isLoading, setLoading] = useState(false)
  const [partners, setPartners] = useState([]);
  const [open, setOpen] = useState(false);
  const [openInfo, setOpenInfo] = React.useState(false);
  const [partnerTitleValue, setPartnerTitleValue] = useState('');
  const [partnerDescValue, setPartnerDescValue] = useState('');
  const [partnerFileValue, setPartnerFileValue] = useState(null);
  const [errorText, setErrorText] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);
  const [modalFormType, setModalFormType] = useState('');
  const [updatingPartnerId, setUpdatingPartnerId] = useState(-1);

  const confirm = useConfirm();
  const { addToast } = useToasts();

  async function fetchPartners() {

    try {
      setLoading(true);
      const response = await axios.get('courses/partners/');
      setPartners(response.data.results)
      setLoading(false);

    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPartners();
  }, []);

  const handlePartnerDelete = (partnerName, partnerId) => {
    let partnersCopy = partners.slice();
    confirm({ title: `Удалить тэг, ${partnerName}?`, description: '' })
      .then(() => {
        setPartners(partnersCopy.filter(item => item.id !== partnerId));
        axios.delete(`courses/partners/${partnerId}`)
          .then(response => {
            addToast(`Тэг ${partnerName}, удален!`, {
              appearance: "success",
              autoDismiss: true
            });
          })
          .catch(e => e.response);
      })
  }

  const handleFormOpen = () => {
    setOpen(true);
  }

  const handleFormClose = () => {
    setOpen(false);
  }
  const formData = new FormData();
  const createCoursePartner = () => {
    if (partnerTitleValue.trim() != '' &&
      partnerDescValue.trim() != '' &&
      partnerFileValue) {
      setSubmitting(true);

      formData.append("title", partnerTitleValue);
      formData.append("description", partnerDescValue);
      formData.append("logo", partnerFileValue, partnerFileValue.name);

      axios.post('courses/partners/', formData)
        .then(response => {
          setPartnerTitleValue('');
          setPartnerDescValue('');
          setPartnerFileValue(null);
          setSubmitting(false);
          setOpen(false);
          fetchPartners();
          addToast(`Тэг, создан!`, {
            appearance: "success",
            autoDismiss: true
          });
        })
        .catch(error => {
          console.log(error.response)
        })
    } else {
      setErrorText('Обязательно поле!')
    }
  }

  const updateCoursePartner = () => {
    setSubmitting(true);

    partnerTitleValue && formData.append("title", partnerTitleValue);
    partnerDescValue && formData.append("description", partnerDescValue);
    partnerFileValue && formData.append("logo", partnerFileValue, partnerFileValue.name);
    axios.patch(`courses/partners/${updatingPartnerId}/`, formData)
      .then(response => {
        setPartners(partners.map(item =>
          item.id === updatingPartnerId ? { id: response.data.id, title: response.data.title, description: response.data.description, logo: response.data.logo } : item
        ))
        setPartnerTitleValue('');
        setPartnerDescValue('');
        setPartnerFileValue(null);
        setSubmitting(false);
        setOpen(false);
        addToast(`Тэг, обновлен!`, {
          appearance: "success",
          autoDismiss: true
        });
      })
      .catch(error => {
        console.log(error.response)
      })
  }
  return (
    <Dashboard>

      { isLoading && <Loader />}


      <Grid container direction="row" justify="space-between" className="mb-4">
        {partners &&
          (partners.length === 0 ? (
            <Typography variant="h6">В системе отсутствуют партнеры!</Typography>
          ) : (
              <Typography
                variant="h6"
                className="mt-2"
                style={{ margin: 4, color: 'rgb(27, 36, 48)' }}
              >
                Партнеры курсов
              </Typography>
            ))
        }

        <AddButton
          color="primary"
          variant="contained"
          onClick={() => {
            setModalFormType('Добавить')
            setPartnerTitleValue('')
            setPartnerDescValue('')
            setPartnerFileValue(null)
            handleFormOpen()
          }}
        >
          Добавить партнера
      </AddButton>

      </Grid>

      <Dialog open={open} onClose={handleFormClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{modalFormType} партнера</DialogTitle>
        <DialogContent className={classes.editDialog}>
          <TextField
            autoFocus
            margin="dense"
            id="partnerName"
            label="Название партнер"
            type="text"
            fullWidth
            value={partnerTitleValue}
            onChange={(e) => {
              setErrorText('')
              setPartnerTitleValue(e.target.value)
            }}
            error={errorText.length === 0 ? false : true}
            helperText={errorText}
            disabled={isSubmitting}
          />
          <TextField
            autoFocus
            margin="dense"
            id="partnerDescription"
            label="Описание партнер"
            multiline
            type="text"
            rows={8}
            fullWidth
            value={partnerDescValue}
            onChange={(e) => {
              setErrorText('')
              setPartnerDescValue(e.target.value)
            }}
            error={errorText.length === 0 ? false : true}
            helperText={errorText}
            disabled={isSubmitting}
          />
          <input
            accept="image/*"
            className={classes.input}
            id="contained-button-file"
            multiple
            type="file"
            onChange={e=>setPartnerFileValue(e.currentTarget.files[0])}
          />
          <label htmlFor="contained-button-file">
            <Button variant="contained" color="primary" component="span">
              Прикрепить лого
        </Button>
          </label>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFormClose} color="primary">
            Отмена
        </Button>
          <Button onClick={() => {
            switch (modalFormType) {
              case 'Добавить':
                createCoursePartner();
                break;
              case 'Изменить':
                updateCoursePartner();
                break;
              default:
                break;
            }
          }} color="primary">
            {modalFormType}
          </Button>
        </DialogActions>
      </Dialog>

      <Grid container spacing={3}>
        {
          partners.map(item => {
            return (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Paper className={classes.partnerPaper}>
                  <Grid container direction="row" justify="space-between" alignItems="center">
                    <div className={classes.cardInfo}>
                      <CardMedia
                        component="img"
                        alt={`${item.title} logo`}
                        className={classes.media}
                        image={item.logo}
                      />
                      {item.title}
                    </div>

                    <Grid>
                      <IconButton
                        aria-label="edit"
                        className={classes.partnerBtn}
                        onClick={() => {
                          setModalFormType('Изменить')
                          setPartnerTitleValue(item.title)
                          setPartnerDescValue(item.description)
                          setUpdatingPartnerId(item.id)
                          handleFormOpen()
                        }}
                      >
                        <EditIcon />
                      </IconButton>

                      <IconButton
                        aria-label="primary"
                        className={classes.partnerBtn}
                        onClick={() =>{
                          setOpenInfo(true)
                          setPartnerTitleValue(item.title)
                          setPartnerDescValue(item.description)
                          setUpdatingPartnerId(item.id)
                        }}
                      >
                        <InfoIcon />
                      </IconButton>

                      <IconButton
                        aria-label="delete"
                        className={classes.partnerBtn}
                        onClick={() => handlePartnerDelete(item.title, item.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                    <Dialog
                      open={openInfo}
                      onClose={() => setOpenInfo(false)}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                    >
                      <DialogTitle id="alert-dialog-title">{partnerTitleValue}</DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          {partnerDescValue}
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={() => setOpenInfo(false)} color="primary" autoFocus>
                          Закрыть
                        </Button>
                      </DialogActions>
                    </Dialog>

                  </Grid>
                </Paper>
              </Grid>
            )
          })
        }
      </Grid>
    </Dashboard>
  );
}

export default Partners;
