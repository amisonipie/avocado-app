import { createApi } from "@reduxjs/toolkit/query/react";
import axios from "axios";
import { axiosBaseQuery } from "../util/axiosBaseQuery";
const BASE_URL = "https://api.avocadodelivers.app/v1.0/";
const TAGTYPE = "REPORT";
const ENDPOINT = "report";

axios.defaults["content-type"] = "application/json";

export const reportApi = createApi({
  reducerPath: "reportApi",
  tagTypes: [TAGTYPE],
  baseQuery: axiosBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: (builder) => ({
    sendReport: builder.mutation({
      query: (body) => ({
        url: ENDPOINT,
        method: "POST",
        data: body,
      }),
      invalidatesTags: [TAGTYPE],
    }),
  }),
});

export const { useSendReportMutation } = reportApi;
