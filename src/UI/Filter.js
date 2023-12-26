import Select from "react-select";
// import classes from "./Element.module.scss";
import classes from "../components/FormElements/Element.module.scss";
const Filter = (props) => {
  const { config, onFilterChange } = props;
  return (
    // <div className="eep-options-div my-auto eep_select_maindiv">
    <div className="d-inline-block eep_select_div" style={{ zIndex: 100 }}>
      <Select
        options={config.dropdownOptions}
        placeholder=""
        classNamePrefix="eep_select_common contact_number"
        className={`form-control py-0 a_designation basic-single ${classes.formControl}`}
        style={{ height: "auto",zIndex:101 }}
        menuPlacement="bottom"
        onChange={(event) => onFilterChange(event)}
        defaultValue={config.defaultValue}
      />
    </div>
    // </div>
  );
};
export default Filter;
