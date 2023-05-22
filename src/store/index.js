import { configureStore } from "@reduxjs/toolkit";
import breadCrumbSlice from "./breadcrumb-slice";
import loginSlice from "./login-slice";
import sharedDataSlice from "./shared-data-slice";
import tabsSlice from "./tabs-slice";
import errorHanldingSlice from "./error-handling";
import toggleSidebarStateSlice from "./toggle-sidebar-state";

const store = configureStore({
  reducer: {
    login: loginSlice.reducer,
    breadcrumb: breadCrumbSlice.reducer,
    sharedData: sharedDataSlice.reducer,
    tabs: tabsSlice.reducer,
    errorHandling: errorHanldingSlice.reducer,
    toggleState: toggleSidebarStateSlice.reducer
  },
});

export default store;
