import { createApi } from "@reduxjs/toolkit/query/react";
import axios from "axios";
import { axiosBaseQuery } from "../util/axiosBaseQuery";

const BASE_URL = "https://api.avocadodelivers.app/v1.0/";
const TAGTYPE = "ADDRESSES";
const ENDPOINT = "addresses";

axios.defaults["content-type"] = "application/json";

export const addressApi = createApi({
  reducerPath: "restaurantApi",
  tagTypes: [TAGTYPE],
  baseQuery: axiosBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: (builder) => ({
    addAddress: builder.mutation({
      query: (body) => {
        return {
          method: "POST",
          url: `${ENDPOINT}`,
          data: body,
        };
      },
      invalidatesTags: [TAGTYPE],
      transformResponse: (response) => {
        return response.result.data;
      },
    }),
    updateAddress: builder.mutation({
      query: ({ id, ...rest }) => {
        return {
          method: "POST",
          url: `${ENDPOINT}/${id}/update`,
          data: rest,
        };
      },
      invalidatesTags: [TAGTYPE],
      transformResponse: (response) => {
        return response.result.data;
      },
    }),
  }),
});

export const { useAddAddressMutation, useUpdateAddressMutation } = addressApi;
