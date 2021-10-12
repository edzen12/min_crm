import React from 'react';
import Input from './UI/Input';
import FormikMaskedInput from './UI/FormikMaskedInput';
import TextArea from './UI/TextArea';
import Select from './UI/Select';
import RadioButtons from './UI/RadioButtons'; 
import CheckboxGroup from './UI/CheckboxGroup';
import DatePicker from './UI/DatePicker';
import UploadFile from './UI/UploadFile';
import FileUploader from './UI/FileUploader'
import SelectAutoComplete from './UI/SelectAutoComplete'
import RangePicker from './UI/RangePicker'
import DateTimePicker from './UI/DateTimePicker';
import TimePicker from "./UI/TimePicker";


function FormikControl(props) {
  const { control, ...rest } = props
  switch (control) {
    case 'input':
      return <Input {...rest} />
    case 'maskedInput':
      return <FormikMaskedInput {...rest} />
    case 'textarea':
      return <TextArea {...rest} />
    case 'select':
      return <Select {...rest} />
    case 'autocomplete':
      return <SelectAutoComplete />
    case 'radio':
      return <RadioButtons {...rest} />
    case 'checkbox':
      return <CheckboxGroup {...rest} />
    case 'date':
      return <DatePicker {...rest} />
    case 'datetime':
      return <DateTimePicker {...rest} />
    case 'date-range':
      return <RangePicker {...rest} />
    case 'file':
      return <UploadFile {...rest} />
    case 'file-upload':
      return <FileUploader {...rest} />
      case 'time':
        return <TimePicker {...rest} />
    default:
      return null
  }
}

export default FormikControl;

