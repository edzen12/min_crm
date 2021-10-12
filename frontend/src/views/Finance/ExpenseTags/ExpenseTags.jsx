import React, { useEffect, useState } from "react";
import {useDispatch, useSelector} from "react-redux";
import Dashboard from "../../../layouts/Dashboard/Dashboard";
import axios from "../../../axios/configuratedAxios";
import { makeStyles, withStyles }from '@material-ui/core/styles';
import {fetchExpenseTagsAction} from '../../../redux/actions/index'
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
import Loader from "../../../components/UI/Loader/Loader";


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


function ExpenseTags() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [isLoading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [expenseTagsInputValue, setExpenseTagsInputValue] = useState('');
  const [errorText, setErrorText] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);
  const [modalFormType, setModalFormType] = useState('');
  const [updatingScopeId, setUpdatingScopeId] = useState(-1);

  const expenseTags = useSelector(state => state.finance.expenseTags.data && state.finance.expenseTags.data.results);

  const confirm = useConfirm();
  const { addToast } = useToasts();
  
  useEffect(() => {
    dispatch(fetchExpenseTagsAction()).then(()=> setLoading(false))
  }, []);

  const handleTagDelete = (scopeName, scopeId) => {
    confirm({ title: `Удалить категорию расхода, ${scopeName}?`, description: '' })
      .then(() => {
        setLoading(true)
        axios.delete(`/finances/expense-tags/${scopeId}`)
          .then(response => {
            setLoading(false)
            addToast(`Категория расхода ${scopeName}, удалена!`, {
              appearance: "success",
              autoDismiss: true
            });
            window.location.reload(false);
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
    if(expenseTagsInputValue.trim() != ''){
      setSubmitting(true);
      setLoading(true)
      axios.post('/finances/expense-tags/', {name: expenseTagsInputValue})
        .then(() => {
          setExpenseTagsInputValue('');
          setSubmitting(false);
          setOpen(false);
          dispatch(fetchExpenseTagsAction())
          setLoading(false)
          addToast(`Категория расхода, создана!`, {
            appearance: "success",
            autoDismiss: true
          });
          window.location.reload(false);
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
    if(expenseTagsInputValue.trim() != ''){
      setLoading(true)
      setSubmitting(true);
      axios.patch(`/finances/expense-tags/${updatingScopeId}/`, {name: expenseTagsInputValue})
        .then(() => {
          setExpenseTagsInputValue('');
          setSubmitting(false);
          setOpen(false);
          setLoading(false)
          addToast(`Категория расхода, обновлена!`, {
            appearance: "success",
            autoDismiss: true
          });
          window.location.reload(false);
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

  return (
    <Dashboard>
    { isLoading && <Loader/> }


    <Grid container direction="row" justify="space-between" className="mb-4">
      {
        !expenseTags ? (
          <Typography variant="h6">В системе отсутствуют категории расхода!</Typography>
        ) : (
          <Typography
            variant="h6"
            className="mt-2"
            style={{ margin: 4, color: 'rgb(27, 36, 48)' }}
            >
            Категории расхода
          </Typography>
        )
      }
      
      <Button
          color="primary"
          variant="contained"
          onClick={() => {
            setModalFormType('Добавить')
            setExpenseTagsInputValue('')
            handleFormOpen()
          }}
        >
          Создать 
      </Button>
    </Grid>
     


      <Dialog open={open} onClose={handleFormClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{modalFormType} категорию расхода</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="tagName"
            label="Категории расхода"
            type="text"
            fullWidth
            value={expenseTagsInputValue}
            onChange={(e) => {
              setErrorText('')
              setExpenseTagsInputValue(e.target.value)
            }}
            error = {errorText.length === 0 ? false : true }
            helperText={errorText}
            disabled={isSubmitting}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFormClose} color="primary">
            Отмена
          </Button>
          <Button onClick={() => {
              switch(modalFormType){
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
        expenseTags && expenseTags.map(item => {
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
                      setExpenseTagsInputValue(item.name)
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

export default ExpenseTags;
