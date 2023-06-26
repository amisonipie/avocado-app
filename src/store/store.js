import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import { categoryApi } from "../pages/api/category/categoryApi";
import { flavorApi } from "../pages/api/flavor/flavorApi";
import { foodItemApi } from "../pages/api/food-item/foodItemApi";
import { modifierItemApi } from "../pages/api/modifier-item/modifierItemApi";
import { modifierApi } from "../pages/api/modifier/modifierApi";
import { reportApi } from "../pages/api/reports/reportApi";
import { restaurantApi } from "../pages/api/restaurant/restaurantApi";
import { temperatureApi } from "../pages/api/temperature/temperatureApi";
import { userApi } from "../pages/api/user/userApi";
import { persistedReducer } from "./reducer";

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      userApi.middleware,
      restaurantApi.middleware,
      categoryApi.middleware,
      modifierApi.middleware,
      foodItemApi.middleware,
      modifierItemApi.middleware,
      flavorApi.middleware,
      temperatureApi.middleware,
      reportApi.middleware
    ),
});

setupListeners(store.dispatch);
