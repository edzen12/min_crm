import React, {useState} from 'react';
import {DropzoneDialog} from "material-ui-dropzone";
import Button from "@material-ui/core/Button";
import {Typography, Link} from '@material-ui/core';

export default function ImageDropzone(props) {

  const [open, setOpen] = useState(false);
  const [currentImageName, setcurrentImageName] = useState('Нет файла')
  const {error} = props
  return (
    <div
      className="mb-3 mt-5"
    >
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        {props.text}
      </Button>

      <DropzoneDialog
        acceptedFiles={props.acceptedFiles}
        dropzoneText="Выберите или перетащите файл"
        dialogTitle="Загрузить файл"
        cancelButtonText="Отмена"
        submitButtonText="Загрузить"
        previewText="Файл(ы): "
        maxFileSize={5000000}
        filesLimit={1}
        open={open}
        alertSnackbarProps={{message: 'bazar jok!'}}
        onClose={() => setOpen(false)}
        onSave={(files) => {
          props.setFieldValue(props.name, files[0])
          if(props.setFieldTouched){
            props.setFieldTouched(props.name, true);
          }
          setOpen(false);
        }}
        showPreviews={true}
        showAlerts={false}
        showFileNamesInPreview={true}
        getFileAddedMessage={(fileName) => setcurrentImageName(fileName)}
        onChange={props.onChange}
      />

      {
        props.existingFileLink && typeof props.existingFileLink === 'string'
          ? <Typography className="mt-2">
            <Link href={props.existingFileLink}>{props.existingFileLink.substring(8, 28)}</Link>
          </Typography>
          : <Typography style={error && {color: "#dc3545"}} className="mt-2" color={"textSecondary"}>
            {currentImageName.length > 30 ? currentImageName.substring(0, 29) + "..." : currentImageName}
          </Typography>
      }
    </div>
  );
}
