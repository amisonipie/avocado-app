import { createApi } from "@reduxjs/toolkit/query/react";
import axios from "axios";
import { axiosBaseQuery } from "../util/axiosBaseQuery";
const BASE_URL = "https://api.avocadodelivers.app/v1.0/";
const TAGTYPE = "TEMPERATURE";
const ENDPOINT = "temperatures";

axios.defaults["content-type"] = "application/json";

export const temperatureApi = createApi({
  reducerPath: "temperatureApi",
  tagTypes: [TAGTYPE],
  baseQuery: axiosBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: (builder) => ({
    getTemperatureList: builder.query({
      query: (args) => {
        const fields = JSON.stringify(["id", "name", "temperature_item"]);
        const params = {
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
        return response.result.data.temperature;
      },
    }),
  }),
});

export const { useGetTemperatureListQuery } = temperatureApi;
