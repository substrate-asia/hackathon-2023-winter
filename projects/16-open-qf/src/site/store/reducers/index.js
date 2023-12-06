import { combineReducers } from "@reduxjs/toolkit";
import accountReducer from "./accountSlice";

export default combineReducers({
  account: accountReducer,
});
