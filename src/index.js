import React from "react";
import ReactDOM from "react-dom";
import "../node_modules/jquery/dist/jquery.min.js";
import "../node_modules/bootstrap/dist/js/bootstrap.min.js";
import "../node_modules/react-datepicker/dist/react-datepicker.min.js";
import "./index.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import store from "./store/index";
import "./fonts/helveticaneue/HelveticaNeue.ttf";
import { BrowserRouter } from "react-router-dom";
import "./http/http-interceptor";
import i18next from "i18next";
import englishContent from "./translations/en.json";
import arabicContent from "./translations/ar.json";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// import { createBrowserHistory } from "history";

// export const history = createBrowserHistory();

const initOptions = {
  interpolation: { escapeValue: false },
  lng: "en",
  resources: {
    en: {
      translation: englishContent,
    },
    ar: {
      translation: arabicContent,
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init(initOptions);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
