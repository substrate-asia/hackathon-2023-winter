import { combineReducers } from "@reduxjs/toolkit";
import toastReducer from "./toastSlice";

export default combineReducers({
  toast: toastReducer,
});
