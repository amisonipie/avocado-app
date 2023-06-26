import axios from "axios";

export const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: process.env.BASE_URL }) =>
  async ({ url, method, data, params, headers, body }) => {
    try {
      const result = await axios({
        url: baseUrl + url,
        method,
        data,
        body,
        params,
        headers,
      });
      return { data: result.data };
    } catch (axiosError) {
      let err = axiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };
