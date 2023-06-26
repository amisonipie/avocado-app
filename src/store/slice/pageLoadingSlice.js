import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isPageLoading: false,
};

export const pageLoadingSlice = createSlice({
  name: "pageLoading",
  initialState,
  reducers: {
    setIsPageLoading: (state, { payload }) => {
      state.isPageLoading = payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setIsPageLoading } = pageLoadingSlice.actions;

export default pageLoadingSlice.reducer;
