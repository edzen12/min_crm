import React, { useEffect, useState } from "react";
import Dashboard from "../../../layouts/Dashboard/Dashboard";
import axios from "../../../axios/configuratedAxios";
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
import Loader from "../../../components/UI/Loader/Loader";


const useStyles = makeStyles(theme => ({
  tagPaper: {
    padding: '15px',
    border: '1px solid rgb(27, 36, 48)',
    fontWeight: 'bold',
    color: 'rgb(27, 36, 48)',
    display: 'flex',
  },
  tagBtn: {
    cursor: 'pointer',
    opacity: '1',
    '&:hover': {
      opacity: '0.7'
    }
  }
}))

function StudentsCategories() {
  const classes = useStyles();
  const [isLoading, setLoading] = useState(false)
  const [tags, setTags] = useState([]);
  const [open, setOpen] = useState(false);
  const [tagInputValue, setTagInputValue] = useState('');
  const [errorText, setErrorText] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);
  const [modalFormType, setModalFormType] = useState('');
  const [updatingTagId, setUpdatingTagId] = useState(-1);

  const confirm = useConfirm();
  const { addToast } = useToasts();

  async function fetchTags() {

    try {
      setLoading(true);
      const response = await axios.get('users/students/student-categories/');
      setTags(response.data.results)
      setLoading(false);

    } catch (error) {
      addToast("??????-???? ?????????? ???? ??????!", {
        appearance: "error",
        autoDismiss: true
      })
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTags();
  }, []);

  const handleTagDelete = (tagName, tagId) => {
    let tagsCopy = tags.slice();
    confirm({ title: `?????????????? ??????????????????, ${tagName}?`, description: '' })
      .then(() => {
        setTags(tagsCopy.filter(item => item.id !== tagId));
        axios.delete(`users/students/student-categories/${tagId}`)
          .then(response => {
            addToast(`?????????????????? ${tagName}, ?????????????? !`, {
              appearance: "success",
              autoDismiss: true
            });
          })
          .catch(e => {
            addToast("??????-???? ?????????? ???? ??????!", {
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

  const createCourseTag = () => {
    if (tagInputValue.trim() != '') {
      setSubmitting(true);
      axios.post('users/students/student-categories/', { title: tagInputValue })
        .then(response => {
          setTagInputValue('');
          setSubmitting(false);
          setOpen(false);
          fetchTags();
          addToast(`??????????????????, ??????????????!`, {
            appearance: "success",
            autoDismiss: true
          });
        })
        .catch(error => {
          addToast("??????-???? ?????????? ???? ??????!", {
            appearance: "error",
            autoDismiss: true
          })
        })
    } else {
      setErrorText('?????????????????????? ????????!')
    }
  }

  const updateCourseTag = () => {
    if (tagInputValue.trim() != '') {
      setSubmitting(true);
      axios.patch(`users/students/student-categories/${updatingTagId}/`, { title: tagInputValue })
        .then(response => {
          setTags(tags.map(item =>
            item.id === updatingTagId ? { id: item.id, title: tagInputValue } : item
          ))
          setTagInputValue('');
          setSubmitting(false);
          setOpen(false);
          addToast(`??????????????????, ??????????????????!`, {
            appearance: "success",
            autoDismiss: true
          });
        })
        .catch(error => {
          console.log(error.response)
        })
    } else {
      setErrorText('?????????????????????? ????????!')
    }
  }

  return (
    <Dashboard>

      { isLoading && <Loader />}


      <Grid container direction="row" justify="space-between" className="mb-4">
        {tags &&
          (tags.length === 0 ? (
            <Typography variant="h6">?? ?????????????? ?????????????????????? ??????????????????!</Typography>
          ) : (
              <Typography
                variant="h6"
                className="mt-2"
                style={{ margin: 4, color: 'rgb(27, 36, 48)' }}
              >
                ?????????????????? ??????????????????
              </Typography>
            ))
        }

        <Button
          color="primary"
          variant="contained"
          className="mt-2"
          onClick={() => {
            setModalFormType('????????????????')
            setTagInputValue('')
            handleFormOpen()
          }}
        >
          ?????????????? ??????????????????
      </Button>

      </Grid>

      <Dialog open={open} onClose={handleFormClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{modalFormType} ??????????????????</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="tagName"
            label="?????????????????? ????????????????"
            type="text"
            fullWidth
            value={tagInputValue}
            onChange={(e) => {
              setErrorText('')
              setTagInputValue(e.target.value)
            }}
            error={errorText.length === 0 ? false : true}
            helperText={errorText}
            disabled={isSubmitting}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFormClose} color="primary">
            ????????????
        </Button>
          <Button onClick={() => {
            switch (modalFormType) {
              case '????????????????':
                createCourseTag();
                break;
              case '????????????????':
                updateCourseTag();
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
          tags.map(item => {
            return (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Paper className={classes.tagPaper}>
                  <Grid container direction="row" justify="space-between" alignItems="center">
                    {item.title}

                    <Grid>
                      <IconButton
                        aria-label="edit"
                        className={classes.tagBtn}
                        onClick={() => {
                          setModalFormType('????????????????')
                          setTagInputValue(item.title)
                          setUpdatingTagId(item.id)
                          handleFormOpen()
                        }}
                      >
                        <EditIcon />
                      </IconButton>

                      <IconButton
                        aria-label="delete"
                        className={classes.tagBtn}
                        onClick={() => handleTagDelete(item.title, item.id)}
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

export default StudentsCategories;
