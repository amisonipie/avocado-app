import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { categoryApi } from "../../pages/api/category/categoryApi";
import { flavorApi } from "../../pages/api/flavor/flavorApi";
import { foodItemApi } from "../../pages/api/food-item/foodItemApi";
import { modifierItemApi } from "../../pages/api/modifier-item/modifierItemApi";
import { modifierApi } from "../../pages/api/modifier/modifierApi";
import { reportApi } from "../../pages/api/reports/reportApi";
import { restaurantApi } from "../../pages/api/restaurant/restaurantApi";
import { temperatureApi } from "../../pages/api/temperature/temperatureApi";
import { userApi } from "../../pages/api/user/userApi";
import alertSlice from "../slice/alertSlice";
import pageLoadingSlice from "../slice/pageLoadingSlice";
import restaurantSlice from "../slice/restaurantSlice";
import userSlice from "../slice/userSlice";

const rootReducer = combineReducers({
  [userApi.reducerPath]: userApi.reducer,
  [restaurantApi.reducerPath]: restaurantApi.reducer,
  [categoryApi.reducerPath]: categoryApi.reducer,
  [modifierApi.reducerPath]: modifierApi.reducer,
  [foodItemApi.reducerPath]: foodItemApi.reducer,
  [modifierItemApi.reducerPath]: modifierItemApi.reducer,
  [flavorApi.reducerPath]: flavorApi.reducer,
  [temperatureApi.reducerPath]: temperatureApi.reducer,
  [reportApi.reducerPath]: reportApi.reducer,
  user: userSlice,
  restaurant: restaurantSlice,
  page: pageLoadingSlice,
  alert: alertSlice,
});

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["user", "restaurant"],
};

export const persistedReducer = persistReducer(persistConfig, rootReducer);
