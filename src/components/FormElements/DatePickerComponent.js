import React, { useState, useContext, useEffect } from "react";
// import moment from "moment";
// import "../../../node_modules/react-datepicker/dist/react-datepicker.min.js";
// import "../../../node_modules/react-datepicker/dist/react-datepicker.min.css";
import DatePicker from "react-datepicker";
import { FormContext } from "./FormContext";
import { addMonths, subMonths, subYears,addYears } from 'date-fns';

const DatePickerComponent = (props) => {
  const { field, submitted } = props;

  const [startDate, setStartDate] = useState();
  const [fieldTouched, setFieldTouched] = useState(false);
  const valueIsValid = startDate ? true : false;
  const inputIsInvalid = !valueIsValid && fieldTouched;
  const { handleChange } = useContext(FormContext);
  useEffect(() => {
    const initValue = field.value ? new Date(field.value) : null;
    setStartDate(initValue);
  }, [field.value]);

  useEffect(() => {
    if (submitted) {
      setFieldTouched(true);
    }
  }, [submitted]);

  const onBlurHandler = () => {
    setFieldTouched(true);
  };

  const handleDatePickerChange = (date, event) => {
    setStartDate(date);

    handleChange(field, date?.toISOString()?.slice(0, 10));
  };

  const handleCalendarClose = () => { };

  const handleCalendarOpen = () => { };

  const fieldClasses = inputIsInvalid ? `${"invalid"}` : "";

  const getFieldMinMaxDate = (field, selectedDate) => {
    let minDate = null;
    let maxDate = null;
  
    if (field.min.subYear) {
      minDate = subYears(new Date(), field.min.val);
    } else if (field.min.addMonth) {
      minDate = addMonths(new Date(), field.min.val);
    }
  
    if (field.max.subYear) {
      maxDate = subYears(new Date(), field.max.val);
    } else if (field.max.addMonth) {
      maxDate = addMonths(new Date(), field.max.val);
    }
  
    // Calculate max date based on the selected date
    if (selectedDate) {
      maxDate = addYears(selectedDate, 18);
    }
  
    return { minDate, maxDate };
  };
  const { minDate, maxDate } = getFieldMinMaxDate(field);
  return (
    <div
      className={`col-md-12 form-group text-left ${field.mandatory ? "required" : ""
        }`}
    >
      <label className="control-label">{field.label}</label>
      <div className="eepCustomDatepicker">
        <DatePicker
          className="form-control "
          selected={startDate}
          onChange={(date, event) => handleDatePickerChange(date, event)}
          onBlur={onBlurHandler}
          onCalendarClose={handleCalendarClose}
          onCalendarOpen={handleCalendarOpen}
          showMonthDropdown
          showYearDropdown
          scrollableYearDropdown
          dropdownMode="select"
          peekNextMonth
          dateFormat="yyyy/MM/dd"
          disabled={"disabled" in field ? field["disabled"] : false}
          placeholderText="Click to select a date"
          // minDate={field.min.subYear ? subYears(new Date(), field.min.val) : field.min.addMonth ? addMonths(new Date(), field.min.val) : null}
          // maxDate={field.max.subYear ?
          //   subYears(new Date(), field.max.val) :
          //   field.max.addMonth ?
          //     addMonths(new Date(), field.max.val) : null}
          minDate={minDate}
        maxDate={maxDate}
        />
      </div>
      {inputIsInvalid && (
        <div>
          <span
            className="login_error un_error text-danger ereorMsg"
            style={{ display: "inline" }}
          >
            {field.label} cannot be left blank
          </span>
        </div>
      )}
    </div>
  );
};
export default DatePickerComponent;
