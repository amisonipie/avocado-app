import { createApi } from "@reduxjs/toolkit/query/react";
import axios from "axios";
import { axiosBaseQuery } from "../util/axiosBaseQuery";

const BASE_URL = "https://api.avocadodelivers.app/v1.0/";
const TAGTYPE = "FLAVOR";
const ENDPOINT = "flavors";

axios.defaults["content-type"] = "application/json";

export const flavorApi = createApi({
  reducerPath: "flavorApi",
  tagTypes: [TAGTYPE],
  baseQuery: axiosBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: (builder) => ({
    getFlavorByRestaurantId: builder.query({
      query: (args) => {
        const { restaurantId } = args;
        const params = {
          restaurant_id: restaurantId,
        };
        return {
          method: "get",
          url: ENDPOINT,
          params,
        };
      },
      providesTags: [TAGTYPE],
      transformResponse: (response) => {
        return response.result.data.flavors;
      },
    }),
  }),
});

export const { useGetFlavorByRestaurantIdQuery } = flavorApi;
