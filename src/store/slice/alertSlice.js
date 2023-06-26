import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  severity: "",
  text: "",
  isOpen: false,
};

export const alertSlice = createSlice({
  name: "alertSlice",
  initialState,
  reducers: {
    showAlert: (state, { payload }) => {
      const { severity, text } = payload;
      state.severity = severity;
      state.text = text;
      state.isOpen = true;
    },
    closeAlert: (state) => {
      state.isOpen = false;
      state.severity = "";
      state.text = "";
    },
  },
});

// Action creators are generated for each case reducer function
export const { showAlert, closeAlert } = alertSlice.actions;

export default alertSlice.reducer;
