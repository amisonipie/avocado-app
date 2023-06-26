import { createApi } from "@reduxjs/toolkit/query/react";
import axios from "axios";
import { axiosBaseQuery } from "../util/axiosBaseQuery";

const BASE_URL = "https://api.avocadodelivers.app/v1.0/";
const TAGTYPE = "FOODITEM";
const ENDPOINT = "food-items";

axios.defaults["content-type"] = "application/json";

export const foodItemApi = createApi({
  reducerPath: "foodItemApi",
  tagTypes: [TAGTYPE],
  baseQuery: axiosBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: (builder) => ({
    getFoodItemByCategoryId: builder.query({
      query: (args) => {
        const { categoryId } = args;
        const fields = JSON.stringify([
          "id",
          "name",
          "description",
          "price",
          "flavor_id",
          "is_recommended",
          "category_id",
          "modifier_id",
          "modifier.id",
          "chef_rec_mod_item_id",
          "SKU",
          "pos",
          "pickup",
          "delivery",
          "status",
          "modifier.name",
          "modifier.modifier_item",
        ]);
        const params = {
          category_id: categoryId,
          fields,
        };
        return {
          method: "get",
          url: ENDPOINT,
          params,
        };
      },
      providesTags: [TAGTYPE],
      transformResponse: (response) => {
        return response.result.data.food_items;
      },
    }),
    addFoodItem: builder.mutation({
      query: (body) => ({
        url: ENDPOINT,
        method: "POST",
        data: body,
      }),
      invalidatesTags: [TAGTYPE],
    }),
    updateFoodItem: builder.mutation({
      query: ({ id, ...rest }) => {
        return {
          url: `${ENDPOINT}/${id}/update`,
          method: "POST",
          data: rest,
        };
      },
      invalidatesTags: [TAGTYPE],
    }),
    deleteFoodItem: builder.mutation({
      query: ({ id }) => {
        return {
          url: `${ENDPOINT}/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: [TAGTYPE],
    }),
  }),
});

export const {
  useGetFoodItemByCategoryIdQuery,
  useLazyGetFoodItemByCategoryIdQuery,
  useAddFoodItemMutation,
  useUpdateFoodItemMutation,
  useDeleteFoodItemMutation
} = foodItemApi;
