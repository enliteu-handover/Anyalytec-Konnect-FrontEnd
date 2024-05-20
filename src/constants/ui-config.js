const FILTER_CONFIG = {
  defaultValue: { label: "All", value: true },
  dropdownOptions: [
    { label: "All", value: "" },
    { label: "Active", value: true },
    { label: "Inactive", value: false },
  ],
};

const HIDE_SHOW_FILTER_CONFIG = {
  defaultValue: { label: "Visible", value: true },
  dropdownOptions: [
    { label: "Visible", value: true },
    { label: "Invisible", value: false },
  ],
};

const FILTER_LIST_CONFIG = {
  defaultValue: { label: "Pending", value: true },
  dropdownOptions: [
    { label: "All", value: "all" },
    { label: "Pending", value: false },
    { label: "Approved", value: true },
  ],
};

const BULK_ACTION = {
  defaultValue: { label: "Select", value: "" },
  dropdownOptions: [
    { label: "Active", value: true },
    { label: "Inactive", value: false },
  ],
};

const TYPE_BASED_FILTER = {
  defaultValue: { label: "Month", value: "month" },
  dropdownOptions: [
    { label: "Date", value: "date" },
    { label: "Month", value: "month" },
    { label: "Quarter", value: "quarter" },
    { label: "Four Months", value: "fourMonths" },
    { label: "Half Year", value: "halfYear" },
    { label: "Year", value: "year" },
  ],
};

const TYPE_BASED_FILTER_WITH_BETWEEN_DATES = {
  defaultValue: { label: "Month", value: "month" },
  dropdownOptions: [
    { label: "Date", value: "date" },
    { label: "Between Dates", value: "betweenDates" },
    { label: "Month", value: "month" },
    { label: "Quarter", value: "quarter" },
    { label: "Four Months", value: "fourMonths" },
    { label: "Half Year", value: "halfYear" },
    { label: "Year", value: "year" },
  ],
};

export {
  FILTER_CONFIG,
  HIDE_SHOW_FILTER_CONFIG,
  BULK_ACTION,
  FILTER_LIST_CONFIG,
  TYPE_BASED_FILTER,
  TYPE_BASED_FILTER_WITH_BETWEEN_DATES,
};
