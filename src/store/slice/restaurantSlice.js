import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  restaurantId: 0,
  name: "",
  restaurantDetails: {},
};

export const restaurantSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setRestaurantData: (state, { payload }) => {
      const { id, name, ...rest } = payload;
      state.restaurantId = id;
      state.name = name;
      state.restaurantDetails = rest;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setRestaurantData } = restaurantSlice.actions;

export default restaurantSlice.reducer;
