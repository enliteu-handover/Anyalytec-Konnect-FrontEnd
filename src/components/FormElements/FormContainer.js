import React from "react";
import { useState, useEffect } from "react";
import Element from "./Element";
const FormContainer = (props) => {
  const { fields } = props.userData ? props.userData : [];
  const { onUpload, response } = props;
  const submitted = "formSubmitted" in props ? props.formSubmitted : false;
  return (
    <React.Fragment>
      {fields
        ? fields.map((field, i) => (
            <React.Fragment key={i}>
              <Element
                field={field}
                submitted={submitted}
                onUpload={onUpload}
                response={response}
              ></Element>
            </React.Fragment>
          ))
        : null}
    </React.Fragment>
  );
};

export default FormContainer;
