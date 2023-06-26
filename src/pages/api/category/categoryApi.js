import { createApi } from "@reduxjs/toolkit/query/react";
import axios from "axios";
import { axiosBaseQuery } from "../util/axiosBaseQuery";
const BASE_URL = "https://api.avocadodelivers.app/v1.0/";
const CATEGORY_TAGTYPE = "CATEGORY";
const ENDPOINT = "categories";

axios.defaults["content-type"] = "application/json";

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  tagTypes: [CATEGORY_TAGTYPE],
  baseQuery: axiosBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: (builder) => ({
    getCategoryList: builder.query({
      query: (args) => {
        const { restaurantId } = args;
        const fields = JSON.stringify(["id", "name", "food_items", "updated_at"]);
        const params = {
          restaurant_id: restaurantId,
          fields,
        };
        return {
          method: "get",
          url: ENDPOINT,
          params,
        };
      },
      providesTags: [CATEGORY_TAGTYPE],
    }),
    addCategory: builder.mutation({
      query: (body) => ({
        url: ENDPOINT,
        method: "POST",
        data: body,
      }),
      invalidatesTags: [CATEGORY_TAGTYPE],
    }),
    deleteCategoryItem: builder.mutation({
      query: ({ id }) => {
        return {
          url: `${ENDPOINT}/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: [CATEGORY_TAGTYPE],
    }),
  }),
});

export const {
  useLazyGetCategoryListQuery,
  useGetCategoryListQuery,
  useAddCategoryMutation,
  useDeleteCategoryItemMutation
} = categoryApi;
