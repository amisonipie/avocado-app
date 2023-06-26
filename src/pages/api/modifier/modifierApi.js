import { createApi } from "@reduxjs/toolkit/query/react";
import axios from "axios";
import { axiosBaseQuery } from "../util/axiosBaseQuery";

const BASE_URL = "https://api.avocadodelivers.app/v1.0/";
const MODIFIER_TAGTYPE = "MODIFIER";
const ENDPOINT = "modifiers";

axios.defaults["content-type"] = "application/json";

export const modifierApi = createApi({
  reducerPath: "modifierApi",
  tagTypes: [MODIFIER_TAGTYPE],
  baseQuery: axiosBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: (builder) => ({
    getModifierList: builder.query({
      query: (args) => {
        const { restaurantId } = args;
        const fields = JSON.stringify([
          "id",
          "restaurant_id",
          "name",
          "is_required",
          "type",
          "pickup",
          "delivery",
          "pos",
          "status",
          "modifier_item",
          "category.id",
          "category.name",
          "updated_at"
        ]);
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
      providesTags: [MODIFIER_TAGTYPE],
      transformResponse: (response) => {
        return response.result;
      },
    }),
    addModifier: builder.mutation({
      query: (body) => ({
        url: ENDPOINT,
        method: "POST",
        data: body,
      }),
      invalidatesTags: [MODIFIER_TAGTYPE],
      transformResponse: (response) => {
        return response.result.data;
      },
    }),
    updateModifier: builder.mutation({
      query: ({ id, ...rest }) => {
        return {
          url: `${ENDPOINT}/${id}/update`,
          method: "POST",
          data: rest,
        };
      },
      invalidatesTags: [MODIFIER_TAGTYPE],
    }),
    deleteModifier: builder.mutation({
      query: ({ id }) => {
        return {
          url: `${ENDPOINT}/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: [MODIFIER_TAGTYPE],
    }),
  }),
});

export const {
  useGetModifierListQuery,
  useUpdateModifierMutation,
  useAddModifierMutation,
  useLazyGetModifierListQuery,
  useDeleteModifierMutation
} = modifierApi;
