import { createApi } from "@reduxjs/toolkit/query/react";
import axios from "axios";
import { axiosBaseQuery } from "../util/axiosBaseQuery";

const BASE_URL = "https://api.avocadodelivers.app/v1.0/";
const TAGTYPE = "MODIFIER_ITEM";
const ENDPOINT = "modifier-items";

axios.defaults["content-type"] = "application/json";

export const modifierItemApi = createApi({
  reducerPath: "modifierItemApi",
  tagTypes: [TAGTYPE],
  baseQuery: axiosBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: (builder) => ({
    getModifierItemList: builder.query({
      query: (args) => {
        const { modifierId } = args;
        const params = {
          modifier_id: modifierId,
        };
        return {
          method: "get",
          url: ENDPOINT,
          params,
        };
      },
      transformResponse: (response) => {
        return response.result.data.modifier_items;
      },
      providesTags: [TAGTYPE],
    }),
    addModifierItem: builder.mutation({
      query: (body) => ({
        url: ENDPOINT,
        method: "POST",
        data: body,
      }),
      invalidatesTags: [TAGTYPE],
    }),
    updateModifierItem: builder.mutation({
      query: ({ id, ...rest }) => {
        return {
          url: `${ENDPOINT}/${id}/update`,
          method: "POST",
          data: rest,
        };
      },
      invalidatesTags: [TAGTYPE],
    }),
    deleteModifierItem: builder.mutation({
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
  useGetModifierItemListQuery,
  useLazyGetModifierItemListQuery,
  useAddModifierItemMutation,
  useUpdateModifierItemMutation,
  useDeleteModifierItemMutation,
} = modifierItemApi;
