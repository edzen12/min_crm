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
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Loader from "../../components/UI/Loader/Loader";


const useStyles = makeStyles(theme => ({
  scopePaper: {
    padding: '15px',
    border: '1px solid rgb(27, 36, 48)',
    fontWeight: 'bold',
    color: 'rgb(27, 36, 48)',
    display: 'flex',
  },
  scopeBtn: {
    cursor: 'pointer',
    opacity: '1',
    '&:hover': {
      opacity: '0.7'
    }
  }
}))

const AddButton = withStyles(theme => ({
  root: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
}))(Button);


function Scopes() {
  const classes = useStyles();
  const [isLoading, setLoading] = useState(false);
  const [scopes, setScopes] = useState([]);
  const [open, setOpen] = useState(false);
  const [scopeInputValue, setScopeInputValue] = useState('');
  const [errorText, setErrorText] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);
  const [modalFormType, setModalFormType] = useState('');
  const [updatingScopeId, setUpdatingScopeId] = useState(-1);

  const confirm = useConfirm();
  const { addToast } = useToasts();

  async function fetchScopes() {

    try {
      setLoading(true);
      const response = await axios.get('corses/scopes/');
      setScopes(response.data.results)
      setLoading(false);

    } catch (error) {
      addToast("Что-то пошло не так!", {
        appearance: "error",
        autoDismiss: true
      })
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchScopes();
  }, []);

  const handleTagDelete = (scopeName, scopeId) => {
    let scopesCopy = scopes.slice();
    confirm({ title: `Удалить сферу применения, ${scopeName}?`, description: '' })
      .then(() => {
        setScopes(scopesCopy.filter(item => item.id !== scopeId));
        axios.delete(`courses/scopes/${scopeId}`)
          .then(response => {
            addToast(`Сфера применения ${scopeName}, удалена!`, {
              appearance: "success",
              autoDismiss: true
            });
          })
          .catch(e => {
            addToast("Что-то пошло не так!", {
              appearance: "error",
              autoDismiss: true
            })
          });
      })
  }

  const handleFormOpen = () => {
    setOpen(true);
  }

  const handleFormClose = () => {
    setOpen(false);
  }

  const createCourseScope = () => {
    if (scopeInputValue.trim() != '') {
      setSubmitting(true);
      axios.post('courses/scopes/', { name: scopeInputValue })
        .then(response => {
          setScopeInputValue('');
          setSubmitting(false);
          setOpen(false);
          fetchScopes();
          addToast(`Сфера применения, создана!`, {
            appearance: "success",
            autoDismiss: true
          });
        })
        .catch(error => {
          addToast("Что-то пошло не так!", {
            appearance: "error",
            autoDismiss: true
          })
        })
    } else {
      setErrorText('Обязательно поле!')
    }
  }

  const updateCourseScope = () => {
    if (scopeInputValue.trim() != '') {
      setSubmitting(true);
      axios.patch(`courses/scopes/${updatingScopeId}/`, { name: scopeInputValue })
        .then(response => {
          setScopes(scopes.map(item =>
            item.id === updatingScopeId ? { id: item.id, name: scopeInputValue } : item
          ))
          setScopeInputValue('');
          setSubmitting(false);
          setOpen(false);
          addToast(`Сфера применения, обновлена!`, {
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

  return (
    <Dashboard>
      { isLoading && <Loader />}


      <Grid container direction="row" justify="space-between" className="mb-4">
        {
          scopes.length === 0 ? (
            <Typography variant="h6">В системе отсутствуют сферы применения!</Typography>
          ) : (
              <Typography
                variant="h6"
                className="mt-2"
                style={{ margin: 4, color: 'rgb(27, 36, 48)' }}
              >
                Сферы применений курсов
              </Typography>
            )
        }

        <AddButton
          color="primary"
          variant="contained"
          onClick={() => {
            setModalFormType('Добавить')
            setScopeInputValue('')
            handleFormOpen()
          }}
        >
          Создать
      </AddButton>
      </Grid>



      <Dialog open={open} onClose={handleFormClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{modalFormType} сферу применения</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="tagName"
            label="Сфера применения курса"
            type="text"
            fullWidth
            value={scopeInputValue}
            onChange={(e) => {
              setErrorText('')
              setScopeInputValue(e.target.value)
            }}
            error={errorText.length === 0 ? false : true}
            helperText={errorText}
            disabled={isSubmitting}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFormClose} color="primary">
            Отмена
          </Button>
          <Button onClick={() => {
            switch (modalFormType) {
              case 'Добавить':
                createCourseScope();
                break;
              case 'Изменить':
                updateCourseScope();
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
          scopes.map(item => {
            return (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Paper className={classes.scopePaper}>
                  <Grid container direction="row" justify="space-between" alignItems="center">
                    {item.name}
                    <Grid>
                      <IconButton
                        aria-label="edit"
                        className={classes.scopeBtn}
                        onClick={() => {
                          setModalFormType('Изменить')
                          setScopeInputValue(item.name)
                          setUpdatingScopeId(item.id)
                          handleFormOpen()
                        }}
                      >
                        <EditIcon />
                      </IconButton>

                      <IconButton
                        aria-label="delete"
                        className={classes.scopeBtn}
                        onClick={() => handleTagDelete(item.name, item.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>

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

export default Scopes;
