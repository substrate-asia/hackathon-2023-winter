const { createSlice } = require("@reduxjs/toolkit");

const name = "apply";

const applySlice = createSlice({
  name,
  initialState: {
    formValue: {
      name: "",
      summary: "",
      category: "",
      links: [""],
      description: "",
      bannerCid: "",
      logoCid: "",
      donation: "",
    },
  },
  reducers: {
    setApplyFormValue(state, { payload }) {
      state.formValue = payload;
    },
    updateApplyFormValue(state, { payload }) {
      state.formValue = { ...state.formValue, ...payload };
    },
  },
});

export const applyFormValueSelector = (state) => state[name].formValue;

export const { setApplyFormValue, updateApplyFormValue } = applySlice.actions;

export default applySlice.reducer;
