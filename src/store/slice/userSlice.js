import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: 0,
  email: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUserId: (state, { payload }) => {
      state.userId = payload.userId;
    },
    setUserEmail: (state, { payload }) => {
      state.email = payload.email;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateUserId, setUserEmail } = userSlice.actions;

export default userSlice.reducer;
