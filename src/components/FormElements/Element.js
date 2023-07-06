import React from "react";
import Password from "./Password";
import DatePickerComponent from "./DatePickerComponent";
import Email from "./Email";
import SelectDropdown from "./Select";
import TextField from "./TextField";
import TextArea from "./TextArea";
import NumberField from "./NumberField";
import FileField from "./FileField";
import SignatureField from "./SignatureField";

const Elements = ({ field, submitted, onUpload, response,maxLength }) => {
  
  switch (field.type) {
    case "text":
      return field.display && <TextField field={field} submitted={submitted} />;
    case "textArea":
      return field.display && <TextArea field={field} submitted={submitted} />;
    case "select":
      return (
        field.display && <SelectDropdown field={field} submitted={submitted} />
      );
    case "email":
      return field.display && <Email field={field} submitted={submitted} />;
    case "datePicker":
      return (
        field.display && (
          <React.Fragment>
          <div className="eepCustomDatepicker">
            <DatePickerComponent field={field} submitted={submitted} />
          </div>
          </React.Fragment>
        )
      );
    case "password":
      return field.display && <Password field={field} submitted={submitted} />;
    case "number":
      return (
        field.display && <NumberField maxLength={maxLength} field={field} submitted={submitted} />
      );
    case "file":
      return (
        field.display && (
          <FileField field={field} submitted={submitted} onUpload={onUpload} response={response} />
        )
      );
    case "signature":
      return (
        field.display && ( <SignatureField field={field} submitted={submitted} /> )
      );
    default:
      return <h1>Elements</h1>;
  }
};
export default Elements;
