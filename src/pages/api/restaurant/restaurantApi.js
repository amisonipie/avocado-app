import { createApi } from "@reduxjs/toolkit/query/react";
import axios from "axios";
import { axiosBaseQuery } from "../util/axiosBaseQuery";
const BASE_URL = "https://api.avocadodelivers.app/v1.0/";
const TAGTYPE = "RESTAURANT";
const ENDPOINT = "restaurants";

axios.defaults["content-type"] = "application/json";

export const restaurantApi = createApi({
  reducerPath: "restaurantApi",
  tagTypes: [TAGTYPE],
  baseQuery: axiosBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: (builder) => ({
    getRestaurantList: builder.query({
      query: (args) => {
        const fields = JSON.stringify([
          "id",
          "name",
          "description",
          "prep_time",
          "service_radius",
          "addresses",
          "banner",
          "brand.name",
          "media",
          "tags",
        ]);
        return {
          method: "get",
          url: `${ENDPOINT}?fields=${fields}`,
        };
      },
      providesTags: [TAGTYPE],
      transformResponse: (response) => {
        const { restaurants, pagination } = response.result.data;
        const parsedRestaurants = restaurants.map(({ addresses, ...rest }) => {
          return {
            ...rest,
            address: addresses,
          };
        });
        return { restaurants: parsedRestaurants, pagination };
      },
    }),
    getRestaurantDetail: builder.query({
      query: (args) => {
        const { id } = args;
        const fields = JSON.stringify([
          "id",
          "name",
          "description",
          "tip_out",
          "tax",
          "prep_time",
          "service_radius",
          "addresses",
          "media",
          "delivery",
          "pos",
          "pickup",
          "tags",
          "secret_key",
          "secret_pin",
          "delivery_fees_type",
          "delivery_fees",
        ]);
        return {
          method: "get",
          url: `${ENDPOINT}/${id}?fields=${fields}`,
        };
      },
      providesTags: [TAGTYPE],
      transformResponse: (response) => {
        return response.result.data;
      },
    }),
    getBrandList: builder.query({
      query: (body) => {
        const fields = JSON.stringify([
          "id",
          "name",
          "fees_type",
          "fees_value",
          "restaurants",
          "user"
        ]);
        return {
          method: "get",
          url: `brands`,
        };
      },
      providesTags: [{ type: "Brand", id: "LIST" }],
      transformResponse: (response) => {
        return response.result.data;
      }
    }),
    updateRestaurantDetail: builder.mutation({
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
    addRestaurantDetail: builder.mutation({
      query: (rest) => {
        return {
          method: "POST",
          url: `${ENDPOINT}`,
          data: rest,
        };
      },
      invalidatesTags: [TAGTYPE],
      transformResponse: (response) => {
        return response.result.data;
      },
    }),
    deleteRestaurantItem: builder.mutation({
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
  useLazyGetRestaurantListQuery,
  useGetRestaurantListQuery,
  useGetRestaurantDetailQuery,
  useLazyGetBrandListQuery,
  useGetBrandListQuery,
  useUpdateRestaurantDetailMutation,
  useAddRestaurantDetailMutation,
  useDeleteRestaurantItemMutation,
} = restaurantApi;
