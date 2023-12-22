import { combineReducers } from "@reduxjs/toolkit";
import toastReducer from "./toastSlice";
import applyReducer from "./applySlice";

export default combineReducers({
  toast: toastReducer,
  apply: applyReducer,
});
